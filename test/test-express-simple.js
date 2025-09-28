const express = require('express');
const app = express();
const PORT = 3002;

app.get('/', (req, res) => {
  res.json({ message: 'Simple Express server is working' });
});

app.listen(PORT, () => {
  console.log(`Simple Express server is running on http://localhost:${PORT}`);
});