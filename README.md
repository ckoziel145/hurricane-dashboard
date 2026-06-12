# Hurricane Season Tracker

A live Atlantic hurricane dashboard built as a portfolio monitor for XKIG (emergency storm response, southeastern US). Four tabs: a live 2026 outlook, season trends (2020–present), a drill-down landfall log, and forecast-vs-actual analysis.

**Deployed at: https://ckoziel145.github.io/hurricane-dashboard/** (GitHub Pages, password-gated — see Access control below). Repo: https://github.com/ckoziel145/hurricane-dashboard

## How the data stays current

The dashboard runs on three layers:

| Layer | What | How it updates |
|---|---|---|
| **Live** | Active Atlantic systems + NHC Tropical Weather Outlook bulletin | Fetched from NHC on every page load via the included `/api/nhc` proxy |
| **Automatic** | Season-to-date storm log (`public/data/season-log.json`) | GitHub Action runs twice daily, appends new systems from NHC's feed, commits — which also triggers a redeploy |
| **Curated** | Historical landfalls, damage estimates, seasonal forecasts and revisions (`src/data.js`) | Edit by hand, or paste `src/data.js` into Claude and ask for a refresh — these sources (NCEI, CSU) have no clean real-time APIs |

The proxy exists because nhc.noaa.gov does not send CORS headers, so browsers can't fetch it directly. The function is allowlisted to two NHC URLs only — it is not an open proxy. If the live feed is ever unreachable, the UI falls back to the embedded curated snapshot and says so.

## Deploy (≈5 minutes)

### GitHub Pages (current deployment)
`.github/workflows/deploy.yml` builds and deploys on every push to `main`, and also on a 6-hour schedule. GitHub Pages has no serverless functions, so the `/api/nhc` proxy doesn't run there; instead the deploy workflow fetches static copies of the two NHC feeds into `public/data/` (`nhc-current.json`, `nhc-outlook.xml`) at build time, and the UI falls back to those (shown as "CACHED COPY" with the fetch time). Net effect: live data is at most ~6 hours old. The season-log automation below works unchanged.

### Vercel (recommended for true page-load-live data)
1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project → Import** the repo. Framework preset: **Vite**. Deploy.
3. The `api/nhc.js` serverless function is detected automatically — no configuration needed.

### Netlify
1. Push to GitHub, then in Netlify: **Add new site → Import an existing project**.
2. `netlify.toml` already sets the build command, publish directory, functions directory, and the `/api/nhc` redirect.

### Enable the season-log automation
1. In the GitHub repo: **Settings → Actions → General → Workflow permissions → Read and write permissions** (the action commits the updated log).
2. That's it — `refresh-season.yml` runs at 06:00 and 18:00 UTC. You can also trigger it manually from the Actions tab (**Run workflow**).
3. Because Vercel/Netlify redeploy on every commit, each log update ships automatically.

## Local development

```bash
npm install
vercel dev        # or: netlify dev — runs the proxy locally so live feeds work
```

Plain `npm run dev` works too, but `/api/nhc` won't exist, so the Live Outlook tab will show its snapshot fallback. Everything else works.

## Updating the curated layers

All curated data lives in `src/data.js`, organized and commented:
- `STORMS` — the landfall log (add new 2026 events here as they happen; the format is self-evident)
- `FORECASTS` / `REVISIONS_2026` — forecast-vs-actual and the revision timeline (CSU updates: Jul 8, Aug 5; NOAA mid-season update: early August)
- `SEASONS` — season aggregates and one-line summaries

The fastest workflow: paste `src/data.js` into Claude and ask it to research and refresh the curated layers.

## Access control

The site is wrapped in a password gate (`src/Gate.jsx`): the dashboard only renders after the access password is entered (checked as a SHA-256 hash; remembered for the browser session). To change the password, hash the new one (`node -e "console.log(require('crypto').createHash('sha256').update('NEWPASS').digest('hex'))"`) and replace `PASS_HASH` in `src/Gate.jsx`.

Note the honest limits: this is a client-side gate on a static site — it keeps out casual visitors, but the underlying data ships in the public JS bundle, and the repo itself is public (GitHub Pages on a free plan requires that). The page also sets `noindex`. For hard server-side protection, deploy to Vercel/Netlify and use their plan-dependent **Deployment Protection** / **password protection** features.

## Data sources & disclaimers

- NHC CurrentStorms.json and Atlantic RSS (live); HURDAT2 (historical best track)
- NOAA NCEI Billion-Dollar Disasters (damage estimates)
- CSU Tropical Meteorology Project and NOAA CPC (seasonal forecasts)

Damage and fatality figures are estimates and subject to revision; recent-storm figures are preliminary. Seasonal outlooks are not landfall forecasts. For warnings and life-safety decisions, use nhc.noaa.gov directly.
