import axios from 'axios';

async function testAPI() {
  try {
    console.log('Testing API response...');
    const response = await axios.get('http://localhost:3001/api/authors/6655767', {
      timeout: 90000
    });
    
    console.log('Response status:', response.status);
    console.log('Response data name:', response.data.name);
    console.log('Response data GS articles:', response.data.gsMetrics.articles);
    console.log('Response data Scopus articles:', response.data.scopusMetrics.articles);
    
    console.log('API test completed successfully!');
  } catch (error) {
    console.error('API test failed:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testAPI();