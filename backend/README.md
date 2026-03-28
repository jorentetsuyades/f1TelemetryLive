# Backend Setup

## Installation

Install dependencies:
```bash
npm install --save-dev express cors typescript ts-node @types/express @types/node
```

## Running

Start the proxy server:
```bash
ts-node backend/proxy-server.ts
```

Or if you have a npm script configured:
```bash
npm run proxy-server
```
```typescript
streamUrl: `${environment.streamProxyUrl}/manifest?url=${encodeURIComponent(url)}`
```

### Troubleshooting

- **"Cannot GET /proxy-stream"** → Make sure `npm run proxy-server` is running
- **Still getting CORS error** → Check browser DevTools Network tab to verify s-to-server headers are being sent
- **Proxy server crashes** → Check dependencies are installed: `npm install`

### Security Notes

- The current proxy accepts any URL (`?url=` parameter)
- For production, whitelist allowed domains:
  ```typescript
  const ALLOWED_ORIGINS = ['hls.iill.top', 'stream.example.com'];
  
  if (!ALLOWED_ORIGINS.includes(new URL(url).hostname)) {
    return res.status(403).json({ error: 'Domain not whitelisted' });
  }
  ```
