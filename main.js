// Ganti require dengan import ES modules
import sintaScraper from './scrapers/sintaScraper.js';
import { writeFileSync } from 'fs';

async function main() {
  try {
    const sintaId = '6712292'; // Different Sinta ID to test
    
    // Mulai scraping
    const profile = await sintaScraper.getAuthorProfile(sintaId, {
      headless: true, // Changed to true for server environments
      debug: true,
      forceRefresh: true
    });

    // Simpan ke file JSON dengan nama berdasarkan Sinta ID
    const filename = `profile-${sintaId}.json`;
    writeFileSync(filename, JSON.stringify(profile, null, 2));
    console.log(`Data berhasil disimpan ke ${filename}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();