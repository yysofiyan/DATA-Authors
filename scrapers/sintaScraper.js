import { chromium } from 'playwright';
import { writeFileSync, existsSync } from 'fs';

// Cache untuk mengurangi request berulang
const CACHE_PATH = './sinta_cache.json';

export default {
  async getAuthorProfile(sintaId, options = {}) {
    // Cek cache terlebih dahulu
    if (existsSync(CACHE_PATH) && !options.forceRefresh) {
      const cache = JSON.parse(require('fs').readFileSync(CACHE_PATH));
      if (cache[sintaId]) return cache[sintaId];
    }

    let browser;
    let page;
    
    try {
      browser = await chromium.launch({ 
        headless: options.headless ?? true,
        slowMo: options.debug ? 100 : 50
      });
      
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
        viewport: { width: 1280, height: 720 }
      });

      page = await context.newPage();
      await this._handleAuthentication(page, options);
      
      // Navigasi dengan retry mechanism
      await this._navigateWithRetry(page, `https://sinta.kemdikbud.go.id/authors/profile/${sintaId}`, options);

      // Ambil data utama
      const profile = await this._scrapeProfileData(page, options);
      
      // Ambil publikasi dengan pagination
      profile.publikasi = await this._scrapePublications(page, options);
      
      // Simpan ke cache
      this._updateCache(sintaId, profile);
      
      return profile;

    } catch (error) {
      await this._handleError(page, error, options);
      throw error;
    } finally {
      if (browser) await browser.close();
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

  async _navigateWithRetry(page, url, options, retries = 3) {
    if (!page) throw new Error('Halaman browser tidak terinisialisasi');
    try {
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 60000
      });
      
      await page.waitForTimeout(1000 + Math.random() * 2000);
      
      await page.waitForSelector('.author-profile', { 
        timeout: 30000,
        state: 'attached'
      });
    } catch (error) {
      if (retries > 0) {
        if (options.debug) console.log(`Retry navigasi (${retries} tersisa)...`);
        return this._navigateWithRetry(page, url, options, retries - 1);
      }
      throw new Error(`Gagal navigasi setelah ${retries} retry: ${error.message}`);
    }
  },

  async _scrapeProfileData(page, options) {
    const safeEvaluate = async (selector, callback) => {
      let retries = 3;
      while (retries > 0) {
        try {
          return await page.$eval(selector, callback);
        } catch (error) {
          if (options.debug) console.log(`Retry selector ${selector}...`);
          await page.waitForTimeout(1000);
          retries--;
        }
      }
      throw new Error(`Selector ${selector} tidak ditemukan`);
    };

    const profile = {
      nama: await safeEvaluate('h3 a', el => el.textContent.trim()),
      afiliasi: await safeEvaluate('.meta-profile a:first-child', el => el.textContent.trim()),
      program_studi: await safeEvaluate('.meta-profile a:nth-child(3)', el => el.textContent.trim()),
      sinta_id: await safeEvaluate('.meta-profile a:last-child', el => 
        el.textContent.trim().split(': ')[1]
      ),
      bidang_keahlian: await safeEvaluate('.subject-list li a', 
        elements => elements.map(el => el.textContent.trim())
      ),
      skor: {
        sinta_total: parseInt(await safeEvaluate('.stat-profile .pr-num:nth-child(1)', el => el.textContent)),
        sinta_3tahun: parseInt(await safeEvaluate('.stat-profile .pr-num:nth-child(2)', el => el.textContent)),
        afiliasi_total: parseInt(await safeEvaluate('.stat-profile .pr-num:nth-child(3)', el => el.textContent)),
        afiliasi_3tahun: parseInt(await safeEvaluate('.stat-profile .pr-num:nth-child(4)', el => el.textContent))
      },
      penelitian: []
    };

    // Scraping data penelitian (tambahkan jika diperlukan)
    const researchItems = await page.$$('.research-item');
    for (const item of researchItems) {
      profile.penelitian.push({
        judul: await item.$eval('.research-title', el => el.textContent.trim()),
        tahun: await item.$eval('.research-year', el => el.textContent.trim()),
        pendanaan: await item.$eval('.research-funding', el => el.textContent.trim())
      });
    }

    return profile;
  },

  async _scrapePublications(page, options) {
    const publications = [];
    let pageNumber = 1;
    
    do {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight * 0.7);
      });
      
      await page.waitForSelector('.ar-list-item', {
        timeout: pageNumber === 1 ? 30000 : 10000
      });

      const items = await page.$$('.ar-list-item');
      for (const item of items) {
        publications.push({
          judul: await item.$eval('.ar-title a', el => el.textContent.trim()),
          link: await item.$eval('.ar-title a', el => el.href),
          tahun: parseInt(await item.$eval('.ar-year', el => 
            el.textContent.trim().replace(/[^0-9]/g, '')
          )),
          sitasi: parseInt(await item.$eval('.ar-cited', el => 
            el.textContent.trim().replace(/[^0-9]/g, '')
          )) || 0,
          jurnal: await item.$eval('.ar-pub', el => el.textContent.trim())
        });
      }

      const nextButton = await page.$('.pagination-next:not(.disabled)');
      if (!nextButton) break;
      
      await Promise.all([
        page.waitForNavigation(),
        nextButton.click()
      ]);
      await page.waitForTimeout(2000 + Math.random() * 3000);
      pageNumber++;
    } while (pageNumber <= 10);

    return publications;
  },

  _updateCache(sintaId, data) {
    const cache = existsSync(CACHE_PATH) ? 
      JSON.parse(require('fs').readFileSync(CACHE_PATH)) : {};
    cache[sintaId] = data;
    writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  },

  async _handleError(page, error, options) {
    console.error('Error selama scraping:', error.message);
    
    if (page) {
      try {
        await page.screenshot({ path: `error-${Date.now()}.png` });
        const html = await page.content();
        await Bun.write(`error-${Date.now()}.html`, html);
      } catch (e) {
        console.error('Gagal menyimpan debug info:', e.message);
      }
    }
  }
}; 