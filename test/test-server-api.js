import axios from 'axios';

async function testServerAPI() {
  try {
    console.log('Testing server API for Sinta ID 6655767...');
    
    // Test the API endpoint
    const response = await axios.get('http://localhost:3001/api/authors/6655767', {
      timeout: 60000 // 60 second timeout
    });
    
    console.log('Response status:', response.status);
    console.log('Response data keys:', Object.keys(response.data));
    console.log('Name:', response.data.name);
    console.log('Affiliation:', response.data.affiliation);
    
    // Check if we have metrics data
    if (response.data.scopusMetrics) {
      console.log('Scopus Articles:', response.data.scopusMetrics.articles);
      console.log('Scopus Citations:', response.data.scopusMetrics.citations);
    }
    
    if (response.data.gsMetrics) {
      console.log('GS Articles:', response.data.gsMetrics.articles);
      console.log('GS Citations:', response.data.gsMetrics.citations);
    }

  } catch (error) {
    console.error('Error testing server API:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.message);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testServerAPI();