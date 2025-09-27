// Ganti require dengan import ES modules
import sintaScraper from './scrapers/sintaScraper.js';
import { writeFileSync } from 'fs';

async function main() {
  try {
    const profile = await sintaScraper.getAuthorProfile('6655767', {
      headless: false,
      debug: true,
      forceRefresh: true
    });

    // Simpan ke file JSON
    writeFileSync('profile.json', JSON.stringify(profile, null, 2));
    console.log('Data berhasil disimpan ke profile.json');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main(); 