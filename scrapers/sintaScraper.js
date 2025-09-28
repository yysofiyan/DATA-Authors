import { chromium } from 'playwright';
import { writeFileSync, existsSync, readFileSync } from 'fs';

// Cache untuk mengurangi request berulang
const CACHE_PATH = './sinta_cache.json';

export default {
  async getAuthorProfile(sintaId, options = {}) {
    // Validate sintaId
    if (!sintaId || !/^\d+$/.test(sintaId)) {
      throw new Error('Invalid Sinta ID format. Sinta ID must be numeric.');
    }
    
    // Cek cache terlebih dahulu dengan pengecekan waktu kedaluwarsa
    if (existsSync(CACHE_PATH) && !options.forceRefresh) {
      try {
        const cache = JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
        if (cache[sintaId]) {
          const cachedData = cache[sintaId];
          const cachedAt = new Date(cachedData._cachedAt || 0);
          const now = new Date();
          const cacheAge = (now - cachedAt) / (1000 * 60 * 60); // in hours
          
          // Cache valid for 24 hours
          if (cacheAge < 24) {
            console.log(`Using cached data for Sinta ID: ${sintaId} (cached ${cacheAge.toFixed(1)} hours ago)`);
            return cachedData;
          } else {
            console.log(`Cache expired for Sinta ID: ${sintaId} (cached ${cacheAge.toFixed(1)} hours ago)`);
          }
        }
      } catch (e) {
        console.log('Cache read error, continuing without cache');
      }
    }

    let browser;
    let page;
    
    try {
      console.log(`Launching browser for Sinta ID: ${sintaId}`);
      browser = await chromium.launch({ 
        headless: options.headless ?? true,
        slowMo: options.debug ? 100 : 50,
        args: [
          '--disable-blink-features=AutomationControlled',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ]
      });
      
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
        viewport: { width: 1280, height: 720 }
      });

      page = await context.newPage();
      await this._handleAuthentication(page, options);
      
      // Navigasi dengan retry mechanism
      console.log(`Navigating to Sinta profile for ID: ${sintaId}`);
      await this._navigateWithRetry(page, `https://sinta.kemdikbud.go.id/authors/profile/${sintaId}`, options);

      // Verifikasi halaman valid
      const pageTitle = await page.title();
      console.log(`Page title: ${pageTitle}`);
      
      if (pageTitle.includes('Error') || pageTitle.includes('Not Found') || pageTitle.includes('404')) {
        throw new Error(`Page not found for Sinta ID: ${sintaId}`);
      }

      // Ambil data utama
      console.log('Scraping profile data...');
      const profile = await this._scrapeProfileData(page, options);
      
      // Set the Sinta ID in the profile
      profile.sinta_id = sintaId;
      
      // Ambil publikasi dengan pagination
      console.log('Scraping publications...');
      profile.publikasi = await this._scrapePublications(page, options);
      
      // Validasi data penting
      if (!profile.nama || profile.nama === 'Nama tidak ditemukan') {
        console.warn(`Warning: Could not extract author name for Sinta ID: ${sintaId}`);
      }
      
      // Simpan ke cache
      this._updateCache(sintaId, profile);
      
      console.log(`Successfully scraped data for Sinta ID: ${sintaId}`);
      return profile;

    } catch (error) {
      console.error('Error during scraping:', error.message);
      await this._handleError(page, error, options, sintaId); // Pass sintaId to _handleError
      throw error;
    } finally {
      if (browser) {
        console.log('Closing browser...');
        await browser.close();
      }
    }
  },

  async _handleAuthentication(page, options) {
    if (options.auth) {
      await page.goto('https://sinta.kemdikbud.go.id/login');
      await page.fill('#username', options.auth.username);
      await page.fill('#password', options.auth.password);
      await page.click('#login-button');
      await page.waitForURL(/dashboard/);
      if (options.debug) console.log('Autentikasi berhasil');
    }
  },

  async _navigateWithRetry(page, url, options, retries = 2) {
    let lastError = null;
    
    while (retries >= 0) {
      try {
        console.log(`Navigation attempt ${3 - retries} to: ${url}`);
        
        // Navigate to the page with shorter timeout
        await page.goto(url, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        // Wait a bit for initial load (reduced from 3000 to 1500)
        await page.waitForTimeout(1500);
        
        // Check if we've been redirected to an error page
        const currentUrl = page.url();
        if (currentUrl.includes('error') || currentUrl.includes('not-found')) {
          throw new Error(`Redirected to error page: ${currentUrl}`);
        }
        
        // Check if page loaded by looking for any key elements with multiple strategies
        const keySelectors = [
          'h3 a', // Author name
          '.meta-profile', // Profile metadata
          '.container' // Main container
        ];
        
        let pageLoaded = false;
        for (const selector of keySelectors) {
          try {
            await page.waitForSelector(selector, { timeout: 5000 });
            pageLoaded = true;
            console.log(`Page loaded successfully, found key element: ${selector}`);
            break;
          } catch (e) {
            // Continue to next selector
          }
        }
        
        if (!pageLoaded) {
          // Try a more general approach
          const bodyText = await page.$eval('body', el => el.textContent).catch(() => '');
          if (bodyText && bodyText.length > 100) {
            pageLoaded = true;
            console.log('Page loaded successfully (detected by body content)');
          }
        }
        
        if (pageLoaded) {
          // Additional wait to ensure page is fully loaded (reduced from 5000 to 2000)
          await page.waitForTimeout(2000);
          console.log('Navigation completed successfully');
          return;
        }
        
        throw new Error('Page content not loaded properly');
      } catch (error) {
        lastError = error;
        if (retries > 0) {
          console.log(`Navigation failed (${retries} retries left): ${error.message}`);
          if (options.debug) console.log(`Retry navigasi (${retries} tersisa)...`);
          await page.waitForTimeout(3000); // Shorter wait between retries
          retries--;
        } else {
          break;
        }
      }
    }
    
    throw new Error(`Gagal navigasi setelah ${2} retry: ${lastError.message}`);
  },

  async _scrapeProfileData(page, options) {
    // Wait for key elements with better error handling and shorter timeout
    try {
      await Promise.race([
        page.waitForSelector('h3 a', { timeout: 15000 }).catch(() => console.log('Warning: Main title not found')),
        page.waitForSelector('.meta-profile', { timeout: 15000 }).catch(() => console.log('Warning: Meta profile not found'))
      ]);
    } catch (e) {
      console.log('Warning: Key elements not found, continuing with available data');
    }

    const safeEvaluate = async (selector, callback, defaultValue = null) => {
      let retries = 2; // Reduced from 3 to 2
      while (retries > 0) {
        try {
          const element = await page.$(selector);
          if (!element) {
            return defaultValue;
          }
          return await element.evaluate(callback);
        } catch (error) {
          if (options.debug) console.log(`Retry selector ${selector}...`);
          await page.waitForTimeout(500); // Shorter wait
          retries--;
        }
      }
      return defaultValue;
    };

    // More robust selectors for author information
    // In _scrapeProfileData function, update profile object with additional fields and change fallbacks to ''
    const profile = {
      nama: await safeEvaluate('h3 a, .author-name, .profile-name', el => el.textContent.trim(), ''),
      photoUrl: await safeEvaluate('img.profile-photo, .author-img, img[src*="photo"], .profile-img img', el => el.src, ''),
      afiliasi: await safeEvaluate('.meta-profile a:first-child, .affiliation:first-child, .author-affiliation:first-child', el => el.textContent.trim(), ''),
      department: await safeEvaluate('.meta-profile a:nth-child(2), .department, .author-department', el => el.textContent.trim(), ''),
      program_studi: await safeEvaluate('.meta-profile a:nth-child(3), .study-program, .author-program', el => el.textContent.trim(), ''),
      institutionName: await safeEvaluate('.institution-name, .affiliation-name', el => el.textContent.trim(), ''),
      institutionLocation: await safeEvaluate('.institution-location, .affiliation-location', el => el.textContent.trim(), ''),
      codePT: await safeEvaluate('.code-pt, [data-code="pt"]', el => el.textContent.trim(), ''),
      codeProdi: await safeEvaluate('.code-prodi, [data-code="prodi"]', el => el.textContent.trim(), ''),
      sinta_id: await safeEvaluate('.meta-profile a:last-child, .sinta-id, .author-sinta-id', el => {
        const text = el.textContent.trim();
        const match = text.match(/SINTA ID\s*:\s*(\d+)/i);
        return match ? match[1] : text.split(':').pop().trim();
      }, ''),
      bidang_keahlian: await safeEvaluate('.subject-list li a, .expertise-list li, .research-area', 
        elements => elements.map(el => el.textContent.trim()),
        []
      ),
      skor: {
        // Add parseFloat to convert string to number
        sinta_total: parseFloat(await safeEvaluate('.stat-profile > .row > div:nth-child(2) .pr-num, .sinta-score-total', el => el.textContent, 0)) || 0,
        sinta_3tahun: parseFloat(await safeEvaluate('.stat-profile > .row > div:nth-child(4) .pr-num, .sinta-score-3y', el => el.textContent, 0)) || 0,
        afiliasi_total: parseFloat(await safeEvaluate('.stat-profile > .row > div:nth-child(6) .pr-num, .affil-score-total', el => el.textContent, 0)) || 0,
        afiliasi_3tahun: parseFloat(await safeEvaluate('.stat-profile > .row > div:nth-child(8) .pr-num, .affil-score-3y', el => el.textContent, 0)) || 0
      },
      penelitian: []
    };

    // Extract metrics data correctly with more robust selectors
    try {
      // Look for the metrics table with Scopus and Google Scholar data
      const metricsData = {
        scopus: {
          articles: 0,
          citations: 0,
          citedDocs: 0,
          hIndex: 0,
          i10Index: 0,
          gIndex: 0
        },
        gs: {
          articles: 0,
          citations: 0,
          citedDocs: 0,
          hIndex: 0,
          i10Index: 0,
          gIndex: 0
        },
        wos: {
          articles: 0,
          citations: 0,
          citedDocs: 0,
          hIndex: 0,
          i10Index: 0,
          gIndex: 0
        }
      };

      // Try multiple selectors for the statistics table
      const tableSelectors = ['.stat-table', '.metrics-table', '.statistics-table', '.author-stats'];
      let statTable = null;
      
      for (const selector of tableSelectors) {
        try {
          statTable = await page.$(selector);
          if (statTable) {
            console.log(`Found statistics table using selector: ${selector}`);
            break;
          }
        } catch (e) {
          console.log(`Error checking for table with selector ${selector}:`, e.message);
        }
      }

      if (statTable) {
        const statRows = await statTable.$$('tbody tr, .stat-row');
        console.log(`Found ${statRows.length} rows in statistics table`);
        
        if (statRows.length >= 5) {
          // Try different ways to extract data from table cells
          const extractCellData = async (row, columnIndex) => {
            try {
              // Try direct td selector
              const cell = await row.$(`td:nth-child(${columnIndex})`);
              if (cell) {
                const text = await cell.textContent();
                return text.trim();
              }
              
              // Try alternative selectors
              const cells = await row.$$('td, .stat-cell');
              if (cells[columnIndex - 1]) {
                const text = await cells[columnIndex - 1].textContent();
                return text.trim();
              }
              
              return '0';
            } catch (e) {
              console.log(`Error extracting cell data for column ${columnIndex}:`, e.message);
              return '0';
            }
          };

          // Enhanced extraction with better error handling
          try {
            // Row 1: Articles (Scopus, GS, WoS)
            const articlesScopus = await extractCellData(statRows[0], 2);
            const articlesGS = await extractCellData(statRows[0], 3);
            const articlesWoS = await extractCellData(statRows[0], 4) || '0';
            
            // Row 2: Citations
            const citationsScopus = await extractCellData(statRows[1], 2);
            const citationsGS = await extractCellData(statRows[1], 3);
            const citationsWoS = await extractCellData(statRows[1], 4) || '0';
            
            // Row 3: Cited Documents
            const citedDocsScopus = await extractCellData(statRows[2], 2);
            const citedDocsGS = await extractCellData(statRows[2], 3);
            const citedDocsWoS = await extractCellData(statRows[2], 4) || '0';
            
            // Row 4: H-Index
            const hIndexScopus = await extractCellData(statRows[3], 2);
            const hIndexGS = await extractCellData(statRows[3], 3);
            const hIndexWoS = await extractCellData(statRows[3], 4) || '0';
            
            // Row 5: i10-Index
            const i10IndexScopus = await extractCellData(statRows[4], 2);
            const i10IndexGS = await extractCellData(statRows[4], 3);
            const i10IndexWoS = await extractCellData(statRows[4], 4) || '0';
            
            // Row 6: G-Index (if exists)
            let gIndexScopus = '0';
            let gIndexGS = '0';
            let gIndexWoS = '0';
            if (statRows.length >= 6) {
              gIndexScopus = await extractCellData(statRows[5], 2);
              gIndexGS = await extractCellData(statRows[5], 3);
              gIndexWoS = await extractCellData(statRows[5], 4) || '0';
            }

            metricsData.scopus = {
              articles: parseInt(articlesScopus.replace(/[^0-9]/g, '')) || 0,
              citations: parseInt(citationsScopus.replace(/[^0-9]/g, '')) || 0,
              citedDocs: parseInt(citedDocsScopus.replace(/[^0-9]/g, '')) || 0,
              hIndex: parseInt(hIndexScopus.replace(/[^0-9]/g, '')) || 0,
              i10Index: parseInt(i10IndexScopus.replace(/[^0-9]/g, '')) || 0,
              gIndex: parseInt(gIndexScopus.replace(/[^0-9]/g, '')) || 0
            };

            metricsData.gs = {
              articles: parseInt(articlesGS.replace(/[^0-9]/g, '')) || 0,
              citations: parseInt(citationsGS.replace(/[^0-9]/g, '')) || 0,
              citedDocs: parseInt(citedDocsGS.replace(/[^0-9]/g, '')) || 0,
              hIndex: parseInt(hIndexGS.replace(/[^0-9]/g, '')) || 0,
              i10Index: parseInt(i10IndexGS.replace(/[^0-9]/g, '')) || 0,
              gIndex: parseInt(gIndexGS.replace(/[^0-9]/g, '')) || 0
            };
            
            metricsData.wos = {
              articles: parseInt(articlesWoS.replace(/[^0-9]/g, '')) || 0,
              citations: parseInt(citationsWoS.replace(/[^0-9]/g, '')) || 0,
              citedDocs: parseInt(citedDocsWoS.replace(/[^0-9]/g, '')) || 0,
              hIndex: parseInt(hIndexWoS.replace(/[^0-9]/g, '')) || 0,
              i10Index: parseInt(i10IndexWoS.replace(/[^0-9]/g, '')) || 0,
              gIndex: parseInt(gIndexWoS.replace(/[^0-9]/g, '')) || 0
            };

            console.log('Extracted Scopus metrics:', metricsData.scopus);
            console.log('Extracted Google Scholar metrics:', metricsData.gs);
            console.log('Extracted Web of Science metrics:', metricsData.wos);
          } catch (extractionError) {
            console.log('Error during metrics extraction, using fallback method:', extractionError.message);
            // Fallback to individual selectors if table extraction fails
            throw extractionError; // This will trigger the fallback
          }
        }
      } else {
        console.log('Statistics table not found, trying alternative extraction methods');
        
        // Fallback: Try to find metrics using individual selectors
        const fallbackMetrics = async (prefix) => {
          return {
            articles: parseInt(await safeEvaluate(`.${prefix}-articles, [data-metric="${prefix}-articles"]`, el => el.textContent.trim(), '0').catch(() => '0')) || 0,
            citations: parseInt(await safeEvaluate(`.${prefix}-citations, [data-metric="${prefix}-citations"]`, el => el.textContent.trim(), '0').catch(() => '0')) || 0,
            citedDocs: parseInt(await safeEvaluate(`.${prefix}-cited-docs, [data-metric="${prefix}-cited-docs"]`, el => el.textContent.trim(), '0').catch(() => '0')) || 0,
            hIndex: parseInt(await safeEvaluate(`.${prefix}-h-index, [data-metric="${prefix}-h-index"]`, el => el.textContent.trim(), '0').catch(() => '0')) || 0,
            i10Index: parseInt(await safeEvaluate(`.${prefix}-i10-index, [data-metric="${prefix}-i10-index"]`, el => el.textContent.trim(), '0').catch(() => '0')) || 0,
            gIndex: parseInt(await safeEvaluate(`.${prefix}-g-index, [data-metric="${prefix}-g-index"]`, el => el.textContent.trim(), '0').catch(() => '0')) || 0
          };
        };
        
        metricsData.scopus = await fallbackMetrics('scopus');
        metricsData.gs = await fallbackMetrics('gs');
        metricsData.wos = await fallbackMetrics('wos');
      }

      profile.scopusMetrics = metricsData.scopus;
      profile.gsMetrics = metricsData.gs;
      profile.wosMetrics = metricsData.wos;

    } catch (e) {
      console.log('Error extracting metrics, using default values:', e.message);
      // Fallback to default metrics
      profile.scopusMetrics = {
        articles: 0,
        citations: 0,
        citedDocs: 0,
        hIndex: 0,
        i10Index: 0,
        gIndex: 0
      };
      profile.gsMetrics = {
        articles: 0,
        citations: 0,
        citedDocs: 0,
        hIndex: 0,
        i10Index: 0,
        gIndex: 0
      };
      profile.wosMetrics = {
        articles: 0,
        citations: 0,
        citedDocs: 0,
        hIndex: 0,
        i10Index: 0,
        gIndex: 0
      };
    }

    return profile;
  },

  async _scrapePublications(page, options) {
    const publications = [];
    
    try {
      console.log('Starting publication scraping...');
      
      // First check if there's a "Publication Not Found" message
      const noPublicationText = await page.textContent('body').catch(() => '');
      if (noPublicationText.includes('Publication Not Found')) {
        console.log('No publications available for this author (Publication Not Found message detected)');
        return publications;
      }
      
      // Wait for publication section to load
      try {
        await page.waitForSelector('.profile-article', { timeout: 5000 });
      } catch (e) {
        console.log('Publication section not found');
        return publications;
      }
      
      // Primary selector for SINTA publications
      const pubSelectors = [
        '.ar-list-item',  // Main SINTA publication selector
        '.pub-list-item', 
        '.publication-item',
        '.article-item',
        '.pub-item',
        '.research-item'
      ];
      
      let items = [];
      let foundSelector = '';
      
      // Try each selector
      for (const selector of pubSelectors) {
        try {
          items = await page.$$(selector);
          if (items.length > 0) {
            foundSelector = selector;
            console.log(`Found ${items.length} publications using selector: ${selector}`);
            break;
          }
        } catch (error) {
          console.log(`Selector ${selector} failed: ${error.message}`);
          continue;
        }
      }
      
      if (items.length === 0) {
        console.log('Warning: No publications found with primary selectors');
        // Try broader selectors as fallback
        try {
          const fallbackSelectors = [
            '.profile-article .card',
            '.profile-article .list-item',
            '.profile-article .item',
            '.profile-article [class*="pub"]',
            '.profile-article [class*="article"]'
          ];
          
          for (const fallbackSelector of fallbackSelectors) {
            items = await page.$$(fallbackSelector);
            if (items.length > 0) {
              console.log(`Fallback found ${items.length} items with selector: ${fallbackSelector}`);
              foundSelector = fallbackSelector;
              break;
            }
          }
        } catch (fallbackError) {
          console.log('All fallback selectors failed');
        }
      }
      
      console.log(`Processing ${items.length} publication items`);
      
      for (const [index, item] of items.entries()) {
        try {
          if (index >= 50) { // Limit to first 50 publications
            console.log('Reached publication limit (50), stopping');
            break;
          }
          
          // Enhanced selectors based on SINTA structure analysis
          const publication = {
            judul: await item.$eval(
              '.ar-title a, .pub-title a, .title a, .article-title a, h4 a, h3 a, [class*="title"] a', 
              el => el.textContent.trim()
            ).catch(() => ''),
            
            link: await item.$eval(
              '.ar-title a, .pub-title a, .title a, .article-title a, h4 a, h3 a, [class*="title"] a', 
              el => el.href
            ).catch(() => ''),
            
            tahun: parseInt(await item.$eval(
              '.ar-year, .pub-year, .year, [class*="year"]', 
              el => {
                const text = el.textContent.trim();
                const match = text.match(/\d{4}/);
                return match ? match[0] : '0';
              }
            ).catch(() => '0')) || 0,
            
            sitasi: parseInt(await item.$eval(
              '.ar-cited, .pub-cited, .cited, .citation-count, [class*="cited"], [class*="citation"]', 
              el => {
                const text = el.textContent.trim();
                const match = text.match(/\d+/);
                return match ? match[0] : '0';
              }
            ).catch(() => '0')) || 0,
            
            jurnal: await item.$eval(
              '.ar-pub, .pub-journal, .journal, .conference, [class*="journal"], [class*="conference"]', 
              el => el.textContent.trim()
            ).catch(() => ''),
            
            // Additional fields based on SINTA structure
            type: await item.$eval(
              '.ar-quartile, .pub-type, .article-type', 
              el => el.textContent.trim()
            ).catch(() => ''),
            
            authorOrder: await item.$eval(
              '.ar-meta a:contains("Author Order"), [class*="author-order"]', 
              el => el.textContent.trim()
            ).catch(() => ''),
            
            creator: await item.$eval(
              '.ar-meta a:contains("Creator"), [class*="creator"]', 
              el => el.textContent.trim()
            ).catch(() => '')
          };
          
          // Only add publication if it has a meaningful title
          if (publication.judul && publication.judul.length > 3) {
            publications.push(publication);
            if (options.debug) {
              console.log(`Added publication ${index + 1}: ${publication.judul.substring(0, 50)}...`);
            }
          }
        } catch (itemError) {
          if (options.debug) console.log(`Error processing publication item ${index}:`, itemError.message);
          continue;
        }
      }
      
      console.log(`Successfully extracted ${publications.length} publications`);
    } catch (error) {
      console.log('Error scraping publications:', error.message);
    }
    
    return publications;
  },

  _updateCache(sintaId, data) {
    try {
      // Create a copy of the data to avoid reference issues
      const cacheData = JSON.parse(JSON.stringify(data));
      
      const cache = existsSync(CACHE_PATH) ? 
        JSON.parse(readFileSync(CACHE_PATH, 'utf8')) : {};
      
      // Add timestamp for cache invalidation
      cacheData._cachedAt = new Date().toISOString();
      cache[sintaId] = cacheData;
      
      writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
      console.log(`Cache updated for Sinta ID: ${sintaId}`);
    } catch (error) {
      console.error('Error updating cache:', error.message);
    }
  },

  async _handleError(page, error, options, sintaId = null) {
    console.error('Error selama scraping:', error.message);
    
    if (page) {
      try {
        const timestamp = Date.now();
        const errorFilename = sintaId ? `error-${sintaId}-${timestamp}.png` : `error-${timestamp}.png`;
        await page.screenshot({ path: errorFilename });
        const html = await page.content();
        
        // Use fs.writeFileSync instead of Bun.write
        const htmlFilename = sintaId ? `error-${sintaId}-${timestamp}.html` : `error-${timestamp}.html`;
        writeFileSync(htmlFilename, html);
        console.log(`Error files saved: ${errorFilename}, ${htmlFilename}`);
        
      } catch (e) {
        console.error('Gagal menyimpan debug info:', e.message);
      }
    }
  }
};