// Fetches static copies of the two NHC feeds into public/data/ so hosts without
// serverless functions (GitHub Pages) can still show near-live data. Run by the
// deploy workflow before each build; the site falls back to these when api/nhc
// is unavailable. Failures are non-fatal — any previously fetched copy is kept.
import { writeFileSync } from "node:fs";

const FEEDS = [
  { url: "https://www.nhc.noaa.gov/CurrentStorms.json", path: "public/data/nhc-current.json" },
  { url: "https://www.nhc.noaa.gov/index-at.xml", path: "public/data/nhc-outlook.xml" },
];

let fetched = 0;
for (const { url, path } of FEEDS) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "hurricane-dashboard/1.0" } });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    writeFileSync(path, await res.text());
    fetched++;
    console.log(`Fetched ${url} → ${path}`);
  } catch (e) {
    console.error(`Failed to fetch ${url}: ${e} — keeping previous copy if any.`);
  }
}

if (fetched > 0) {
  writeFileSync("public/data/nhc-meta.json", JSON.stringify({ fetchedAt: new Date().toISOString() }) + "\n");
}
