import React, { useState } from "react";
import { T, CAT, SNAPSHOT_DATE } from "./data.js";
import { mono, sans } from "./components.jsx";
import OutlookTab from "./tabs/OutlookTab.jsx";
import TrendsTab from "./tabs/TrendsTab.jsx";
import StormsTab from "./tabs/StormsTab.jsx";
import ForecastTab from "./tabs/ForecastTab.jsx";

const TABS = [
  { id: "outlook", label: "LIVE OUTLOOK" },
  { id: "trends", label: "SEASON TRENDS" },
  { id: "storms", label: "LANDFALL LOG" },
  { id: "forecast", label: "FORECAST VS ACTUAL" },
];

export default function App() {
  const [tab, setTab] = useState("outlook");
  const ramp = Object.values(CAT).map((c) => c.color);

  const now = new Date();
  const today = now.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
  const seasonStart = new Date(now.getFullYear(), 5, 1); // Jun 1
  const dayOfSeason = Math.floor((now - seasonStart) / 86400000) + 1;
  const inSeason = dayOfSeason >= 1 && dayOfSeason <= 183;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, padding: "0 0 40px" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; }
        button { background: transparent; }
        button:focus-visible { outline: 2px solid ${T.amber}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>

      {/* Saffir-Simpson ramp — the signature strip */}
      <div style={{ display: "flex", height: 5 }}>
        {ramp.map((c) => <div key={c} style={{ flex: 1, background: c }} />)}
      </div>

      <header style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: "0.22em", color: T.amber }}>ATLANTIC BASIN · SEASON INTELLIGENCE</div>
            <h1 style={{ fontFamily: sans, fontWeight: 800, fontSize: 30, color: T.text, letterSpacing: "-0.01em", margin: "6px 0 4px" }}>Hurricane Season Tracker</h1>
            <div style={{ fontFamily: sans, fontSize: 12.5, color: T.muted }}>Portfolio monitor · XKIG — emergency storm response, southeastern US</div>
          </div>
          <div style={{ fontFamily: mono, fontSize: 10, color: T.muted, border: `1px solid ${T.line}`, borderRadius: 4, padding: "10px 14px", lineHeight: 1.8, textAlign: "right" }}>
            LIVE FEED · {today}<br />
            SOURCES · NHC / NOAA CPC / NCEI / CSU<br />
            {inSeason ? `${now.getFullYear()} SEASON · DAY ${dayOfSeason} OF 183` : `OFF-SEASON · CURATED AS OF ${SNAPSHOT_DATE.toUpperCase()}`}
          </div>
        </div>

        <nav style={{ display: "flex", gap: 2, marginTop: 22, borderBottom: `1px solid ${T.line}`, overflowX: "auto" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                fontFamily: mono, fontSize: 11, letterSpacing: "0.1em", padding: "10px 16px", cursor: "pointer",
                color: tab === t.id ? T.text : T.faint, border: "none",
                borderBottom: tab === t.id ? `2px solid ${T.amber}` : "2px solid transparent",
                whiteSpace: "nowrap",
              }}
            >{t.label}</button>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: 1180, margin: "18px auto 0", padding: "0 20px" }}>
        {tab === "outlook" && <OutlookTab />}
        {tab === "trends" && <TrendsTab />}
        {tab === "storms" && <StormsTab />}
        {tab === "forecast" && <ForecastTab />}
      </main>

      <footer style={{ maxWidth: 1180, margin: "26px auto 0", padding: "14px 20px 0", borderTop: `1px solid ${T.line}` }}>
        <div style={{ fontFamily: mono, fontSize: 9.5, color: T.faint, lineHeight: 1.8 }}>
          DAMAGE FIGURES ARE ESTIMATES (NOAA NCEI BILLION-DOLLAR DISASTERS, NHC TC REPORTS, PUBLIC REPORTING) AND MAY BE REVISED · SEASONAL OUTLOOKS ARE NOT LANDFALL FORECASTS · FOR LIVE WARNINGS USE NHC.NOAA.GOV
        </div>
      </footer>
    </div>
  );
}
