const base = import.meta.env.VITE_API_BASE || "";

export const api = {
  timeseries: ({lat,lng,start,end}) => fetch(`${base}/.netlify/functions/timeseries?`+new URLSearchParams({lat,lng,start,end})).then(r=>r.json()),
  metrics: (series) => fetch(`${base}/.netlify/functions/metrics`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ series })}).then(r=>r.json()),
  alerts:  (series, thresholds) => fetch(`${base}/.netlify/functions/alerts`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ series, thresholds })}).then(r=>r.json()),
  report:  (payload) => fetch(`${base}/.netlify/functions/report`, {method:'POST', body: JSON.stringify(payload)}).then(async r => ({ blob: await r.blob() })),
};
