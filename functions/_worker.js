// functions/_worker.js - Cloudflare Pages Functions
export default {
  async fetch(request, env, context) {
    try {
      // 🔒 CORS handling
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        });
      }

      // 🎯 معالجة الطلب
      const responseData = {
        status: 'success',
        message: '🚀 Nabd Proxy v7.0 يعمل بنجاح على Cloudflare Pages!',
        resonance: 0.95,
        timestamp: new Date().toISOString(),
        version: 'v7.0-pages-functions',
        endpoint: new URL(request.url).pathname
      };

      return new Response(JSON.stringify(responseData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-Powered-By': 'Nabd-AI-Engine'
        }
      });

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          resonance: 0.2
        }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}
