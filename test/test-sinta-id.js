import sintaScraper from './scrapers/sintaScraper.js';
import { writeFileSync } from 'fs';

async function testSintaId() {
  try {
    const sintaId = '6660457'; // The problematic Sinta ID
    
    console.log(`Testing Sinta ID: ${sintaId}`);
    
    // Start scraping with debug enabled
    console.log('Starting scraper...');
    const profile = await sintaScraper.getAuthorProfile(sintaId, {
      headless: true,
      debug: true,
      forceRefresh: true
    });

    // Save to file
    const filename = `test-profile-${sintaId}.json`;
    writeFileSync(filename, JSON.stringify(profile, null, 2));
    console.log(`Data successfully saved to ${filename}`);
    
    // Log key metrics to see if they're being extracted
    console.log('\n--- Extracted Metrics ---');
    console.log('Name:', profile.nama);
    console.log('Affiliation:', profile.afiliasi);
    console.log('Study Program:', profile.program_studi);
    
    console.log('\nScopus Metrics:', profile.scopusMetrics);
    console.log('GS Metrics:', profile.gsMetrics);
    console.log('WoS Metrics:', profile.wosMetrics);
    
    console.log('\nSinta Scores:', profile.skor);

  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testSintaId();