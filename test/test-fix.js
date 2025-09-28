import sintaScraper from './scrapers/sintaScraper.js';

console.log('Testing Sinta scraper with ID: 6712292');

try {
  const profile = await sintaScraper.getAuthorProfile('6712292', {
    headless: true,
    debug: true,
    forceRefresh: true
  });
  console.log('Scraping successful!');
  console.log('Profile:', JSON.stringify(profile, null, 2));
} catch (error) {
  console.error('Scraping failed:', error.message);
  console.error('Stack trace:', error.stack);
}