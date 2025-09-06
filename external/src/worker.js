export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Stable endpoints that redirect to the hashed files
    if (url.pathname === "/app.js" || url.pathname === "/styles.css") {
      const manifestRes = await env.ASSETS.fetch(new URL("/manifest.json", url.origin));
      const manifest = await manifestRes.json();

      const map = {
        "/app.js": "src/js/app.js",
        "/styles.css": "src/styles/main.css",
      };
      const key = map[url.pathname];
      if (!key || !manifest[key]) return new Response("Not Found", { status: 404 });

      const target = "/" + manifest[key].file; // e.g. /assets/app.<hash>.js
      return Response.redirect(target, 302);
    }

    // Everything else: serve static asset with cache headers
    // Let the ASSETS handler set optimal caching for hashed files
    const assetResponse = await env.ASSETS.fetch(request);

    // Optional: force no-cache on non-hashed top-level paths
    if (!/\\.[a-f0-9]{8,}\\./i.test(url.pathname)) {
      const r = new Response(assetResponse.body, assetResponse);
      r.headers.set("Cache-Control", "no-cache");
      return r;
    }
    return assetResponse;
  },
};