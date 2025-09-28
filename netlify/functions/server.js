const express = require('express');
const serverless = require('serverless-http');
const { default: sintaScraper } = require('../../scrapers/sintaScraper.js');

const app = express();

app.use(express.json());

// Endpoint untuk mengambil data penulis berdasarkan Sinta ID
app.get('/.netlify/functions/server/api/authors/:sintaId', async (req, res) => {
  try {
    const { sintaId } = req.params;
    const profile = await sintaScraper.getAuthorProfile(sintaId, {
      headless: true,
      debug: false,
      forceRefresh: true
    });
    res.json(profile);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch author data', details: error.message });
  }
});

// Handle Netlify function
const handler = serverless(app);
exports.handler = async (event, context) => {
  return await handler(event, context);
};