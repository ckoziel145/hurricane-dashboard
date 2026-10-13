// Builds public/data/season-stats.json from NHC's real-time ATCF best-track
// ("b-deck") files — the live equivalent of HURDAT2. Gives the dashboard true
// season-to-date aggregates (named storms, hurricanes, majors, ACE) and a
// per-storm log with correct names and peaks, which the twice-daily
// CurrentStorms sampling in refresh-season.mjs can miss.
// Run by the deploy workflow before each build (every 6 hours). Non-fatal on
// upstream errors: exits 0 leaving any previous file in place.
import { writeFileSync } from "node:fs";

const YEAR = new Date().getUTCFullYear();
const BTK = (num) => `https://ftp.nhc.noaa.gov/atcf/btk/bal${String(num).padStart(2, "0")}${YEAR}.dat`;

// Saffir-Simpson class from 1-min sustained wind (kt)
const classOf = (kt) =>
  kt >= 137 ? "5" : kt >= 113 ? "4" : kt >= 96 ? "3" : kt >= 83 ? "2" : kt >= 64 ? "1" : kt >= 34 ? "TS" : "TD";

// Statuses that count as a (sub)tropical storm or stronger for naming/ACE
const TS_PLUS = new Set(["TS", "SS", "HU", "TY", "ST"]);
// Statuses that still count as an active tropical/subtropical cyclone
const ACTIVE_TYPES = new Set(["TD", "SD", "TS", "SS", "HU", "TY", "ST"]);

async function fetchStorm(num) {
  const res = await fetch(BTK(num), { headers: { "User-Agent": "hurricane-dashboard/1.0" } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Upstream ${res.status} for ${BTK(num)}`);
  return parseBdeck(await res.text(), num);
}

function parseBdeck(text, num) {
  // One record per synoptic time: b-decks repeat a time once per wind-radii
  // threshold (34/50/64 kt), so dedupe by datetime.
  const byTime = new Map();
  for (const line of text.split("\n")) {
    const f = line.split(",").map((s) => s.trim());
    if (f.length < 11 || f[0] !== "AL" || f[4] !== "BEST") continue;
    const rec = { time: f[2], vmax: Number(f[8]) || 0, type: f[10], name: f[27] || "" };
    if (!byTime.has(rec.time)) byTime.set(rec.time, rec);
  }
  const recs = [...byTime.values()].sort((a, b) => a.time.localeCompare(b.time));
  if (!recs.length) return null;

  let peakWindKt = 0, ace = 0, named = false, name = "";
  let start = null, end = null;
  for (const r of recs) {
    const tropical = ACTIVE_TYPES.has(r.type);
    if (tropical) {
      start ||= r.time;
      end = r.time;
      if (r.vmax > peakWindKt) peakWindKt = r.vmax;
    }
    if (TS_PLUS.has(r.type) && r.vmax >= 34) {
      named = true;
      // ACE: 6-hourly synoptic times only (b-decks add extra landfall/peak rows)
      const hh = r.time.slice(8, 10);
      if (["00", "06", "12", "18"].includes(hh)) ace += (r.vmax * r.vmax) / 1e4;
    }
    // Keep the latest real name (early rows say GENESIS### / INVEST)
    if (r.name && !/^(GENESIS|INVEST)/.test(r.name)) name = r.name;
  }
  if (!start) return null; // never a tropical cyclone (pure disturbance/invest file)

  const last = recs[recs.length - 1];
  const lastTime = Date.UTC(+last.time.slice(0, 4), +last.time.slice(4, 6) - 1, +last.time.slice(6, 8), +last.time.slice(8, 10));
  const active = ACTIVE_TYPES.has(last.type) && Date.now() - lastTime < 30 * 3600 * 1000;

  const title = (s) => s.charAt(0) + s.slice(1).toLowerCase();
  return {
    id: `al${String(num).padStart(2, "0")}${YEAR}`,
    name: named && name ? title(name) : `${num} (unnamed TD)`,
    start: `${start.slice(0, 4)}-${start.slice(4, 6)}-${start.slice(6, 8)}`,
    end: `${end.slice(0, 4)}-${end.slice(4, 6)}-${end.slice(6, 8)}`,
    named,
    peakWindKt,
    peakClass: classOf(peakWindKt),
    ace: Math.round(ace * 10) / 10,
    active,
  };
}

try {
  const storms = [];
  let misses = 0;
  for (let num = 1; num <= 40 && misses < 3; num++) {
    const s = await fetchStorm(num);
    if (s === null) { misses++; continue; }
    misses = 0;
    storms.push(s);
  }

  const namedStorms = storms.filter((s) => s.named);
  const stats = {
    season: YEAR,
    fetchedAt: new Date().toISOString(),
    source: "NHC ATCF best track (ftp.nhc.noaa.gov/atcf/btk)",
    totals: {
      ns: namedStorms.length,
      h: namedStorms.filter((s) => s.peakWindKt >= 64).length,
      mh: namedStorms.filter((s) => s.peakWindKt >= 96).length,
      ace: Math.round(namedStorms.reduce((a, s) => a + s.ace, 0) * 10) / 10,
    },
    storms,
  };
  writeFileSync("public/data/season-stats.json", JSON.stringify(stats, null, 2) + "\n");
  console.log(`Season stats built: ${stats.totals.ns} NS / ${stats.totals.h} H / ${stats.totals.mh} MH · ACE ${stats.totals.ace} (${storms.length} systems incl. depressions)`);
} catch (e) {
  console.error(`Season stats build failed: ${e} — keeping previous file if any.`);
  process.exit(0);
}
