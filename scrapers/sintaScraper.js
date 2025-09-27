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
        headless: false,
        args: [
          '--disable-blink-features=AutomationControlled',
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
        ]
      });
      
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        viewport: { width: 1280, height: 720 },
        extraHTTPHeaders: {
          'Accept-Language': 'id-ID,id;q=0.9',
          'Referer': 'https://sinta.kemdikbud.go.id/'
        }
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
    try {
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });
      
      // Tambahkan delay untuk render JS
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await Promise.all([
        page.waitForSelector('h3 a', { visible: true }),
        page.waitForSelector('.meta-profile a', { visible: true }),
        page.waitForSelector('.stat-profile .pr-num', { visible: true })
      ]);

    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this._navigateWithRetry(page, url, options, retries - 1);
      }
      throw error;
    }
  },

  async _scrapeProfileData(page, options) {
    // Tunggu semua elemen kritis
    await Promise.all([
      page.waitForSelector('h3 a', { timeout: 45000 }),
      page.waitForSelector('.meta-profile a', { timeout: 45000 }),
      page.waitForSelector('.subject-list li a', { timeout: 45000 }),
      page.waitForSelector('.stat-profile .pr-num', { timeout: 45000 }),
      page.waitForSelector('.ar-list-item', { timeout: 45000 })
    ]);

    const profile = {
      nama: await this._safeEvaluate(page, 'h3 a', el => {
        return el.textContent.replace(/\s+/g, ' ').trim();
      }, options, 'Nama tidak ditemukan'),
      
      afiliasi: await this._safeEvaluate(page, '.meta-profile a:first-child', el => {
        return el.textContent.replace(/Universitas/g, '').trim();
      }, options, 'Afiliasi tidak ditemukan'),
      
      program_studi: await this._safeEvaluate(page, '.meta-profile a:nth-child(3)', el => {
        return el.textContent.replace('S1 - ', '').trim();
      }, options, 'Program studi tidak ditemukan'),
      
      sinta_id: await this._safeEvaluate(page, '.meta-profile a:last-child', el => {
        const text = el.textContent.replace(/\s+/g, ' ');
        return text.split(': ')[1]?.trim() || 'ID tidak valid';
      }, options, 'ID tidak ditemukan'),
      
      bidang_keahlian: await this._safeEvaluate(
        page,
        '.subject-list li a',
        elements => elements.map(el => el.textContent.trim()),
        options,
        []
      ),
      
      skor: {
        sinta_total: parseInt(await this._safeEvaluate(
          page, 
          '.stat-profile > .row > div:nth-child(2) .pr-num',
          el => el.textContent,
          options,
          0
        )),
        sinta_3tahun: parseInt(await this._safeEvaluate(
          page,
          '.stat-profile > .row > div:nth-child(3) .pr-num',
          el => el.textContent,
          options,
          0
        )),
        afiliasi_total: parseInt(await this._safeEvaluate(
          page,
          '.stat-profile > .row > div:nth-child(4) .pr-num',
          el => el.textContent,
          options,
          0
        )),
        afiliasi_3tahun: parseInt(await this._safeEvaluate(
          page,
          '.stat-profile > .row > div:nth-child(5) .pr-num',
          el => el.textContent,
          options,
          0
        ))
      },
      
      statistik: {
        h_index_scopus: parseInt(await this._safeEvaluate(
          page,
          '.stat-table tbody tr:nth-child(4) td:nth-child(2)',
          el => el.textContent,
          options,
          0
        )),
        i10_index_scopus: parseInt(await this._safeEvaluate(
          page,
          '.stat-table tbody tr:nth-child(5) td:nth-child(2)',
          el => el.textContent,
          options,
          0
        )),
        h_index_scholar: parseInt(await this._safeEvaluate(
          page,
          '.stat-table tbody tr:nth-child(4) td:nth-child(3)',
          el => el.textContent,
          options,
          0
        )),
        i10_index_scholar: parseInt(await this._safeEvaluate(
          page,
          '.stat-table tbody tr:nth-child(5) td:nth-child(3)',
          el => el.textContent,
          options,
          0
        ))
      },
      
      publikasi: await this._scrapePublications(page, options)
    };
    
    // Validasi data penting
    if(!profile.nama || !profile.sinta_id) {
      throw new Error('Data profil penting tidak ditemukan');
    }
    
    return profile;
  },

  async _scrapePublications(page, options) {
    const publications = [];
    const items = await page.$$('.ar-list-item');
    
    for (const item of items) {
      const tahunText = await item.$eval('.ar-year', el => el.textContent);
      const sitasiText = await item.$eval('.ar-cited', el => el.textContent);
      
      publications.push({
        judul: await this._safeEvaluate(item, '.ar-title a', el => el.textContent.trim(), options, 'Judul tidak tersedia'),
        link: await this._safeEvaluate(item, '.ar-title a', el => el.href, options, '#'),
        tahun: parseInt(tahunText.match(/\d+/)?.[0] || 0),
        sitasi: parseInt(sitasiText.match(/\d+/)?.[0] || 0),
        jurnal: await this._safeEvaluate(item, '.ar-pub', el => {
          return el.textContent.replace(/\s+/g, ' ').trim();
        }, options, 'Jurnal tidak diketahui')
      });
    }
    
    return publications;
  },

  async _safeEvaluate(page, selector, callback, options = {}, defaultValue, retries = 3) {
    while (retries > 0) {
      try {
        const elements = await page.$$(selector);
        if (elements.length === 0) return defaultValue;
        
        if (typeof callback === 'function') {
          return await page.$$eval(selector, callback);
        }
        return await page.$eval(selector, el => el.textContent.trim());
      } catch (error) {
        if (options?.debug) console.log(`Retry selector ${selector}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        retries--;
      }
    }
    return defaultValue;
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