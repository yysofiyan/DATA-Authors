import express from 'express';
import cors from 'cors';
import sintaScraper from './scrapers/sintaScraper.js';
import { writeFileSync } from 'fs';

const app = express();
const PORT = process.env.PORT || 3001; // Keep original port

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Simple test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// Simple test endpoint for quick response
app.get('/api/quick-test', (req, res) => {
  console.log('Quick test endpoint hit');
  res.json({ message: 'Quick test working', data: { name: 'Test User', articles: 10 } });
});

// Endpoint untuk mengambil data penulis berdasarkan Sinta ID
app.get('/api/authors/:sintaId', async (req, res) => {
  try {
    console.log(`Received request for Sinta ID: ${req.params.sintaId}`);
    const { sintaId } = req.params;
    
    // Validate Sinta ID format
    if (!/^\d+$/.test(sintaId)) {
      console.log(`Invalid Sinta ID format: ${sintaId}`);
      return res.status(400).json({ 
        error: 'Invalid Sinta ID format' 
      });
    }
    
    console.log(`Starting to scrape data for Sinta ID: ${sintaId}`);
    const profile = await sintaScraper.getAuthorProfile(sintaId, {
      headless: true,
      debug: true,
      forceRefresh: true  // Always get fresh data
    });
    
    // Transform the data to match the expected structure
    const transformedProfile = {
      sintaID: profile.sinta_id || sintaId,
      name: profile.nama || 'N/A',
      photoUrl: '',
      affiliation: profile.afiliasi || 'N/A',
      department: profile.program_studi || 'N/A',
      studyProgram: profile.program_studi || 'N/A',
      institutionName: '',
      institutionLocation: '',
      codePT: '',
      codeProdi: '',
      sintaScore: profile.skor?.sinta_total?.toString() || '0',
      sintaScoreOverall: profile.skor?.sinta_total || 0,
      sintaScore3Years: profile.skor?.sinta_3tahun?.toString() || '0',
      sintaScore3Yr: profile.skor?.sinta_3tahun || 0,
      affilScore: profile.skor?.afiliasi_total?.toString() || '0',
      affilScore3Years: profile.skor?.afiliasi_3tahun?.toString() || '0',
      affilScore3Yr: profile.skor?.afiliasi_3tahun || 0,
      scopusMetrics: {
        articles: profile.scopusMetrics?.articles?.toString() || '0',
        citations: profile.scopusMetrics?.citations?.toString() || '0',
        citedDocs: profile.scopusMetrics?.citedDocs?.toString() || '0',
        hIndex: profile.scopusMetrics?.hIndex?.toString() || '0',
        i10Index: profile.scopusMetrics?.i10Index?.toString() || '0',
        gIndex: profile.scopusMetrics?.gIndex?.toString() || '0'
      },
      gsMetrics: {
        articles: profile.gsMetrics?.articles?.toString() || '0',
        citations: profile.gsMetrics?.citations?.toString() || '0',
        citedDocs: profile.gsMetrics?.citedDocs?.toString() || '0',
        hIndex: profile.gsMetrics?.hIndex?.toString() || '0',
        i10Index: profile.gsMetrics?.i10Index?.toString() || '0',
        gIndex: profile.gsMetrics?.gIndex?.toString() || '0'
      },
      wosMetrics: {
        articles: profile.wosMetrics?.articles?.toString() || '0',
        citations: profile.wosMetrics?.citations?.toString() || '0',
        citedDocs: profile.wosMetrics?.citedDocs?.toString() || '0',
        hIndex: profile.wosMetrics?.hIndex?.toString() || '0',
        i10Index: profile.wosMetrics?.i10Index?.toString() || '0',
        gIndex: profile.wosMetrics?.gIndex?.toString() || '0'
      },
      publications: (profile.publikasi || []).map((pub) => ({
        title: pub.judul || 'Untitled',
        url: pub.link || '#',
        journal_conference: pub.jurnal || 'Journal information not available',
        year: pub.tahun || 0,
        cited: pub.sitasi || 0
      }))
    };
    
    // Save to JSON file in the public directory with Sinta ID in filename
    const filename = `public/profile-${sintaId}.json`;
    writeFileSync(filename, JSON.stringify(transformedProfile, null, 2));
    console.log(`Data successfully saved to ${filename}`);
    
    console.log(`Successfully fetched data for Sinta ID: ${sintaId}`);
    console.log('Sending response to client...');
    res.json(transformedProfile);
    console.log('Response sent successfully');
  } catch (error) {
    console.error('Error during scraping:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch author data', 
      details: error.message 
    });
  }
});

// Handle 404 - This should be at the end
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    details: err.message 
  });
});

// Handle port in use error
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Try accessing http://localhost:${PORT}/api/test to verify it's working`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Please stop the process using this port or restart your computer.`);
    console.log('You can find the process using this port with: lsof -i :' + PORT);
  } else {
    console.error('Server error:', err);
  }
});