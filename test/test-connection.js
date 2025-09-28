const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3003,
  path: '/api/test',
  method: 'GET'
};

const req = http.request(options, res => {
  console.log(`Status Code: ${res.statusCode}`);
  
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error('Error:', error.message);
});

req.end();