import { chromium } from 'playwright';

async function test() {
  console.log('Starting minimal Playwright test...');
  
  let browser;
  try {
    console.log('Launching browser...');
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    console.log('Browser launched successfully');
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
      viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    console.log('Page created successfully');
    
    console.log('Navigating to page...');
    await page.goto('https://httpbin.org/html', { 
      waitUntil: 'networkidle',
      timeout: 60000
    });
    console.log('Navigation successful');
    
    const title = await page.title();
    console.log('Page title:', title);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
      console.log('Browser closed');
    }
  }
}

test().then(() => console.log('Test completed')).catch(console.error);