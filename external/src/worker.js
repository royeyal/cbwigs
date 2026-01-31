export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    const getManifest = async () => {
      // If your manifest ended up at /manifest.json instead, change the path here.
      const res = await env.ASSETS.fetch(
        new URL('/.vite/manifest.json', url.origin)
      );
      if (!res.ok) return null;
      return res.json();
    };

    const serveFile = async path => {
      const fileResponse = await env.ASSETS.fetch(new URL(path, url.origin));
      const response = new Response(fileResponse.body, {
        status: fileResponse.status,
        statusText: fileResponse.statusText,
        headers: new Headers(fileResponse.headers)
      });
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    };

    const redirectTo = path =>
      new Response(null, {
        status: 302,
        headers: {
          Location: path,
          'Cache-Control': 'no-cache',
          ...corsHeaders
        }
      });

    if (
      url.pathname === '/main.js' ||
      url.pathname === '/js/main.js' ||
      url.pathname === '/main.css' ||
      url.pathname === '/css/main.css' ||
      url.pathname === '/draggable-slider.js' ||
      url.pathname === '/js/draggable-slider.js' ||
      url.pathname === '/parallax-image.js' ||
      url.pathname === '/parallax-image.css'
    ) {
      const manifest = await getManifest();
      if (!manifest) return new Response('Manifest not found', { status: 500 });

      const wantCss = url.pathname.endsWith('.css');
      const wantSlider = url.pathname === '/draggable-slider.js';
      const wantParallaxJs = url.pathname === '/parallax-image.js';
      const wantParallaxCss = url.pathname === '/parallax-image.css';

      // Preferred explicit keys
      const preferredKeys = wantCss
        ? ['src/styles/main.css', 'src/css/main.css']
        : wantSlider
          ? [
              'js/draggable-infinite-slider-standalone.js',
              'src/js/draggable-infinite-slider-standalone.js'
            ]
          : wantParallaxJs
            ? ['src/js/parallax-image.js', 'js/parallax-image.js']
            : wantParallaxCss
              ? ['src/styles/parallax-image.css', 'styles/parallax-image.css']
              : ['src/js/main.js', 'src/scripts/main.js', 'js/main.js'];

      // 1) Try explicit key
      for (const key of preferredKeys) {
        const entry = manifest[key];
        if (!entry) continue;

        if (wantCss) {
          // CSS can be its own entry OR referenced by a JS entry's css array
          if (entry.file && entry.file.endsWith('.css'))
            return serveFile('/' + entry.file);
          if (Array.isArray(entry.css) && entry.css.length)
            return serveFile('/' + entry.css[0]);
        } else {
          if (entry.file && entry.file.endsWith('.js'))
            return serveFile('/' + entry.file);
        }
      }

      // 2) If requesting CSS, look for any entry that lists CSS in `css:[]`
      if (wantCss) {
        for (const entry of Object.values(manifest)) {
          if (Array.isArray(entry.css) && entry.css.length) {
            // Prefer a "main" css if present
            const mainish =
              entry.css.find(p => /main/i.test(p)) || entry.css[0];
            return serveFile('/' + mainish);
          }
        }
      }

      // 3) Fallback: scan all files and pick a likely candidate
      let chosen = null;
      for (const entry of Object.values(manifest)) {
        // entry.file (JS or CSS)
        if (entry?.file && entry.file.endsWith(wantCss ? '.css' : '.js')) {
          if (!chosen || /main/i.test(entry.file)) chosen = entry.file;
        }
        // If CSS requested, also consider entry.css array
        if (wantCss && Array.isArray(entry?.css)) {
          for (const p of entry.css) {
            if (!chosen || /main/i.test(p)) chosen = p;
          }
        }
      }

      if (chosen) return serveFile('/' + chosen);

      return new Response('Entry not found in manifest', { status: 404 });
    }

    // Default: serve built assets via static binding
    const resp = await env.ASSETS.fetch(request);

    // Clone the response and add CORS headers
    const response = new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: new Headers(resp.headers)
    });

    // Add CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Make non-hashed top-level paths revalidate (dev-friendly)
    if (!/\.[a-f0-9]{8,}\./i.test(url.pathname)) {
      response.headers.set('Cache-Control', 'no-cache');
    }

    return response;
  }
};
