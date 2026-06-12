import React, { useState, useMemo } from "react";
import { ComposedChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList, ReferenceLine } from "recharts";
import { T, CAT, catOf, SEASONS, SEASON_2026, STORMS, FORECASTS, REVISIONS_2026, SE_STATES, SNAPSHOT_DATE } from "../data.js";
import { mono, sans, fmtB, Panel, Stat, CatBadge, ChartTip, axisProps } from "../components.jsx";

/* ============== TAB 1 — SEASON TRENDS ============== */
export default function TrendsTab() {
  const landfalls = STORMS.filter((s) => s.landfall);
  const activityData = useMemo(() => [
    ...SEASONS.map((s) => ({ year: String(s.year), "Named storms": s.ns, Hurricanes: s.h, Major: s.mh, ace: s.ace })),
    { year: "2026F", "Named storms": SEASON_2026.csuJune.ns, Hurricanes: SEASON_2026.csuJune.h, Major: SEASON_2026.csuJune.mh, forecast: true },
  ], []);

  const landfallByCat = useMemo(() => SEASONS.map((s) => {
    const yr = landfalls.filter((st) => st.year === s.year);
    return {
      year: String(s.year),
      "Tropical storm": yr.filter((st) => st.cat === 0).length,
      "Cat 1–2": yr.filter((st) => st.cat === 1 || st.cat === 2).length,
      "Major (3+)": yr.filter((st) => st.cat >= 3).length,
    };
  }), []);

  const damageData = useMemo(() => SEASONS.map((s) => ({
    year: String(s.year),
    "Est. US damage": +STORMS.filter((st) => st.year === s.year).reduce((a, b) => a + (b.damageB || 0), 0).toFixed(1),
  })), []);

  const stateAnnualData = useMemo(() => {
    const counts = {};
    STORMS.forEach((s) => {
      if (![2024, 2025, 2026].includes(s.year)) return;
      s.states.forEach((st) => {
        counts[st] = counts[st] || { state: st, y24: 0, y25: 0, y26: 0 };
        counts[st][s.year === 2024 ? "y24" : s.year === 2025 ? "y25" : "y26"] += 1;
      });
    });
    return Object.values(counts)
      .map((d) => ({ ...d, total: d.y24 + d.y25 + d.y26 }))
      .sort((a, b) => b.total - a.total || a.state.localeCompare(b.state));
  }, []);

  const totalDamage = STORMS.reduce((a, b) => a + (b.damageB || 0), 0);
  const hurLandfalls = landfalls.filter((s) => s.cat >= 1).length;
  const seShare = Math.round(100 * landfalls.filter((s) => s.states.some((st) => SE_STATES.includes(st))).length / landfalls.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Stat label="US landfall events · 2020–25" value={landfalls.length} sub="Named + unnamed systems making US landfall at TS strength or higher" />
        <Stat label="Hurricane landfalls" value={hurLandfalls} accent={CAT[3].color} sub="6 in 2020 · 5 in 2024 · 0 in 2025 — demand is lumpy, not smooth" />
        <Stat label="Est. US damage · 2020–25" value={`$${Math.round(totalDamage)}B`} accent={CAT[4].color} sub="2022 + 2024 alone account for ~70% of the six-year total" />
        <Stat label="Landfalls touching SE states" value={`${seShare}%`} accent={T.amber} sub="Share of US landfall events impacting XKIG's footprint (FL→VA, Gulf)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 14 }}>
        <Panel kicker="BASIN ACTIVITY" title="Named storms, hurricanes & majors by season">
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={activityData} barGap={2}>
              <CartesianGrid stroke={T.line} strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="year" {...axisProps} />
              <YAxis {...axisProps} width={28} />
              <Tooltip content={<ChartTip />} cursor={{ fill: "#ffffff08" }} />
              <Legend wrapperStyle={{ fontFamily: mono, fontSize: 10 }} />
              <Bar dataKey="Named storms" fill={CAT.TS.color} radius={[2, 2, 0, 0]}>
                {activityData.map((d, i) => <Cell key={i} fillOpacity={d.forecast ? 0.35 : 1} stroke={d.forecast ? CAT.TS.color : "none"} strokeDasharray={d.forecast ? "3 3" : "0"} />)}
              </Bar>
              <Bar dataKey="Hurricanes" fill={CAT[2].color} radius={[2, 2, 0, 0]}>
                {activityData.map((d, i) => <Cell key={i} fillOpacity={d.forecast ? 0.35 : 1} />)}
              </Bar>
              <Bar dataKey="Major" fill={CAT[4].color} radius={[2, 2, 0, 0]}>
                {activityData.map((d, i) => <Cell key={i} fillOpacity={d.forecast ? 0.35 : 1} />)}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
          <div style={{ fontFamily: mono, fontSize: 10, color: T.faint, marginTop: 6 }}>2026F = CSU June forecast (11 / 5 / 2), shown faded. Avg season: 14.4 / 7.2 / 3.2.</div>
        </Panel>

        <Panel kicker="THE NUMBER THAT DRIVES DEMAND" title="US landfall events by intensity at landfall">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={landfallByCat}>
              <CartesianGrid stroke={T.line} strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="year" {...axisProps} />
              <YAxis {...axisProps} width={28} allowDecimals={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill: "#ffffff08" }} />
              <Legend wrapperStyle={{ fontFamily: mono, fontSize: 10 }} />
              <Bar dataKey="Tropical storm" stackId="a" fill={CAT.TS.color} />
              <Bar dataKey="Cat 1–2" stackId="a" fill={CAT[1].color} />
              <Bar dataKey="Major (3+)" stackId="a" fill={CAT[4].color} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontFamily: mono, fontSize: 10, color: T.faint, marginTop: 6 }}>2025: one TS landfall (Chantal) despite a near-average season — activity ≠ landfalls.</div>
        </Panel>

        <Panel kicker="LOSS SEVERITY" title="Estimated US damage by season ($B)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={damageData}>
              <CartesianGrid stroke={T.line} strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="year" {...axisProps} />
              <YAxis {...axisProps} width={36} />
              <Tooltip content={<ChartTip suffix="$" />} cursor={{ fill: "#ffffff08" }} />
              <Bar dataKey="Est. US damage" fill={CAT[3].color} radius={[2, 2, 0, 0]}>
                <LabelList dataKey="Est. US damage" position="top" style={{ fill: T.muted, fontFamily: mono, fontSize: 10 }} formatter={(v) => `$${v}B`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontFamily: mono, fontSize: 10, color: T.faint, marginTop: 6 }}>Sum of per-storm estimates (NCEI / public reporting). 2022 ≈ Ian; 2024 ≈ Helene + Milton.</div>
        </Panel>

        <Panel kicker="GEOGRAPHY" title="Storm events impacting each state · 2024 / 2025 / YTD 2026">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stateAnnualData} barGap={1}>
              <CartesianGrid stroke={T.line} strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="state" {...axisProps} />
              <YAxis {...axisProps} width={28} allowDecimals={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill: "#ffffff08" }} />
              <Legend wrapperStyle={{ fontFamily: mono, fontSize: 10 }} />
              <Bar dataKey="y24" name="2024" fill={CAT[3].color} radius={[2, 2, 0, 0]} />
              <Bar dataKey="y25" name="2025" fill={CAT.TS.color} radius={[2, 2, 0, 0]} />
              <Bar dataKey="y26" name="2026 YTD" fill={T.green} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontFamily: mono, fontSize: 10, color: T.faint, marginTop: 6 }}>
            Counts storms listing the state among impacted areas. 2026 YTD reflects the curated storm log (zero US impact events as of {SNAPSHOT_DATE}). Erin ’25 counted as a no-landfall coastal-impact event (NC).
          </div>
        </Panel>
      </div>

      <Panel kicker="SEASON NOTES" title="One-line read on each season">
        {SEASONS.map((s) => (
          <div key={s.year} style={{ display: "flex", gap: 14, padding: "7px 0", borderBottom: `1px solid ${T.line}`, alignItems: "baseline" }}>
            <span style={{ fontFamily: mono, fontSize: 12, color: T.amber, minWidth: 42 }}>{s.year}</span>
            <span style={{ fontFamily: mono, fontSize: 11, color: T.muted, minWidth: 110 }}>{s.ns} NS / {s.h} H / {s.mh} MH · ACE {s.ace}</span>
            <span style={{ fontFamily: sans, fontSize: 12.5, color: T.text, lineHeight: 1.45 }}>{s.note}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}
