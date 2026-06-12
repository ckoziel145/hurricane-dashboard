// Netlify Functions variant of the NHC feed proxy (see api/nhc.js for the Vercel version).
const FEEDS = {
  current: "https://www.nhc.noaa.gov/CurrentStorms.json",
  outlook: "https://www.nhc.noaa.gov/index-at.xml",
};

export default async (req) => {
  const url = new URL(req.url);
  const feed = FEEDS[url.searchParams.get("feed")];
  if (!feed) {
    return new Response(JSON.stringify({ error: "Unknown feed. Use ?feed=current or ?feed=outlook." }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const upstream = await fetch(feed, { headers: { "User-Agent": "hurricane-dashboard/1.0" } });
    if (!upstream.ok) throw new Error(`Upstream ${upstream.status}`);
    const body = await upstream.text();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": feed.endsWith(".json") ? "application/json" : "application/xml",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Upstream fetch failed", detail: String(e) }), {
      status: 502, headers: { "Content-Type": "application/json" },
    });
  }
};
