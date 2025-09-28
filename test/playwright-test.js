import { chromium } from 'playwright';

async function test() {
  console.log('Starting Playwright test...');
  
  let browser;
  try {
    browser = await chromium.launch({
      headless: true
    });
    console.log('Browser launched successfully');
    
    const page = await browser.newPage();
    console.log('Page created successfully');
    
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    console.log('Navigation successful');
    
    const title = await page.title();
    console.log('Page title:', title);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed');
    }
  }
}

test();