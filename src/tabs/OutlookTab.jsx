import React from "react";
import { T, CAT, SEASON_2026, SNAPSHOT_SYSTEMS, NAMES_2026, SOURCES, SNAPSHOT_DATE } from "../data.js";
import { mono, sans, Panel, Stat } from "../components.jsx";
import { useLiveData, ktToMph, CLASS_LABEL, countNamed } from "../useLive.js";

const classColor = (c) =>
  c === "MH" ? CAT[4].color : c === "HU" ? CAT[2].color :
  c === "TS" || c === "STS" ? CAT.TS.color : "#8AA3B5";

function LiveStormCard({ s }) {
  const cls = s.classification;
  return (
    <div style={{ border: `1px solid ${classColor(cls)}66`, borderLeft: `3px solid ${classColor(cls)}`, borderRadius: 4, padding: "12px 14px", background: T.panelUp }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 15, color: T.text }}>{s.name}</span>
        <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: "#0A1118", background: classColor(cls), padding: "2px 7px", borderRadius: 3 }}>
          {CLASS_LABEL[cls] || cls}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10, marginTop: 10 }}>
        {[
          ["WINDS", s.intensity ? `${ktToMph(s.intensity)} mph` : "—"],
          ["PRESSURE", s.pressure ? `${s.pressure} mb` : "—"],
          ["MOVEMENT", s.movementDir != null ? `${s.movementDir}° @ ${s.movementSpeed} kt` : "—"],
          ["POSITION", s.latitude && s.longitude ? `${s.latitude}, ${s.longitude}` : "—"],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.1em", color: T.faint }}>{k}</div>
            <div style={{ fontFamily: mono, fontSize: 12.5, color: T.text, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>
      {s.lastUpdate && <div style={{ fontFamily: mono, fontSize: 9.5, color: T.faint, marginTop: 8 }}>NHC ADVISORY · {s.lastUpdate}</div>}
    </div>
  );
}

export default function OutlookTab() {
  const live = useLiveData();
  const feedUp = live.status === "ok" || live.status === "cached";
  const namedToDate = countNamed(live.seasonLog);
  const named = namedToDate != null ? namedToDate : SEASON_2026.nsToDate;
  const nextName = NAMES_2026[Math.min(named, NAMES_2026.length - 1)];

  const MONTHS = ["JUN", "JUL", "AUG", "SEP", "OCT", "NOV"];
  const nowIdx = new Date().getMonth() - 5; // Jun = 0 … Nov = 5; outside season → no marker

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Feed status banner */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, fontFamily: mono, fontSize: 10.5, letterSpacing: "0.08em",
        color: feedUp ? T.green : T.amber, border: `1px solid ${feedUp ? T.green : T.amber}55`, borderRadius: 4, padding: "8px 14px",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: feedUp ? T.green : T.amber, boxShadow: `0 0 8px ${feedUp ? T.green : T.amber}` }} />
        {live.status === "loading" && "CONNECTING TO NHC FEED…"}
        {live.status === "ok" && `LIVE · NHC FEED · FETCHED ${live.fetchedAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
        {live.status === "cached" && `NHC FEED · CACHED COPY FROM ${live.fetchedAt?.toLocaleString([], { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })} · REFRESHES EVERY 6H`}
        {live.status === "feed-down" && `LIVE FEED UNAVAILABLE — SHOWING CURATED SNAPSHOT (${SNAPSHOT_DATE.toUpperCase()})`}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Stat label="Named storms to date" value={named} sub={`Next name up: ${nextName}${namedToDate == null ? " · from curated snapshot" : " · from auto-updated season log"}`} />
        <Stat label="Active Atlantic systems" value={feedUp ? live.storms.length : "—"} accent={T.amber} sub={feedUp ? "From NHC CurrentStorms feed, fetched on page load" : "Feed unreachable — see snapshot below"} />
        <Stat label="Season character" value="55%" sub="NOAA's probability of a below-normal season (El Niño-driven)" />
        <Stat label="US major landfall odds" value="24%" accent={CAT[3].color} sub="CSU's 2026 probability for the full US coastline, vs 43% historical avg" />
      </div>

      {/* Live active systems */}
      <Panel kicker="ACTIVE SYSTEMS · ATLANTIC BASIN" title={null} style={feedUp && live.storms.length ? { border: `1px solid ${T.amber}55` } : undefined}>
        {feedUp && live.storms.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {live.storms.map((s) => <LiveStormCard key={s.id} s={s} />)}
          </div>
        )}
        {feedUp && live.storms.length === 0 && (
          <div style={{ fontFamily: sans, fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
            No active tropical cyclones in the Atlantic basin right now. Pre-formation disturbances appear in the Tropical Weather Outlook below before they show up here.
          </div>
        )}
        {!feedUp && live.status !== "loading" && SNAPSHOT_SYSTEMS.map((sys) => (
          <div key={sys.id} style={{ marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 15, color: T.text }}>{sys.title}</span>
              <span style={{ fontFamily: mono, fontSize: 9.5, color: T.amber, border: `1px solid ${T.amber}`, padding: "2px 8px", borderRadius: 3, letterSpacing: "0.1em" }}>SNAPSHOT · {SNAPSHOT_DATE}</span>
            </div>
            <div style={{ fontFamily: sans, fontSize: 13, color: T.text, lineHeight: 1.6 }}>{sys.detail}</div>
            <div style={{ fontFamily: sans, fontSize: 12, color: T.muted, lineHeight: 1.55, marginTop: 8, borderLeft: `2px solid ${T.amber}`, paddingLeft: 10 }}>{sys.threat}</div>
          </div>
        ))}
      </Panel>

      {/* Live Tropical Weather Outlook bulletin */}
      {live.outlookText && (
        <Panel kicker="NHC TROPICAL WEATHER OUTLOOK · LIVE BULLETIN" title={null}>
          <pre style={{ fontFamily: mono, fontSize: 11.5, color: T.text, lineHeight: 1.65, whiteSpace: "pre-wrap", maxHeight: 320, overflowY: "auto", margin: 0 }}>
            {live.outlookText}
          </pre>
        </Panel>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <Panel kicker="SEASON CLOCK" title="Where we are in the season">
          <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
            {MONTHS.map((m, i) => {
              const peak = i === 2 || i === 3;
              const shoulder = i === 4;
              const now = i === nowIdx;
              return (
                <div key={m} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: 34, borderRadius: 3, background: peak ? CAT[3].color : shoulder ? CAT[1].color : T.line, opacity: peak ? 0.9 : shoulder ? 0.7 : 0.6, border: now ? `2px solid ${T.text}` : "none", position: "relative" }}>
                    {now && <div style={{ position: "absolute", top: -16, width: "100%", fontFamily: mono, fontSize: 8.5, color: T.text }}>YOU ARE HERE</div>}
                  </div>
                  <div style={{ fontFamily: mono, fontSize: 10, color: T.muted, marginTop: 5 }}>{m}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontFamily: sans, fontSize: 12, color: T.muted, lineHeight: 1.6, marginTop: 14 }}>
            ~90% of major-hurricane activity historically occurs August–October, with the climatological peak around September 10. June activity, when it happens, favors the Gulf and the Southeast coast. For XKIG, the operational ramp window is early season; the revenue window typically opens late August.
          </div>
        </Panel>

        <Panel kicker="2026 NAME LIST" title="Storm names (recycled 2020 list)">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {NAMES_2026.map((n, i) => {
              const used = i < named;
              const next = i === named;
              return (
                <span key={n} style={{
                  fontFamily: mono, fontSize: 11, padding: "4px 10px", borderRadius: 3,
                  border: `1px solid ${next ? T.amber : T.line}`,
                  color: used ? T.text : next ? T.amber : T.muted,
                  background: used ? `${CAT.TS.color}22` : next ? `${T.amber}14` : "transparent",
                  textDecoration: "none",
                }}>{next ? "▸ " : ""}{n}</span>
              );
            })}
          </div>
          <div style={{ fontFamily: sans, fontSize: 12, color: T.muted, lineHeight: 1.55, marginTop: 12 }}>
            Names rotate on a six-year cycle; 2026 reuses the 2020 list with retired names replaced (Laura → Leah). Used names are shaded as the season log records them; ▸ marks the next name up.
          </div>
        </Panel>
      </div>

      <Panel kicker="HOW THIS STAYS LIVE" title="Data architecture">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
          {SOURCES.map((s) => (
            <div key={s.name} style={{ border: `1px solid ${T.line}`, borderRadius: 4, padding: "10px 12px" }}>
              <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 12.5, color: T.text }}>{s.name}</div>
              <div style={{ fontFamily: mono, fontSize: 10.5, color: T.amber, margin: "3px 0" }}>{s.url}</div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: T.muted }}>{s.use}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: sans, fontSize: 12, color: T.muted, lineHeight: 1.6, marginTop: 12 }}>
          Three layers: (1) live — active systems and the Tropical Weather Outlook are fetched from NHC on every page load; (2) automatic — the season-to-date storm log is appended twice daily by a scheduled GitHub Action, which also triggers a redeploy; (3) curated — historical landfalls, damage estimates, and forecast revisions live in <span style={{ fontFamily: mono }}>src/data.js</span> (curated as of {SNAPSHOT_DATE}); update them there or hand the file to Claude for a refresh.
        </div>
      </Panel>
    </div>
  );
}
