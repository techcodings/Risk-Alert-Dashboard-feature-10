import React from 'react'
export default function LineChart({ dataA=[], dataB=[], labels=[], labelA='Risk', labelB='MA7' }) {
  const W = 720, H = 280, pad = 30;
  const maxY = Math.max(1, ...dataA, ...dataB);
  const minY = Math.min(0, ...dataA, ...dataB);
  const x = i => pad + (i * (W - 2*pad) / Math.max(1, labels.length - 1));
  const y = v => H - pad - ((v - minY) / Math.max(1e-9, (maxY - minY))) * (H - 2*pad);
  const path = (arr) => arr.map((v,i)=> (i ? 'L' : 'M') + x(i) + ',' + y(v)).join(' ');
  const grid = Array.from({length:5}, (_,i)=>{
    const yy = pad + i*(H-2*pad)/4;
    return <line key={i} x1={pad} y1={yy} x2={W-pad} y2={yy} stroke="rgba(255,255,255,0.06)"/>
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`}>
      <rect x="0" y="0" width={W} height={H} fill="#0a0f14" rx="12" />
      {grid}
      <path d={path(dataA)} fill="none" stroke="#fbbf24" strokeWidth="2" />
      <path d={path(dataB)} fill="none" stroke="#34d399" strokeWidth="2" />
      <g className="legend" transform={`translate(${pad}, ${pad/2})`}>
        <rect width="12" height="12" fill="#fbbf24" rx="2" />
        <text x="18" y="11" fontSize="12" fill="#9fb0c7">{labelA}</text>
        <rect x="80" width="12" height="12" fill="#34d399" rx="2" />
        <text x="98" y="11" fontSize="12" fill="#9fb0c7">{labelB}</text>
      </g>
    </svg>
  )
}
