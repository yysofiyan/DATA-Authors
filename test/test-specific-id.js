// Test script for specific Sinta ID
import sintaScraper from './scrapers/sintaScraper.js';
import { writeFileSync } from 'fs';

async function testSpecificId(sintaId) {
  try {
    console.log(`Testing with Sinta ID: ${sintaId}`);
    const profile = await sintaScraper.getAuthorProfile(sintaId, {
      headless: true,
      debug: true,
      forceRefresh: true
    });

    // Save to file
    writeFileSync(`profile-${sintaId}.json`, JSON.stringify(profile, null, 2));
    console.log(`Data successfully saved to profile-${sintaId}.json`);
    
    // Display summary
    console.log('\n--- SCRAPING RESULTS ---');
    console.log(`Name: ${profile.nama}`);
    console.log(`Affiliation: ${profile.afiliasi}`);
    console.log(`Sinta ID: ${profile.sinta_id}`);
    console.log(`Publications found: ${profile.publikasi ? profile.publikasi.length : 0}`);
    
    return profile;
  } catch (error) {
    console.error(`Error testing with Sinta ID ${sintaId}:`, error.message);
    return null;
  }
}

// Test with the problematic ID
testSpecificId('6712292')
  .then((result) => {
    if (result) {
      console.log('\n✅ Test completed successfully');
    } else {
      console.log('\n❌ Test failed');
    }
  })
  .catch(error => {
    console.error('Test failed:', error.message);
  });