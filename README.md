# Risk & Alert Dashboard (React + Vite)

- Calls Netlify Functions:
  - `/.netlify/functions/timeseries` (GET lat,lng,start,end)
  - `/.netlify/functions/metrics` (POST series)
  - `/.netlify/functions/alerts` (POST series, thresholds Optional)
  - `/.netlify/functions/report` (POST metrics+alerts → PDF)
- Simple SVG charts, no external chart libs.

## Run
```bash
npm i
npm run dev
```
If functions are on another origin, set:
```
VITE_API_BASE=https://your-site.netlify.app
```
