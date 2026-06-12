import React, { useState } from "react";
import { T, CAT } from "./data.js";
import { mono, sans } from "./components.jsx";

// SHA-256 of the access password — the plaintext never ships in the bundle.
const PASS_HASH = "d7953050fe8bce64b35dd18f0de4099fefe50e2ae1c90d381acedaf75f585a7d";
const STORAGE_KEY = "hst-auth";

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function Gate({ children }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(STORAGE_KEY) === PASS_HASH);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  if (unlocked) return children;

  const submit = async (e) => {
    e.preventDefault();
    setChecking(true);
    const hash = await sha256Hex(input);
    if (hash === PASS_HASH) {
      sessionStorage.setItem(STORAGE_KEY, hash);
      setUnlocked(true);
    } else {
      setError(true);
      setChecking(false);
    }
  };

  const ramp = Object.values(CAT).map((c) => c.color);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", height: 5 }}>
        {ramp.map((c) => <div key={c} style={{ flex: 1, background: c }} />)}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <form onSubmit={submit} style={{ width: 340, border: `1px solid ${T.line}`, borderRadius: 6, padding: "30px 28px" }}>
          <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: "0.22em", color: T.amber }}>ATLANTIC BASIN · SEASON INTELLIGENCE</div>
          <h1 style={{ fontFamily: sans, fontWeight: 800, fontSize: 22, color: T.text, margin: "8px 0 18px" }}>Hurricane Season Tracker</h1>
          <label htmlFor="gate-pass" style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", color: T.muted, display: "block", marginBottom: 6 }}>ACCESS PASSWORD</label>
          <input
            id="gate-pass"
            type="password"
            autoFocus
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            style={{
              width: "100%", boxSizing: "border-box", fontFamily: mono, fontSize: 14, color: T.text,
              background: "rgba(255,255,255,0.04)", border: `1px solid ${error ? "#E0533D" : T.line}`,
              borderRadius: 4, padding: "10px 12px", outline: "none",
            }}
          />
          {error && (
            <div style={{ fontFamily: mono, fontSize: 10, color: "#E0533D", marginTop: 8, letterSpacing: "0.08em" }}>INCORRECT PASSWORD</div>
          )}
          <button
            type="submit"
            disabled={checking || !input}
            style={{
              width: "100%", marginTop: 16, fontFamily: mono, fontSize: 11, letterSpacing: "0.12em",
              color: T.bg, background: T.amber, border: "none", borderRadius: 4, padding: "11px 0",
              cursor: checking || !input ? "default" : "pointer", opacity: checking || !input ? 0.6 : 1,
            }}
          >{checking ? "CHECKING…" : "ENTER"}</button>
        </form>
      </div>
    </div>
  );
}
