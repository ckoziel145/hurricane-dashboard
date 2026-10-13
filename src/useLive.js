import { useEffect, useState } from "react";

/* Live data layer.
   - api/nhc?feed=current   → NHC CurrentStorms.json (active systems, all basins)
   - api/nhc?feed=outlook   → NHC Atlantic RSS, from which we extract the Tropical Weather Outlook text
   - data/season-log.json   → season-to-date log, appended by the scheduled GitHub Action
   On hosts without serverless functions (GitHub Pages), api/nhc doesn't exist; we then fall
   back to data/nhc-current.json + data/nhc-outlook.xml, static copies refreshed every 6 hours
   by the deploy workflow (status: "cached"). Everything fails independently and gracefully;
   the last resort is the curated snapshot embedded in data.js. */

export const ktToMph = (kt) => Math.round(Number(kt) * 1.15078);

export const CLASS_LABEL = {
  TD: "TROPICAL DEPRESSION", STD: "SUBTROPICAL DEPRESSION",
  TS: "TROPICAL STORM", STS: "SUBTROPICAL STORM",
  HU: "HURRICANE", MH: "MAJOR HURRICANE",
  PTC: "POTENTIAL TROP. CYCLONE", PC: "POST-TROPICAL",
};

// Named-storm classifications for season-to-date counting
const NAMED = ["TS", "STS", "HU", "MH"];
export const countNamed = (log) =>
  log?.storms ? log.storms.filter((s) => NAMED.includes(s.peakClassification)).length : null;

/* Season-to-date aggregates (data/season-stats.json), built from NHC's ATCF
   best-track files by scripts/build-season-stats.mjs — committed twice daily by
   the season-log workflow and rebuilt fresh on every deploy. Fetched once per
   page load and shared across tabs via a module-level cache.
   Returns: undefined → still loading, null → unavailable, object → stats. */
let statsCache;
let statsPromise = null;
export function useSeasonStats() {
  const [stats, setStats] = useState(statsCache);
  useEffect(() => {
    if (statsCache !== undefined) return;
    statsPromise ||= fetch("data/season-stats.json")
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((j) => (statsCache = j));
    let on = true;
    statsPromise.then((j) => { if (on) setStats(j); });
    return () => { on = false; };
  }, []);
  return stats;
}

export const fmtStatDate = (iso) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export function useLiveData() {
  const [live, setLive] = useState({ status: "loading", storms: [], outlookText: null, seasonLog: null, fetchedAt: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = { status: "ok", storms: [], outlookText: null, seasonLog: null, fetchedAt: new Date() };

      const parseStorms = (j) =>
        (j.activeStorms || []).filter((s) => String(s.id || "").toLowerCase().startsWith("al"));
      const parseOutlook = (text) => {
        const xml = new DOMParser().parseFromString(text, "text/xml");
        const items = Array.from(xml.querySelectorAll("item"));
        const two = items.find((i) => (i.querySelector("title")?.textContent || "").includes("Tropical Weather Outlook"));
        if (!two) return null;
        const raw = two.querySelector("description")?.textContent || "";
        return raw
          .replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
          .replace(/\n{3,}/g, "\n\n").trim();
      };

      // 1) Active storms (Atlantic basin only — NHC ids start with "al")
      try {
        const r = await fetch("api/nhc?feed=current");
        if (!r.ok) throw new Error(String(r.status));
        result.storms = parseStorms(await r.json());
      } catch {
        // No proxy on this host — try the static copy refreshed by the deploy workflow
        try {
          const r = await fetch("data/nhc-current.json");
          if (!r.ok) throw new Error(String(r.status));
          result.storms = parseStorms(await r.json());
          result.status = "cached";
          try {
            const m = await fetch("data/nhc-meta.json");
            if (m.ok) result.fetchedAt = new Date((await m.json()).fetchedAt);
          } catch { /* keep page-load time */ }
        } catch {
          result.status = "feed-down";
        }
      }

      // 2) Tropical Weather Outlook text (from the Atlantic RSS feed)
      try {
        const r = await fetch("api/nhc?feed=outlook");
        if (!r.ok) throw new Error(String(r.status));
        result.outlookText = parseOutlook(await r.text());
      } catch {
        try {
          const r = await fetch("data/nhc-outlook.xml");
          if (r.ok) result.outlookText = parseOutlook(await r.text());
        } catch { /* non-fatal */ }
      }

      // 3) Season-to-date log (committed by the GitHub Action; ships with the site)
      try {
        const r = await fetch("data/season-log.json");
        if (r.ok) result.seasonLog = await r.json();
      } catch { /* non-fatal */ }

      if (!cancelled) setLive(result);
    })();
    return () => { cancelled = true; };
  }, []);

  return live;
}
