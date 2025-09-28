import express from 'express';

const app = express();
const PORT = 3001;

app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

app.get('/api/authors/:sintaId', (req, res) => {
  console.log(`Received request for Sinta ID: ${req.params.sintaId}`);
  // Return mock data
  res.json({
    sintaID: req.params.sintaId,
    name: "Test User",
    affiliation: "Test University",
    scopusMetrics: {
      articles: "10",
      citations: "50"
    },
    gsMetrics: {
      articles: "20",
      citations: "100"
    }
  });
});

app.listen(PORT, () => {
  console.log(`Minimal server is running on port ${PORT}`);
});