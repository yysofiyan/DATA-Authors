// Test script to verify dynamic Sinta ID handling
import sintaScraper from './scrapers/sintaScraper.js';
import { writeFileSync } from 'fs';

async function testDynamicId(sintaId) {
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
    
    // Check if the returned data matches the requested ID
    if (profile.sinta_id === sintaId) {
      console.log('✅ Sinta ID verification: PASSED');
    } else {
      console.log('❌ Sinta ID verification: FAILED');
      console.log(`Expected: ${sintaId}, Got: ${profile.sinta_id}`);
    }
    
    return profile;
  } catch (error) {
    console.error(`Error testing with Sinta ID ${sintaId}:`, error.message);
    return null;
  }
}

// Test with the original ID
testDynamicId('6655767')
  .then(() => {
    console.log('Test completed for ID 6655767');
  })
  .catch(error => {
    console.error('Test failed for ID 6655767:', error.message);
  });