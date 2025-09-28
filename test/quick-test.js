import { chromium } from 'playwright';

async function quickTest() {
  let browser;
  
  try {
    console.log('Testing if Sinta ID 6660457 page exists...');
    
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Set a longer timeout
    page.setDefaultTimeout(60000);
    
    const url = 'https://sinta.kemdikbud.go.id/authors/profile/6660457';
    console.log(`Navigating to: ${url}`);
    
    const response = await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 60000
    });
    
    console.log(`Response status: ${response.status()}`);
    console.log(`Response URL: ${response.url()}`);
    
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Check if we got redirected
    const currentUrl = page.url();
    if (currentUrl !== url) {
      console.log(`Redirected to: ${currentUrl}`);
    }
    
    // Wait a bit and check content
    await page.waitForTimeout(5000);
    
    const content = await page.textContent('body');
    console.log(`Page content length: ${content.length}`);
    
    if (content.length < 1000) {
      console.log('Page content seems too short, might be an error page');
      console.log('First 500 characters:', content.substring(0, 500));
    } else {
      console.log('Page loaded successfully');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

quickTest();