import React, { useState, useMemo } from "react";
import { ComposedChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList, ReferenceLine } from "recharts";
import { T, CAT, catOf, SEASONS, SEASON_2026, STORMS, FORECASTS, REVISIONS_2026, SE_STATES, SNAPSHOT_DATE } from "../data.js";
import { mono, sans, fmtB, Panel, Stat, CatBadge, ChartTip, axisProps } from "../components.jsx";

/* ============== TAB 2 — LANDFALL LOG (drill-down) ============== */
export default function StormsTab() {
  const [year, setYear] = useState("All");
  const [state, setState] = useState("All");
  const [minCat, setMinCat] = useState("All");
  const [open, setOpen] = useState(null);

  const years = ["All", ...SEASONS.map((s) => String(s.year))];
  const states = ["All", "FL", "LA", "TX", "NC", "SC", "GA", "AL", "MS", "TN", "VA", "PR"];

  const filtered = STORMS.filter((s) =>
    (year === "All" || String(s.year) === year) &&
    (state === "All" || s.states.includes(state)) &&
    (minCat === "All" || (minCat === "H" ? s.cat >= 1 : s.cat >= 3))
  );

  const chip = (active) => ({
    fontFamily: mono, fontSize: 10.5, letterSpacing: "0.06em", padding: "4px 10px", borderRadius: 3, cursor: "pointer",
    border: `1px solid ${active ? T.amber : T.line}`, color: active ? "#0A1118" : T.muted, background: active ? T.amber : "transparent",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel kicker="FILTERS" title={null}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontFamily: mono, fontSize: 10, color: T.faint, marginRight: 2 }}>SEASON</span>
            {years.map((y) => <button key={y} style={chip(year === y)} onClick={() => setYear(y)}>{y}</button>)}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontFamily: mono, fontSize: 10, color: T.faint, marginRight: 2 }}>STATE</span>
            {states.map((st) => <button key={st} style={chip(state === st)} onClick={() => setState(st)}>{st}</button>)}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontFamily: mono, fontSize: 10, color: T.faint, marginRight: 2 }}>INTENSITY</span>
            {[["All", "All"], ["H", "Hurricane+"], ["MAJ", "Major (3+)"]].map(([k, l]) => (
              <button key={k} style={chip(minCat === k)} onClick={() => setMinCat(k)}>{l}</button>
            ))}
          </div>
        </div>
      </Panel>

      <Panel kicker={`${filtered.length} EVENT${filtered.length === 1 ? "" : "S"}`} title="US landfall & impact log · click a row for full detail">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 120px 1.3fr 1fr 80px", gap: 10, padding: "6px 8px", fontFamily: mono, fontSize: 9.5, letterSpacing: "0.1em", color: T.faint }}>
            <span>INTENSITY</span><span>STORM</span><span>LANDFALL</span><span>LOCATION</span><span>STATES</span><span style={{ textAlign: "right" }}>EST. DMG</span>
          </div>
          {filtered.map((s) => (
            <div key={s.id}>
              <div
                onClick={() => setOpen(open === s.id ? null : s.id)}
                style={{
                  display: "grid", gridTemplateColumns: "110px 1fr 120px 1.3fr 1fr 80px", gap: 10, padding: "10px 8px",
                  borderTop: `1px solid ${T.line}`, cursor: "pointer", alignItems: "center",
                  background: open === s.id ? T.panelUp : "transparent",
                }}
              >
                <span><CatBadge storm={s} small /></span>
                <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 13.5, color: T.text }}>{s.name} <span style={{ color: T.faint, fontWeight: 400 }}>’{String(s.year).slice(2)}</span></span>
                <span style={{ fontFamily: mono, fontSize: 11, color: T.muted }}>{s.lfDate.split(",")[0]}</span>
                <span style={{ fontFamily: sans, fontSize: 12, color: T.muted }}>{s.lfLoc}</span>
                <span style={{ fontFamily: mono, fontSize: 11, color: T.muted }}>{s.states.join(" ")}</span>
                <span style={{ fontFamily: mono, fontSize: 12, color: (s.damageB || 0) >= 10 ? CAT[4].color : T.text, textAlign: "right" }}>{fmtB(s.damageB)}</span>
              </div>
              {open === s.id && (
                <div style={{ padding: "4px 8px 16px", borderLeft: `2px solid ${catOf(s).color}`, marginLeft: 8, background: T.panelUp }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, padding: "10px 12px 6px" }}>
                    {[["Active dates", s.active + ", " + s.year], ["Landfall", s.lfDate], ["Peak intensity", s.peak], ["States impacted", s.states.join(", ")], ["Est. damage", fmtB(s.damageB)], ["Deaths", s.deaths != null ? `~${s.deaths}` : "—"]].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: "0.1em", color: T.faint }}>{k.toUpperCase()}</div>
                        <div style={{ fontFamily: mono, fontSize: 12.5, color: T.text, marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontFamily: sans, fontSize: 12.5, color: T.muted, lineHeight: 1.55, padding: "6px 12px 4px" }}>{s.notes}</div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div style={{ fontFamily: sans, fontSize: 13, color: T.muted, padding: 20 }}>No events match these filters. Clear a filter to widen the search.</div>}
        </div>
        <div style={{ fontFamily: mono, fontSize: 10, color: T.faint, marginTop: 12, lineHeight: 1.6 }}>
          Damage and death figures are estimates compiled from NOAA NCEI, NHC tropical cyclone reports and public reporting; figures for recent storms remain preliminary. Erin ’25 is included as a no-landfall coastal-impact event.
        </div>
      </Panel>
    </div>
  );
}
