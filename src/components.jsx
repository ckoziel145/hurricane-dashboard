import React from "react";
import { T, CAT, catOf } from "./data.js";

/* ============== SHARED UI ============== */
export const mono = "'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace";
export const sans = "'Archivo', 'Helvetica Neue', Arial, sans-serif";

export const fmtB = (v) => (v == null ? "—" : v < 0.1 ? "<$0.1B" : `$${v >= 10 ? v.toFixed(0) : v.toFixed(1)}B`);

export function Panel({ title, kicker, children, style }) {
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 6, padding: "18px 20px", ...style }}>
      {kicker && <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", color: T.faint, marginBottom: 4 }}>{kicker}</div>}
      {title && <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 14 }}>{title}</div>}
      {children}
    </div>
  );
}

export function Stat({ label, value, sub, accent }) {
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderTop: `2px solid ${accent || T.line}`, borderRadius: 6, padding: "14px 16px", flex: 1, minWidth: 150 }}>
      <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", color: T.muted, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 600, color: accent || T.text, margin: "6px 0 2px" }}>{value}</div>
      {sub && <div style={{ fontFamily: sans, fontSize: 11.5, color: T.muted, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}

export function CatBadge({ storm, small }) {
  const c = storm.landfall === false ? { label: "NO US LANDFALL", color: T.faint } : storm.unnamed ? { label: "UNNAMED · TS", color: "#8AA3B5" } : catOf(storm);
  return (
    <span style={{ fontFamily: mono, fontSize: small ? 9 : 10, fontWeight: 600, letterSpacing: "0.08em", color: "#0A1118", background: c.color, padding: small ? "2px 6px" : "3px 8px", borderRadius: 3, whiteSpace: "nowrap" }}>
      {c.label}
    </span>
  );
}

export function ChartTip({ active, payload, label, suffix }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.panelUp, border: `1px solid ${T.line}`, borderRadius: 4, padding: "8px 12px", fontFamily: mono, fontSize: 11 }}>
      <div style={{ color: T.text, marginBottom: 4, fontWeight: 600 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color || p.fill, display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span>{p.name}</span><span>{typeof p.value === "number" ? (suffix === "$" ? fmtB(p.value) : p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

export const axisProps = { stroke: T.faint, tick: { fill: T.muted, fontFamily: mono, fontSize: 10 }, tickLine: false, axisLine: { stroke: T.line } };
