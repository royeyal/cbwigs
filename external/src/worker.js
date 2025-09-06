export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Load Vite manifest (Vite writes to /.vite/manifest.json)
    const getManifest = async () => {
      const res = await env.ASSETS.fetch(new URL("/.vite/manifest.json", url.origin));
      if (!res.ok) throw new Error("manifest not found");
      return res.json();
    };

    // Map stable endpoints -> manifest entry keys
    const stableMap = {
      "/app.js": "src/js/app.js",
      "/styles.css": "src/styles/main.css",
      "/main.js": "src/js/main.js",       // add these two if your entry is main.js
      "/main.css": "src/styles/main.css"  // or keep styles.css only; your choice
    };

    if (stableMap[url.pathname]) {
      const manifest = await getManifest();

      // If exact key isn't present (e.g., different input keys), fall back:
      const key = stableMap[url.pathname];
      let file = manifest[key]?.file;

      if (!file) {
        // Fallback: find first matching JS/CSS in manifest values
        const wantCss = url.pathname.endsWith(".css");
        for (const v of Object.values(manifest)) {
          if (v?.file && (wantCss ? v.file.endsWith(".css") : v.file.endsWith(".js"))) {
            // prefer names that include "main" if present
            if (!file || /main/i.test(v.file)) file = v.file;
          }
        }
      }

      if (!file) return new Response("Entry not found in manifest", { status: 404 });
      return Response.redirect("/" + file, 302);
    }

    // Serve static assets. Make non-hashed paths revalidate.
    const resp = await env.ASSETS.fetch(request);
    if (!/\.[a-f0-9]{8,}\./i.test(url.pathname)) {
      const r = new Response(resp.body, resp);
      r.headers.set("Cache-Control", "no-cache");
      return r;
    }
    return resp;
  },
};