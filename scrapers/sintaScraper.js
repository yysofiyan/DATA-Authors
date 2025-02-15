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
        slowMo: options.debug ? 100 : 50,
        proxy: {
          server: '1159.89.239.166:18098'
        }
      });
      
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
        viewport: { width: 1280, height: 720 }
      });

      page = await context.newPage();
      await this._handleAuthentication(page, options);
      
      // Navigasi dengan retry mechanism
      await this._navigateWithRetry(page, `https://sinta.kemdikbud.go.id/authors/profile/${sintaId}`, options);

      // Verifikasi halaman valid
      const pageTitle = await page.title();
      if (pageTitle.includes('Error') || pageTitle.includes('Not Found')) {
        throw new Error('Halaman tidak ditemukan');
      }

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
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      
      // Tunggu kombinasi beberapa elemen
      await Promise.race([
        page.waitForSelector('.author-profile', { timeout: 45000 }),
        page.waitForSelector('h3.author-name', { timeout: 45000 }),
        page.waitForSelector('.affil-name', { timeout: 45000 })
      ]);
      
    } catch (error) {
      if (retries > 0) {
        await page.waitForTimeout(5000);
        return this._navigateWithRetry(page, url, options, retries - 1);
      }
      throw error;
    }
  },

  async _scrapeProfileData(page, options) {
    const profile = {
      nama: await this._safeEvaluate(page, 'h3 a', el => el.textContent.trim()),
      afiliasi: await this._safeEvaluate(page, '.meta-profile a:first-child', el => el.textContent.trim()),
      program_studi: await this._safeEvaluate(page, '.meta-profile a:nth-child(3)', el => el.textContent.trim()),
      sinta_id: await this._safeEvaluate(page, '.meta-profile a:last-child', el => 
        el.textContent.trim().split(': ')[1]
      ),
      bidang_keahlian: await this._safeEvaluate(page, '.subject-list li a', 
        elements => elements.map(el => el.textContent.trim())
      ),
      skor: {
        sinta_total: parseInt(await this._safeEvaluate(page, '.stat-profile .pr-num:nth-child(1)', el => el.textContent)),
        sinta_3tahun: parseInt(await this._safeEvaluate(page, '.stat-profile .pr-num:nth-child(2)', el => el.textContent)),
        afiliasi_total: parseInt(await this._safeEvaluate(page, '.stat-profile .pr-num:nth-child(3)', el => el.textContent)),
        afiliasi_3tahun: parseInt(await this._safeEvaluate(page, '.stat-profile .pr-num:nth-child(4)', el => el.textContent))
      },
      publikasi: await this._scrapePublications(page, options)
    };
    return profile;
  },

  async _scrapePublications(page, options) {
    const publications = [];
    const items = await page.$$('.ar-list-item');
    
    for (const item of items) {
      publications.push({
        judul: await item.$eval('.ar-title a', el => el.textContent.trim()),
        link: await item.$eval('.ar-title a', el => el.href),
        tahun: parseInt(await item.$eval('.ar-year', el => 
          el.textContent.trim().match(/\d+/)[0]
        )),
        sitasi: parseInt(await item.$eval('.ar-cited', el => 
          el.textContent.trim().match(/\d+/)?.[0] || 0
        )),
        jurnal: await item.$eval('.ar-pub', el => el.textContent.trim())
      });
    }
    
    return publications;
  },

  async _safeEvaluate(page, selector, callback, retries = 3) {
    while (retries > 0) {
      try {
        if (typeof callback === 'function') {
          return await page.$eval(selector, callback);
        }
        return await page.$eval(selector, el => el.textContent.trim());
      } catch (error) {
        if (options.debug) console.log(`Retry selector ${selector}...`);
        await page.waitForTimeout(1000);
        retries--;
      }
    }
    throw new Error(`Selector ${selector} tidak ditemukan`);
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
        const timestamp = Date.now();
        await page.screenshot({ path: `error-${timestamp}.png` });
        const html = await page.content();
        
        // Ganti Bun.write dengan fs
        const fs = await import('fs');
        fs.writeFileSync(`error-${timestamp}.html`, html);
        
      } catch (e) {
        console.error('Gagal menyimpan debug info:', e.message);
      }
    }
  }
}; 