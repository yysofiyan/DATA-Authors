import sintaScraper from './scrapers/sintaScraper.js';
import { writeFileSync } from 'fs';

async function testNewId() {
  try {
    // Let's test with a new Sinta ID that we know exists
    const sintaId = '6019586'; // This is Prof. Muhammad Iqbal, a known academic
    
    console.log(`Testing Sinta ID: ${sintaId}`);
    
    // Start scraping with debug enabled
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
    console.log('\n--- Extracted Data ---');
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

testNewId();