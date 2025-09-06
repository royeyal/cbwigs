export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Helper to get the Vite manifest (Vite places it at /.vite/manifest.json)
    const getManifest = async () => {
      const res = await env.ASSETS.fetch(new URL("/.vite/manifest.json", url.origin));
      if (!res.ok) throw new Error("manifest not found");
      return res.json();
    };

    // Stable endpoints for Webflow -> 302 to latest hashed files
    if (url.pathname === "/app.js" || url.pathname === "/styles.css") {
      const manifest = await getManifest();
      const map = {
        "/app.js": "src/js/app.js",
        "/styles.css": "src/styles/main.css",
      };
      const key = map[url.pathname];
      const entry = manifest[key];
      if (!entry || !entry.file) return new Response("Entry not found in manifest", { status: 404 });
      return Response.redirect("/" + entry.file, 302);
    }

    // Default: serve built assets
    const assetResp = await env.ASSETS.fetch(request);

    // Make non-hashed top-level paths revalidate
    if (!/\.[a-f0-9]{8,}\./i.test(url.pathname)) {
      const r = new Response(assetResp.body, assetResp);
      r.headers.set("Cache-Control", "no-cache");
      return r;
    }
    return assetResp;
  },
};