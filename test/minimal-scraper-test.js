import sintaScraper from '../scrapers/sintaScraper.js';

async function minimalTest() {
  try {
    console.log('Starting minimal scraper test...');
    
    // Test with a simple, known working ID
    const sintaId = '6655767';
    
    console.time('Scraping Time');
    const profile = await sintaScraper.getAuthorProfile(sintaId, {
      headless: true,
      debug: true,
      forceRefresh: true
    });
    console.timeEnd('Scraping Time');
    
    console.log('Scraping completed successfully!');
    console.log('Name:', profile.nama);
    console.log('Affiliation:', profile.afiliasi);
    
    // Check metrics
    console.log('Scopus Metrics:', profile.scopusMetrics);
    console.log('GS Metrics:', profile.gsMetrics);
    
  } catch (error) {
    console.error('Error in minimal test:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

minimalTest();