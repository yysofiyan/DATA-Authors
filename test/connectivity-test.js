import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const https = require('https');

console.log('Testing connectivity to Sinta website...');

const url = 'https://sinta.kemdikbud.go.id/authors/profile/6712292';

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response received, length:', data.length);
    // Show first 500 characters
    console.log('First 500 chars:', data.substring(0, 500));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
}).setTimeout(30000, () => {
  console.error('Request timeout');
});