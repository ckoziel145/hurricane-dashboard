// Appends newly observed Atlantic systems from NHC's CurrentStorms.json to the
// season log, and upgrades peak classification/intensity for storms already logged.
// Run twice daily by GitHub Actions; the commit triggers a site redeploy.
import { readFileSync, writeFileSync } from "node:fs";

const LOG_PATH = "public/data/season-log.json";
const RANK = { TD: 0, STD: 0, PTC: 0, TS: 1, STS: 1, HU: 2, MH: 3, PC: 0 };

const res = await fetch("https://www.nhc.noaa.gov/CurrentStorms.json", {
  headers: { "User-Agent": "hurricane-dashboard/1.0" },
});
if (!res.ok) {
  console.error(`NHC feed returned ${res.status} — leaving log unchanged.`);
  process.exit(0); // don't fail the workflow on a transient upstream error
}
const data = await res.json();
const log = JSON.parse(readFileSync(LOG_PATH, "utf8"));
const today = new Date().toISOString().slice(0, 10);

const atlantic = (data.activeStorms || []).filter((s) =>
  String(s.id || "").toLowerCase().startsWith("al")
);

for (const s of atlantic) {
  const existing = log.storms.find((x) => x.id === s.id);
  if (!existing) {
    log.storms.push({
      id: s.id,
      name: s.name,
      firstSeen: today,
      lastSeen: today,
      peakClassification: s.classification,
      peakIntensityKt: Number(s.intensity) || null,
    });
    console.log(`New system logged: ${s.name} (${s.id})`);
  } else {
    existing.lastSeen = today;
    if ((RANK[s.classification] ?? 0) > (RANK[existing.peakClassification] ?? 0)) {
      existing.peakClassification = s.classification;
    }
    if ((Number(s.intensity) || 0) > (existing.peakIntensityKt || 0)) {
      existing.peakIntensityKt = Number(s.intensity);
    }
  }
}

log.updated = new Date().toISOString();
writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + "\n");
console.log(`Season log refreshed: ${log.storms.length} system(s) on record, ${atlantic.length} active.`);
