import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/**
 * Proxy endpoint for streaming content
 * Proxies requests to external streaming servers that have CORS issues
 */
app.get('/api/stream/manifest', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    console.log(`Proxying request to: ${url}`);

    const response = await fetch(url as string, {
      headers: {
        'Referer': 'https://app.noodtayo.com',
        'Origin': 'https://app.noodtayo.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Upstream server returned ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    res.set('Content-Type', contentType || 'application/vnd.apple.mpegurl');
    res.set('Access-Control-Allow-Origin', '*');

    const data = await response.text();
    res.send(data);

  } catch (err: any) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Proxy endpoint for HLS segments
 */
app.get('/api/stream/segment', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    console.log(`Proxying segment: ${url}`);

    const response = await fetch(url as string, {
      headers: {
        'Referer': 'https://app.noodtayo.com',
        'Range': req.get('Range') || ''
      }
    });

    if (!response.ok) {
      throw new Error(`Upstream server returned ${response.status}`);
    }

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'video/mp2t');
    
    const buffer = await response.buffer();
    res.send(buffer);

  } catch (err: any) {
    console.error('Segment proxy error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Stream proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Manifest proxy: GET /api/stream/manifest?url=<url>`);
  console.log(`📡 Segment proxy: GET /api/stream/segment?url=<url>`);
});
