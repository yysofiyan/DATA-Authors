// Final test to verify the fixes
console.log('=== FINAL TEST FOR SINTA SCRAPER ===');

// Test 1: Check imports
console.log('1. Testing imports...');
try {
  import('../scrapers/sintaScraper.js').then(() => {
    console.log('   ✓ Sinta scraper imported successfully');
  }).catch(err => {
    console.log('   ✗ Failed to import sinta scraper:', err.message);
  });
} catch (err) {
  console.log('   ✗ Import test failed:', err.message);
}

// Test 2: Check if port 3001 is available
import { createServer } from 'http';

console.log('2. Testing port availability...');
const testServer = createServer();
testServer.listen(3001, () => {
  console.log('   ✓ Port 3001 is available');
  testServer.close();
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('   ✗ Port 3001 is already in use');
  } else {
    console.log('   ✗ Error testing port:', err.message);
  }
});

console.log('=== TEST COMPLETE ===');