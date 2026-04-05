export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only proxy /api/ requests to the HLS backend
    if (url.pathname.startsWith('/api/')) {
      const targetUrl = 'https://hls.iill.top' + url.pathname + url.search;

      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': '*',
          }
        });
      }

      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'Referer': 'https://app.noodtayo.com',
          'Origin': 'https://app.noodtayo.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      });

      const newHeaders = new Headers(response.headers);
      newHeaders.set('Access-Control-Allow-Origin', '*');
      newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

      return new Response(response.body, {
        status: response.status,
        headers: newHeaders
      });
    }

    // For all other requests, serve the static Angular app
    return env.ASSETS.fetch(request);
  }
}
