# Sinta Scraper Documentation

## Overview
The Sinta Scraper is a Node.js application that extracts academic profile information from Sinta (Science and Technology Index), an Indonesian academic database. It uses Playwright for web scraping and includes caching functionality to reduce repeated requests.

## Features
- Extracts author profile information including name, affiliation, and study program
- Retrieves academic metrics (Sinta scores, H-index, i10-index, etc.)
- Collects publication details (titles, citations, journals)
- Implements caching to avoid repeated requests
- Includes error handling and retry mechanisms
- Generates JSON output with extracted data

## Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

## Usage
Run the scraper with:
```bash
node main.js
```

This will:
1. Launch a Chromium browser instance
2. Navigate to the author's Sinta profile (ID: 6655767)
3. Extract profile information and publications
4. Save the data to `profile.json`
5. Cache results in `sinta_cache.json`

## Configuration
The scraper can be configured through the `options` parameter in `main.js`:

```javascript
const profile = await sintaScraper.getAuthorProfile('6655767', {
  headless: false,     // Run browser in background (true) or visible (false)
  debug: true,         // Enable detailed logging
  forceRefresh: true,  // Bypass cache and fetch fresh data
  auth: {              // Authentication (if required)
    username: 'user',
    password: 'pass'
  }
});
```

## Output Format
The scraper generates a JSON file with the following structure:

```json
{
  "nama": "Author Name",
  "afiliasi": "Affiliation",
  "program_studi": "Study Program",
  "sinta_id": "Sinta ID",
  "bidang_keahlian": ["Expertise Area 1", "Expertise Area 2"],
  "skor": {
    "sinta_total": 0,
    "sinta_3tahun": 0,
    "afiliasi_total": 0,
    "afiliasi_3tahun": 0
  },
  "statistik": {
    "h_index_scopus": 0,
    "i10_index_scopus": 0,
    "h_index_scholar": 0,
    "i10_index_scholar": 0
  },
  "publikasi": [
    {
      "judul": "Publication Title",
      "link": "URL to publication",
      "tahun": 2021,
      "sitasi": 5,
      "jurnal": "Journal Name"
    }
  ]
}
```

## Error Handling
The scraper includes comprehensive error handling:
- Retry mechanisms for failed navigation
- Graceful handling of missing elements
- Error screenshots and HTML dumps for debugging
- Fallback values for critical data points

## Recent Fixes
1. **Fixed `waitUntil` parameter error** - Changed from `networkidle2` to `networkidle` (correct Playwright value)
2. **Fixed `require` error** - Replaced `require('fs')` with proper ES6 imports
3. **Improved data extraction** - Rewrote scraping functions to use more robust Playwright methods
4. **Enhanced error handling** - Added better error handling and fallback values

## Files
- [scrapers/sintaScraper.js](file:///Users/yysofiyan/Desktop/%20q/project/scrapers/sintaScraper.js) - Main scraper implementation
- [main.js](file:///Users/yysofiyan/Desktop/%20q/project/main.js) - Entry point script
- [profile.json](file:///Users/yysofiyan/Desktop/%20q/project/profile.json) - Generated output file
- [sinta_cache.json](file:///Users/yysofiyan/Desktop/%20q/project/sinta_cache.json) - Cache file for avoiding repeated requests

## Troubleshooting
If you encounter issues:
1. Ensure all dependencies are installed: `npm install`
2. Verify Playwright browsers are installed: `npx playwright install chromium`
3. Check error screenshots and HTML dumps in the project directory
4. Enable debug mode for detailed logging

## Customization
To scrape a different author:
1. Modify the Sinta ID in [main.js](file:///Users/yysofiyan/Desktop/%20q/project/main.js)
2. Run `node main.js` again

To modify the output format or add new data fields, edit the `_scrapeProfileData` and `_scrapePublications` functions in [sintaScraper.js](file:///Users/yysofiyan/Desktop/%20q/project/scrapers/sintaScraper.js).