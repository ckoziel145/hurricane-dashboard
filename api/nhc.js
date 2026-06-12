// Allowlisted proxy for NHC public feeds. The browser cannot fetch nhc.noaa.gov
// directly (no CORS headers), so this function relays the two feeds we need.
const FEEDS = {
  current: "https://www.nhc.noaa.gov/CurrentStorms.json",
  outlook: "https://www.nhc.noaa.gov/index-at.xml",
};

export default async function handler(req, res) {
  const feed = FEEDS[req.query.feed];
  if (!feed) {
    res.status(400).json({ error: "Unknown feed. Use ?feed=current or ?feed=outlook." });
    return;
  }
  try {
    const upstream = await fetch(feed, { headers: { "User-Agent": "hurricane-dashboard/1.0" } });
    if (!upstream.ok) throw new Error(`Upstream ${upstream.status}`);
    const body = await upstream.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.setHeader("Content-Type", feed.endsWith(".json") ? "application/json" : "application/xml");
    res.status(200).send(body);
  } catch (e) {
    res.status(502).json({ error: "Upstream fetch failed", detail: String(e) });
  }
}
