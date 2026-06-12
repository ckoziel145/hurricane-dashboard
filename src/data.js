/* Theme tokens, Saffir-Simpson palette, and all curated data layers.
   Curated layers (storm log, forecasts, revisions) are as of the snapshot date below;
   update them here, or paste this file to Claude and ask for a refresh. */

export const SNAPSHOT_DATE = "Jun 12, 2026";

export const T = {
  bg: "#0A1118",
  panel: "#101B26",
  panelUp: "#15232F",
  line: "#1E3242",
  text: "#D9E4EC",
  muted: "#7C93A6",
  faint: "#52677A",
  amber: "#FFB02E",
  green: "#5BC98C",
};

// Saffir-Simpson ramp doubles as the data palette
export const CAT = {
  TS: { label: "TS", color: "#4FA3DF", name: "Tropical Storm" },
  1: { label: "CAT 1", color: "#F2D24B", name: "Category 1" },
  2: { label: "CAT 2", color: "#F5A623", name: "Category 2" },
  3: { label: "CAT 3", color: "#EE6C2E", name: "Category 3" },
  4: { label: "CAT 4", color: "#DC3A3A", name: "Category 4" },
  5: { label: "CAT 5", color: "#B83BCB", name: "Category 5" },
};
export const catOf = (s) => (s.cat === 0 ? CAT.TS : CAT[s.cat]);

/* ---------------- SEASON AGGREGATES ---------------- */
export const SEASONS = [
  { year: 2020, ns: 30, h: 14, mh: 7, ace: 180, note: "Record 30 named storms; record 12 named storms made CONUS landfall. Greek alphabet used." },
  { year: 2021, ns: 21, h: 7, mh: 4, ace: 145, note: "Ida devastated Louisiana, then drove deadly flooding into the Northeast." },
  { year: 2022, ns: 14, h: 8, mh: 2, ace: 95, note: "Quiet mid-season, then Ian — one of the costliest US hurricanes on record." },
  { year: 2023, ns: 20, h: 7, mh: 3, ace: 146, note: "El Niño year that over-produced storms; Idalia was the only US hurricane landfall." },
  { year: 2024, ns: 18, h: 11, mh: 5, ace: 162, note: "Five US hurricane landfalls incl. Helene and Milton back-to-back. Beryl: earliest Cat 5 on record." },
  { year: 2025, ns: 13, h: 5, mh: 4, ace: 133, note: "Three Cat 5s (Erin, Humberto, Melissa) but zero US hurricane landfalls — first time in a decade. Melissa devastated Jamaica (~$10B)." },
];

export const SEASON_2026 = {
  year: 2026,
  noaa: { nsLo: 8, nsHi: 14, hLo: 3, hHi: 6, mhLo: 1, mhHi: 3, belowNormal: 55, nearNormal: 35, aboveNormal: 10 },
  csuJune: { ns: 11, h: 5, mh: 2 },
  csuApril: { ns: 13, h: 6, mh: 2, ace: 90 },
  nsToDate: 0,
};

/* ---------------- STORM-LEVEL LOG (US landfall / impact events, 2020–2025) ----------------
   cat = Saffir-Simpson category AT US LANDFALL (0 = tropical storm). damageB = est. US damage, $B.
   Damage and death figures are estimates compiled from NOAA/NCEI and public reporting; some remain preliminary. */
export const STORMS = [
  // 2020
  { id: "bertha20", name: "Bertha", year: 2020, cat: 0, landfall: true, lfDate: "May 27, 2020", lfLoc: "Isle of Palms, SC", active: "May 27–28", peak: "TS, 50 mph", states: ["SC", "NC"], damageB: 0.1, deaths: 1, notes: "Pre-season storm; quick spin-up just offshore. Localized flooding." },
  { id: "cristobal20", name: "Cristobal", year: 2020, cat: 0, landfall: true, lfDate: "Jun 7, 2020", lfLoc: "Southeast Louisiana", active: "Jun 1–10", peak: "TS, 60 mph", states: ["LA", "MS"], damageB: 0.3, deaths: 1, notes: "Slow mover; coastal flooding and rain along the central Gulf Coast." },
  { id: "fay20", name: "Fay", year: 2020, cat: 0, landfall: true, lfDate: "Jul 10, 2020", lfLoc: "Near Atlantic City, NJ", active: "Jul 9–11", peak: "TS, 60 mph", states: ["NJ", "NY"], damageB: 0.4, deaths: 6, notes: "Mid-Atlantic landfall; flash flooding and rip currents." },
  { id: "hanna20", name: "Hanna", year: 2020, cat: 1, landfall: true, lfDate: "Jul 25, 2020", lfLoc: "Padre Island, TX", active: "Jul 23–27", peak: "Cat 1, 90 mph", states: ["TX"], damageB: 1.1, deaths: 0, notes: "First hurricane of the record 2020 season; South Texas wind and flood damage." },
  { id: "isaias20", name: "Isaias", year: 2020, cat: 1, landfall: true, lfDate: "Aug 3, 2020", lfLoc: "Ocean Isle Beach, NC", active: "Jul 30–Aug 5", peak: "Cat 1, 85 mph", states: ["NC", "VA", "MD", "NJ", "NY"], damageB: 4.8, deaths: 14, notes: "Raced up the East Coast; large tornado and wind outbreak, millions without power." },
  { id: "marco20", name: "Marco", year: 2020, cat: 0, landfall: true, lfDate: "Aug 24, 2020", lfLoc: "Mouth of the Mississippi R., LA", active: "Aug 20–25", peak: "Cat 1, 75 mph (offshore)", states: ["LA"], damageB: 0.05, deaths: 0, notes: "Weakened sharply before landfall; arrived days ahead of Laura." },
  { id: "laura20", name: "Laura", year: 2020, cat: 4, landfall: true, lfDate: "Aug 27, 2020", lfLoc: "Cameron, LA", active: "Aug 20–29", peak: "Cat 4, 150 mph", states: ["LA", "TX", "AR"], damageB: 19.1, deaths: 42, notes: "Strongest landfall in SW Louisiana history; catastrophic wind and surge around Lake Charles." },
  { id: "sally20", name: "Sally", year: 2020, cat: 2, landfall: true, lfDate: "Sep 16, 2020", lfLoc: "Gulf Shores, AL", active: "Sep 11–17", peak: "Cat 2, 105 mph", states: ["AL", "FL"], damageB: 7.3, deaths: 4, notes: "Crawled ashore at 3 mph; historic flooding in coastal Alabama and the Florida Panhandle." },
  { id: "beta20", name: "Beta", year: 2020, cat: 0, landfall: true, lfDate: "Sep 21, 2020", lfLoc: "Matagorda Peninsula, TX", active: "Sep 17–25", peak: "TS, 60 mph", states: ["TX", "LA"], damageB: 0.2, deaths: 1, notes: "Greek-alphabet storm; days of rain and urban flooding around Houston." },
  { id: "delta20", name: "Delta", year: 2020, cat: 2, landfall: true, lfDate: "Oct 9, 2020", lfLoc: "Creole, LA", active: "Oct 4–10", peak: "Cat 2 at landfall (Cat 4 peak)", states: ["LA", "TX"], damageB: 2.9, deaths: 5, notes: "Struck ~15 miles from Laura's landfall six weeks earlier, compounding recovery." },
  { id: "zeta20", name: "Zeta", year: 2020, cat: 3, landfall: true, lfDate: "Oct 28, 2020", lfLoc: "Cocodrie, LA", active: "Oct 24–29", peak: "Cat 3, 115 mph", states: ["LA", "MS", "AL", "GA"], damageB: 4.4, deaths: 6, notes: "Fast mover; hurricane-force gusts deep inland, major outages in Georgia." },
  { id: "eta20", name: "Eta", year: 2020, cat: 0, landfall: true, lfDate: "Nov 8 & 12, 2020", lfLoc: "Lower Matecumbe Key & Cedar Key, FL", active: "Oct 31–Nov 13", peak: "TS at US landfalls (Cat 4 peak)", states: ["FL"], damageB: 1.5, deaths: 12, notes: "Two Florida landfalls in November; severe urban flooding in South Florida." },
  // 2021
  { id: "claudette21", name: "Claudette", year: 2021, cat: 0, landfall: true, lfDate: "Jun 19, 2021", lfLoc: "Southeast Louisiana", active: "Jun 19–22", peak: "TS, 45 mph", states: ["LA", "MS", "AL"], damageB: 0.4, deaths: 14, notes: "Deadly multi-vehicle crash in Alabama; tornadoes and flooding along Gulf Coast." },
  { id: "danny21", name: "Danny", year: 2021, cat: 0, landfall: true, lfDate: "Jun 28, 2021", lfLoc: "Pritchards Island, SC", active: "Jun 28–29", peak: "TS, 45 mph", states: ["SC", "GA"], damageB: 0.01, deaths: 0, notes: "Small, brief system; minor impacts." },
  { id: "elsa21", name: "Elsa", year: 2021, cat: 0, landfall: true, lfDate: "Jul 7, 2021", lfLoc: "Taylor County, FL", active: "Jun 30–Jul 9", peak: "TS at landfall (Cat 1 peak)", states: ["FL", "GA", "SC", "NC"], damageB: 1.2, deaths: 1, notes: "Earliest 5th named storm on record at the time; swept up the entire Southeast seaboard." },
  { id: "fred21", name: "Fred", year: 2021, cat: 0, landfall: true, lfDate: "Aug 16, 2021", lfLoc: "Cape San Blas, FL", active: "Aug 11–18", peak: "TS, 65 mph", states: ["FL", "GA", "NC"], damageB: 1.3, deaths: 7, notes: "Remnants caused deadly flash flooding in the North Carolina mountains (Haywood County)." },
  { id: "henri21", name: "Henri", year: 2021, cat: 0, landfall: true, lfDate: "Aug 22, 2021", lfLoc: "Westerly, RI", active: "Aug 16–23", peak: "TS at landfall (Cat 1 peak)", states: ["RI", "CT", "NY", "NJ"], damageB: 0.7, deaths: 1, notes: "New England landfall; record one-hour rain in Central Park ahead of Ida." },
  { id: "ida21", name: "Ida", year: 2021, cat: 4, landfall: true, lfDate: "Aug 29, 2021", lfLoc: "Port Fourchon, LA", active: "Aug 26–Sep 1", peak: "Cat 4, 150 mph", states: ["LA", "MS", "PA", "NJ", "NY"], damageB: 75.0, deaths: 96, notes: "Tied for strongest Louisiana landfall; remnants then produced catastrophic Northeast flash flooding." },
  { id: "mindy21", name: "Mindy", year: 2021, cat: 0, landfall: true, lfDate: "Sep 8, 2021", lfLoc: "St. Vincent Island, FL", active: "Sep 8–10", peak: "TS, 45 mph", states: ["FL", "GA"], damageB: 0.01, deaths: 0, notes: "Quick-hitting Panhandle storm; minor impacts." },
  { id: "nicholas21", name: "Nicholas", year: 2021, cat: 1, landfall: true, lfDate: "Sep 14, 2021", lfLoc: "Matagorda Peninsula, TX", active: "Sep 12–16", peak: "Cat 1, 75 mph", states: ["TX", "LA"], damageB: 1.1, deaths: 0, notes: "Stalled over Louisiana with heavy rain on Ida-damaged areas." },
  // 2022
  { id: "colin22", name: "Colin", year: 2022, cat: 0, landfall: true, lfDate: "Jul 2, 2022", lfLoc: "Formed over coastal SC", active: "Jul 2–3", peak: "TS, 40 mph", states: ["SC", "NC"], damageB: 0.01, deaths: 0, notes: "Formed unexpectedly over land on July 4th weekend; minor impacts." },
  { id: "fiona22", name: "Fiona", year: 2022, cat: 1, landfall: true, lfDate: "Sep 18, 2022", lfLoc: "Punta Tocón, Puerto Rico", active: "Sep 14–23", peak: "Cat 1 at PR landfall (Cat 4 peak)", states: ["PR"], damageB: 2.5, deaths: 25, notes: "Island-wide power loss and catastrophic flooding in Puerto Rico (US territory)." },
  { id: "ian22", name: "Ian", year: 2022, cat: 4, landfall: true, lfDate: "Sep 28, 2022", lfLoc: "Cayo Costa, FL (2nd: Georgetown, SC, Sep 30)", active: "Sep 23–30", peak: "Cat 4, 150 mph", states: ["FL", "SC", "NC", "VA"], damageB: 113.0, deaths: 150, notes: "Catastrophic surge in Fort Myers/Cape Coral; among the costliest US hurricanes on record. Second landfall in South Carolina as Cat 1." },
  { id: "nicole22", name: "Nicole", year: 2022, cat: 1, landfall: true, lfDate: "Nov 10, 2022", lfLoc: "Vero Beach, FL", active: "Nov 7–11", peak: "Cat 1, 75 mph", states: ["FL", "GA"], damageB: 1.0, deaths: 5, notes: "Rare November hurricane; severe beach erosion collapsed Ian-weakened structures." },
  // 2023
  { id: "harold23", name: "Harold", year: 2023, cat: 0, landfall: true, lfDate: "Aug 22, 2023", lfLoc: "Padre Island, TX", active: "Aug 21–23", peak: "TS, 50 mph", states: ["TX"], damageB: 0.02, deaths: 0, notes: "Beneficial rain for drought-hit South Texas; minor damage." },
  { id: "idalia23", name: "Idalia", year: 2023, cat: 3, landfall: true, lfDate: "Aug 30, 2023", lfLoc: "Keaton Beach, FL", active: "Aug 26–31", peak: "Cat 3, 125 mph (Cat 4 peak)", states: ["FL", "GA", "SC", "NC"], damageB: 3.6, deaths: 8, notes: "Strongest Big Bend landfall in over a century at the time; record surge at Cedar Key, flooding into the Carolinas." },
  { id: "ophelia23", name: "Ophelia", year: 2023, cat: 0, landfall: true, lfDate: "Sep 23, 2023", lfLoc: "Emerald Isle, NC", active: "Sep 22–24", peak: "TS, 70 mph", states: ["NC", "VA"], damageB: 0.4, deaths: 0, notes: "Coastal flooding and wind across eastern NC and the mid-Atlantic." },
  // 2024
  { id: "beryl24", name: "Beryl", year: 2024, cat: 1, landfall: true, lfDate: "Jul 8, 2024", lfLoc: "Matagorda, TX", active: "Jun 28–Jul 9", peak: "Cat 1 at TX landfall (Cat 5 peak)", states: ["TX", "LA"], damageB: 7.2, deaths: 40, notes: "Earliest Atlantic Cat 5 on record (Caribbean). Massive Houston-area power outages amid extreme heat." },
  { id: "debby24", name: "Debby", year: 2024, cat: 1, landfall: true, lfDate: "Aug 5, 2024", lfLoc: "Steinhatchee, FL (Big Bend)", active: "Aug 3–9", peak: "Cat 1, 80 mph", states: ["FL", "GA", "SC", "NC"], damageB: 4.5, deaths: 18, notes: "Slow, erratic track; 10–20 inch rain totals and flooding from Florida through the Carolinas." },
  { id: "francine24", name: "Francine", year: 2024, cat: 2, landfall: true, lfDate: "Sep 11, 2024", lfLoc: "Terrebonne Parish, LA", active: "Sep 9–12", peak: "Cat 2, 100 mph", states: ["LA", "MS"], damageB: 1.3, deaths: 0, notes: "Wind and flood damage across south Louisiana; New Orleans flash flooding." },
  { id: "unnamed24", name: "Unnamed (PTC Eight)", year: 2024, cat: 0, landfall: true, unnamed: true, lfDate: "Sep 16, 2024", lfLoc: "Southeastern NC coast", active: "Sep 15–17", peak: "TS-force, ~50 mph", states: ["NC", "SC"], damageB: 0.1, deaths: 0, notes: "Never officially named, but delivered tropical-storm conditions and ~1-in-1,000-year rainfall at Carolina Beach." },
  { id: "helene24", name: "Helene", year: 2024, cat: 4, landfall: true, lfDate: "Sep 26, 2024", lfLoc: "Near Perry, FL (Big Bend)", active: "Sep 24–29", peak: "Cat 4, 140 mph", states: ["FL", "GA", "SC", "NC", "TN", "VA"], damageB: 78.7, deaths: 219, notes: "Strongest Big Bend landfall on record. Catastrophic inland flooding in western NC (Asheville), GA, TN. Deadliest mainland US hurricane since Katrina; 7th-costliest Atlantic hurricane on record." },
  { id: "milton24", name: "Milton", year: 2024, cat: 3, landfall: true, lfDate: "Oct 9, 2024", lfLoc: "Siesta Key, FL", active: "Oct 5–10", peak: "Cat 3 at landfall (Cat 5 peak, 180 mph)", states: ["FL"], damageB: 34.3, deaths: 32, notes: "Landfall 13 days after Helene. Spawned an extreme tornado outbreak (~45 confirmed) across Florida; record 126 tornado warnings in one day." },
  // 2025
  { id: "chantal25", name: "Chantal", year: 2025, cat: 0, landfall: true, lfDate: "Jul 6, 2025", lfLoc: "Litchfield Beach, SC", active: "Jul 4–7", peak: "TS, 60 mph", states: ["SC", "NC"], damageB: 1.5, deaths: 6, notes: "Only US landfall of 2025. Drove severe flash flooding across central North Carolina (Chapel Hill / Durham area)." },
  { id: "erin25", name: "Erin", year: 2025, cat: 5, landfall: false, lfDate: "— (no US landfall)", lfLoc: "Offshore — closest approach to Outer Banks, NC", active: "Aug 11–23", peak: "Cat 5, 160 mph", states: ["NC"], damageB: 0.5, deaths: 0, notes: "First Cat 5 of 2025; one of the fastest rapid-intensification events on record (75→160 mph in 24 hrs). Storm surge, ocean overwash and erosion on the NC Outer Banks; dangerous surf along the entire East Coast." },
];

/* ---------------- FORECAST VS ACTUAL ---------------- */
export const FORECASTS = [
  { year: 2020, csuApr: { ns: 16, h: 8, mh: 4 }, noaa: { lo: 13, hi: 19, hLo: 6, hHi: 10, mhLo: 3, mhHi: 6 }, actual: { ns: 30, h: 14, mh: 7 } },
  { year: 2021, csuApr: { ns: 17, h: 8, mh: 4 }, noaa: { lo: 13, hi: 20, hLo: 6, hHi: 10, mhLo: 3, mhHi: 5 }, actual: { ns: 21, h: 7, mh: 4 } },
  { year: 2022, csuApr: { ns: 19, h: 9, mh: 4 }, noaa: { lo: 14, hi: 21, hLo: 6, hHi: 10, mhLo: 3, mhHi: 6 }, actual: { ns: 14, h: 8, mh: 2 } },
  { year: 2023, csuApr: { ns: 13, h: 6, mh: 2 }, noaa: { lo: 12, hi: 17, hLo: 5, hHi: 9, mhLo: 1, mhHi: 4 }, actual: { ns: 20, h: 7, mh: 3 } },
  { year: 2024, csuApr: { ns: 23, h: 11, mh: 5 }, noaa: { lo: 17, hi: 25, hLo: 8, hHi: 13, mhLo: 4, mhHi: 7 }, actual: { ns: 18, h: 11, mh: 5 } },
  { year: 2025, csuApr: { ns: 17, h: 9, mh: 4 }, noaa: { lo: 13, hi: 19, hLo: 6, hHi: 10, mhLo: 3, mhHi: 5 }, actual: { ns: 13, h: 5, mh: 4 } },
  { year: 2026, csuApr: { ns: 13, h: 6, mh: 2 }, csuJun: { ns: 11, h: 5, mh: 2 }, noaa: { lo: 8, hi: 14, hLo: 3, hHi: 6, mhLo: 1, mhHi: 3 }, actual: null },
];

export const REVISIONS_2026 = [
  { date: "Apr 9, 2026", source: "CSU — initial extended-range forecast", detail: "13 named storms / 6 hurricanes / 2 major. ACE forecast: 90 (vs 123 avg). Fewest storms CSU has predicted since 2019; strong El Niño expected to dominate.", dir: "init" },
  { date: "May 2026", source: "NOAA — seasonal outlook", detail: "8–14 named / 3–6 hurricanes / 1–3 major (70% confidence). 55% chance of a below-normal season, 35% near-normal, 10% above-normal.", dir: "init" },
  { date: "Early Jun 2026", source: "NWS / WMO — El Niño signal strengthens", detail: "NWS: 82% chance El Niño takes hold by July (up from 61%). WMO (Jun 2): ~80% chance of a strong El Niño this summer.", dir: "context" },
  { date: "Jun 10, 2026", source: "CSU — June update (REVISED DOWN)", detail: "Cut to 11 named / 5 hurricanes / 2 major. US-coastline major-hurricane landfall probability: 24% vs 43% historical average. Warm Atlantic SSTs noted, but El Niño shear expected to dominate.", dir: "down" },
  { date: "Upcoming", source: "Scheduled updates", detail: "CSU updates: Jul 8 and Aug 5. NOAA mid-season update: early August.", dir: "next" },
];

/* ---------------- 2026 OUTLOOK / LIVE ---------------- */
export const SNAPSHOT_SYSTEMS = [
  {
    id: "bocDisturbance",
    title: "Gulf disturbance — Bay of Campeche",
    status: "MONITORING",
    nextName: "Arthur",
    detail: "NHC's first area of interest of the 2026 season. A broad area of low pressure may form over the Bay of Campeche late this week, bringing showers and thunderstorms to the southern Gulf. If it organizes, it would become Tropical Storm Arthur. No coastal watches or warnings are in effect.",
    threat: "Formation chance and any US (Gulf Coast) threat are still uncertain — too early for a track. Watch NHC's Tropical Weather Outlook for 2- and 7-day formation odds.",
  },
];

export const NAMES_2026 = ["Arthur", "Bertha", "Cristobal", "Dolly", "Edouard", "Fay", "Gonzalo", "Hanna", "Isaias", "Josephine", "Kyle", "Leah", "Marco", "Nana", "Omar", "Paulette", "Rene", "Sally", "Teddy", "Vicky", "Wilfred"];

export const SOURCES = [
  { name: "NHC — Tropical Weather Outlook & active storms", url: "nhc.noaa.gov", use: "Live formation odds, advisories, forecast cones" },
  { name: "NHC CurrentStorms.json / GIS feeds", url: "nhc.noaa.gov/gis", use: "Machine-readable live storm data" },
  { name: "HURDAT2 (NHC best-track database)", url: "nhc.noaa.gov/data", use: "Historical tracks, intensity, landfall records" },
  { name: "NCEI Billion-Dollar Disasters", url: "ncei.noaa.gov/access/billions", use: "Official US damage cost estimates" },
  { name: "CSU Tropical Meteorology Project", url: "tropical.colostate.edu", use: "Seasonal forecasts & verification reports" },
  { name: "NOAA CPC Seasonal Outlook", url: "cpc.ncep.noaa.gov", use: "NOAA outlook + August mid-season update" },
];

export const SE_STATES = ["FL", "GA", "SC", "NC", "AL", "MS", "LA", "TN", "VA"];

/* ============== END DATA ============== */
