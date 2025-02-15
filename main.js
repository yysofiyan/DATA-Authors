// Ganti require dengan import ES modules
import sintaScraper from './scrapers/sintaScraper.js';

async function main() {
  try {
    const profile = await sintaScraper.getAuthorProfile('6655767', {
      debug: true,
      headless: false
    });
    
    console.log('Data Profil:', {
      Nama: profile.nama,
      ID: profile.sinta_id,
      Publikasi: profile.publikasi.length,
      Jurnal: profile.publikasi[0]?.jurnal
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main(); 