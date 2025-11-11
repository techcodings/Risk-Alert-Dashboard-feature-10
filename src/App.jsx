import React, { useState } from 'react'
import { api } from './lib.js'
import LineChart from './components/LineChart.jsx'

const today = new Date().toISOString().slice(0,10);
const last30 = new Date(Date.now()-29*24*3600*1000).toISOString().slice(0,10);

export default function App() {
  const [lat, setLat] = useState(37.7749);
  const [lng, setLng] = useState(-122.4194);
  const [start, setStart] = useState(last30);
  const [end, setEnd] = useState(today);
  const [busy, setBusy] = useState(false);
  const [series, setSeries] = useState([]);
  const [ma7, setMa7] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // NEW: user-tunable thresholds
  const [riskHigh, setRiskHigh] = useState(0.60);
  const [riskSpike, setRiskSpike] = useState(0.10);
  const [precipHigh, setPrecipHigh] = useState(10);

  async function runAll() {
    setBusy(true);
    try {
      const ts = await api.timeseries({ lat, lng, start, end });
      const s = ts.series || [];
      setSeries(s);
      setMa7(ts.ma7 || []);

      const m = await api.metrics(s);
      setMetrics(m);

      // Send thresholds for alerts
      const a = await api.alerts(s, {
        riskHigh: Number(riskHigh),
        riskSpike: Number(riskSpike),
        precipHigh: Number(precipHigh)
      });
      setAlerts(a.alerts || []);
    } catch (e) {
      alert('Error: ' + e);
    } finally {
      setBusy(false);
    }
  }

  async function downloadPdf() {
    const payload = { title: 'Risk & Alert Report', metrics: metrics || {}, alerts: alerts || [] };
    const { blob } = await api.report(payload);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'risk-alert-report.pdf'; a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  }

  const labels = series.map(s => s.day);
  const risk = series.map(s => s.risk);

  return (
    <div className="container" style={{ position: 'relative' }}>
      {/* ✅ Fixed Top-Right Back Button */}
      <a
        href="https://energy-verse-portal.netlify.app/?feature=10"
        className="btn-back-top"
        style={{
          position: 'absolute',
          top: '16px',
          right: '20px',
          background: 'linear-gradient(90deg, #caff37, #84ff4b)',
          color: '#000',
          padding: '7px 16px',
          borderRadius: '8px',
          fontWeight: '600',
          textDecoration: 'none',
          boxShadow: '0 0 12px rgba(186,255,55,0.7)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = '0 0 20px rgba(186,255,55,1)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow = '0 0 12px rgba(186,255,55,0.7)')
        }
      >
        ← Back to Home
      </a>

   <h1 className="main-title" style={{ marginTop: '60px' }}>
  
</h1>
<h1 className="sub-title">⚠️ Risk & Alert Dashboard</h1>



      {/* Controls */}
      <div className="card">
        <h2>Controls</h2>

        <div className="input-row">
          <div>
            <label>Latitude</label>
            <input type="number" step="0.0001" value={lat} onChange={e=>setLat(Number(e.target.value))}/>
          </div>
          <div>
            <label>Longitude</label>
            <input type="number" step="0.0001" value={lng} onChange={e=>setLng(Number(e.target.value))}/>
          </div>
        </div>

        <div className="input-row">
          <div>
            <label>Start</label>
            <input type="date" value={start} onChange={e=>setStart(e.target.value)}/>
          </div>
          <div>
            <label>End</label>
            <input type="date" value={end} onChange={e=>setEnd(e.target.value)}/>
          </div>
        </div>

        {/* Thresholds */}
        <div className="input-row">
          <div>
            <label>Risk High (0–1)</label>
            <input type="number" min="0" max="1" step="0.01" value={riskHigh}
                   onChange={e=>setRiskHigh(e.target.value)} />
          </div>
          <div>
            <label>Risk Spike Δ</label>
            <input type="number" min="0" max="1" step="0.01" value={riskSpike}
                   onChange={e=>setRiskSpike(e.target.value)} />
          </div>
        </div>
        <div className="input-row">
          <div>
            <label>Precip High (mm/day)</label>
            <input type="number" min="0" step="0.1" value={precipHigh}
                   onChange={e=>setPrecipHigh(e.target.value)} />
          </div>
          <div />
        </div>

        <div className="flex">
          <button className="primary" onClick={runAll} disabled={busy}>Run Dashboard</button>
          <button className="secondary" onClick={downloadPdf} disabled={!metrics}>Download PDF</button>
        </div>

        <div style={{marginTop:8}}>
          <span className="badge">Lat: {lat}</span>
          <span className="badge">Lng: {lng}</span>
          {metrics && <span className="badge">Days: {metrics.days}</span>}
          <span className="badge">riskHigh {Number(riskHigh).toFixed(2)}</span>
          <span className="badge">spike {Number(riskSpike).toFixed(2)}</span>
          <span className="badge">precip ≥ {Number(precipHigh).toFixed(1)}mm</span>
        </div>
      </div>

      {/* Dashboard */}
      <div className="card">
        <div className="flex" style={{justifyContent:'space-between'}}>
          <div className="flex">
            <h2 style={{marginRight:8}}>Risk & Alert Dashboard</h2>
            <span className="badge">Real-time (poll manually)</span>
          </div>
          <div className="kpi" style={{minWidth:420}}>
            <div className="metric"><div className="val">{metrics ? metrics.days : '-'}</div><div className="label">Days</div></div>
            <div className="metric"><div className="val">{metrics ? metrics.avgRisk.toFixed(2) : '-'}</div><div className="label">Avg Risk</div></div>
            <div className="metric"><div className="val">{metrics ? metrics.maxRisk.toFixed(2) : '-'}</div><div className="label">Max Risk</div></div>
            <div className="metric"><div className="val">{metrics ? metrics.totalPrecip.toFixed(1) : '-'}</div><div className="label">Total Precip (mm)</div></div>
          </div>
        </div>

        <LineChart dataA={risk} dataB={ma7} labels={labels} labelA="Risk" labelB="7d Avg" />

        <h3 style={{margin:'8px 0'}}>Alerts</h3>
        <table className="table">
          <thead><tr><th>Date</th><th>Type</th><th>Severity</th><th>Message</th></tr></thead>
          <tbody>
            {alerts.length ? alerts.map((a,i)=>(
              <tr key={i}>
                <td>{a.day}</td><td>{a.type}</td>
                <td style={{color: a.severity==='high'?'#ef4444': '#fbbf24'}}>{a.severity}</td>
                <td>{a.msg}</td>
              </tr>
            )) : <tr><td colSpan="4" style={{color:'#93a3b8'}}>No alerts yet. Adjust thresholds or run again.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
