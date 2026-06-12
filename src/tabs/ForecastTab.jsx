import React, { useState, useMemo } from "react";
import { ComposedChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList, ReferenceLine } from "recharts";
import { T, CAT, catOf, SEASONS, SEASON_2026, STORMS, FORECASTS, REVISIONS_2026, SE_STATES, SNAPSHOT_DATE } from "../data.js";
import { mono, sans, fmtB, Panel, Stat, CatBadge, ChartTip, axisProps } from "../components.jsx";

/* ============== TAB 3 — FORECAST VS ACTUAL ============== */
export default function ForecastTab() {
  const nsData = FORECASTS.map((f) => ({
    year: String(f.year),
    "CSU (April)": f.csuApr.ns,
    "NOAA (midpoint)": Math.round((f.noaa.lo + f.noaa.hi) / 2 * 10) / 10,
    Actual: f.actual ? f.actual.ns : null,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 14 }}>
        <Panel kicker="CALIBRATION" title="Named storms — preseason forecast vs actual">
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={nsData} barGap={2}>
              <CartesianGrid stroke={T.line} strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="year" {...axisProps} />
              <YAxis {...axisProps} width={28} />
              <Tooltip content={<ChartTip />} cursor={{ fill: "#ffffff08" }} />
              <Legend wrapperStyle={{ fontFamily: mono, fontSize: 10 }} />
              <ReferenceLine y={14.4} stroke={T.faint} strokeDasharray="4 4" label={{ value: "1991–2020 avg", fill: T.faint, fontFamily: mono, fontSize: 9, position: "insideTopRight" }} />
              <Bar dataKey="CSU (April)" fill={T.faint} radius={[2, 2, 0, 0]} />
              <Bar dataKey="NOAA (midpoint)" fill={CAT.TS.color} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Actual" fill={T.amber} radius={[2, 2, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
          <div style={{ fontFamily: mono, fontSize: 10, color: T.faint, marginTop: 6 }}>2026 actual = TBD (none as of the curated snapshot, {SNAPSHOT_DATE}). Misses run both ways: 2020 under-called by ~14; 2022 & 2025 over-called.</div>
        </Panel>

        <Panel kicker="FULL SCOREBOARD" title="Forecast vs actual — all metrics">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: mono, fontSize: 11.5 }}>
              <thead>
                <tr style={{ color: T.faint, fontSize: 9.5, letterSpacing: "0.08em", textAlign: "left" }}>
                  <th style={{ padding: "6px 8px" }}>YR</th>
                  <th style={{ padding: "6px 8px" }}>CSU APR (NS/H/MH)</th>
                  <th style={{ padding: "6px 8px" }}>NOAA RANGE (NS)</th>
                  <th style={{ padding: "6px 8px" }}>ACTUAL</th>
                  <th style={{ padding: "6px 8px" }}>US HUR. LANDFALLS</th>
                </tr>
              </thead>
              <tbody>
                {FORECASTS.map((f) => {
                  const lf = STORMS.filter((s) => s.year === f.year && s.landfall && s.cat >= 1).length;
                  return (
                    <tr key={f.year} style={{ borderTop: `1px solid ${T.line}`, color: T.text }}>
                      <td style={{ padding: "8px", color: T.amber }}>{f.year}</td>
                      <td style={{ padding: "8px", color: T.muted }}>{f.csuApr.ns}/{f.csuApr.h}/{f.csuApr.mh}{f.csuJun ? <span style={{ color: T.amber }}> → {f.csuJun.ns}/{f.csuJun.h}/{f.csuJun.mh}</span> : ""}</td>
                      <td style={{ padding: "8px", color: T.muted }}>{f.noaa.lo}–{f.noaa.hi}</td>
                      <td style={{ padding: "8px" }}>{f.actual ? `${f.actual.ns}/${f.actual.h}/${f.actual.mh}` : "in progress"}</td>
                      <td style={{ padding: "8px", color: f.year === 2026 ? T.faint : lf >= 3 ? CAT[4].color : T.text }}>{f.year === 2026 ? "0 to date" : lf}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ fontFamily: sans, fontSize: 12, color: T.muted, marginTop: 10, lineHeight: 1.55, borderLeft: `2px solid ${T.amber}`, paddingLeft: 10 }}>
            The read for XKIG: seasonal totals are a weak proxy for demand. 2025 hit near-average activity with zero hurricane landfalls; 2023's modest El Niño season still put Idalia into the Big Bend. Landfall count and location — not basin activity — drive cleanup volume.
          </div>
        </Panel>
      </div>

      <Panel kicker="2026 FORECAST REVISION LOG" title="How the 2026 outlook has moved">
        {REVISIONS_2026.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: i < REVISIONS_2026.length - 1 ? `1px solid ${T.line}` : "none" }}>
            <div style={{ minWidth: 110, fontFamily: mono, fontSize: 11, color: r.dir === "down" ? CAT[4].color : r.dir === "next" ? T.green : T.amber }}>{r.date}</div>
            <div>
              <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 13, color: T.text }}>
                {r.source}{r.dir === "down" && <span style={{ fontFamily: mono, fontSize: 9, color: CAT[4].color, marginLeft: 8, border: `1px solid ${CAT[4].color}`, padding: "1px 6px", borderRadius: 3 }}>▼ REVISED DOWN</span>}
              </div>
              <div style={{ fontFamily: sans, fontSize: 12.5, color: T.muted, lineHeight: 1.55, marginTop: 3 }}>{r.detail}</div>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}
