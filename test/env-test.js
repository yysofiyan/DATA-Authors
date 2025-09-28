console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);

// Test basic imports
import { existsSync } from 'fs';
console.log('FS module working:', existsSync ? 'Yes' : 'No');

import { chromium } from 'playwright';
console.log('Playwright imported successfully');

console.log('Environment test completed');