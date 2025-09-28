import axios from 'axios';
import { readFileSync } from 'fs';

async function testFrontendLogic() {
  try {
    console.log('Testing frontend logic...');
    
    // Simulate what the frontend does
    const sintaId = '6655767';
    
    // First try to load local JSON file
    try {
      // In a real frontend, this would be an HTTP request to /profile-{sintaId}.json
      const localData = JSON.parse(readFileSync(`public/profile-${sintaId}.json`, 'utf8'));
      console.log('Local file loaded successfully');
      console.log('Name:', localData.name);
      console.log('GS Articles:', localData.gsMetrics.articles);
      console.log('Scopus Articles:', localData.scopusMetrics.articles);
      return;
    } catch (localErr) {
      console.log('Local file not found, proceeding to server scraping');
    }
    
    // If local file doesn't exist, call server API
    console.log('Calling server API...');
    const response = await axios.get(`http://localhost:3001/api/authors/${sintaId}`, {
      timeout: 90000
    });
    
    console.log('Server response received');
    console.log('Name:', response.data.name);
    console.log('GS Articles:', response.data.gsMetrics.articles);
    console.log('Scopus Articles:', response.data.scopusMetrics.articles);
    
  } catch (error) {
    console.error('Frontend logic test failed:');
    console.error('Error:', error.message);
  }
}

testFrontendLogic();