import React from 'react';

export function LineChart({ data = [64, 70, 68, 76, 75, 82, 88], labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'], height = 220 }) {
  const minVal = 40;
  const maxVal = 100;
  const range = maxVal - minVal;

  const width = 560;
  const chartHeight = 150;
  const paddingX = 40;
  const paddingTop = 20;

  // Calculate pixel coordinates inside SVG bounds
  const points = data.map((v, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
    const y = paddingTop + chartHeight - ((v - minVal) / range) * chartHeight;
    return { x, y, value: v };
  });

  const pathD = points.reduce((acc, curr, i) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (curr.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (curr.x - prev.x) / 2;
    const cy2 = curr.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  return (
    <div className="w-full flex flex-col justify-between overflow-hidden rounded-2xl bg-white/50 dark:bg-slate-900/50 p-4 border border-slate-300 dark:border-white/10 shadow-xs" style={{ height }}>
      <div className="relative flex-1 w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${chartHeight + paddingTop + 20}`} preserveAspectRatio="none" className="w-full h-full overflow-hidden">
          <defs>
            <linearGradient id="yieldAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#15803D" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingTop + chartHeight * (1 - pct);
            return (
              <g key={idx}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="currentColor" strokeOpacity="0.15" strokeDasharray="4 4" className="text-slate-500 dark:text-slate-400" />
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#yieldAreaGrad)" />

          {/* Smooth Line Path */}
          <path d={pathD} fill="none" stroke="#0284C7" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Nodes */}
          {points.map((pt, i) => (
            <g key={i} className="group cursor-pointer">
              <circle cx={pt.x} cy={pt.y} r="8" fill="#15803D" stroke="#FFFFFF" strokeWidth="3" className="transition-transform group-hover:scale-125" />
              <text x={pt.x} y={pt.y - 12} textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="800" className="text-[#020617] dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {pt.value} q
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex justify-between px-6 pt-2 text-xs font-extrabold text-[#020617] dark:text-white border-t border-slate-300 dark:border-white/10">
        {labels.map((l, i) => (
          <span key={i} className="text-center">{l}</span>
        ))}
      </div>
    </div>
  );
}

export function Donut({ value, size = 96, stroke = 9, sublabel, color = '#15803D' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="h-full w-full -rotate-90 transform">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeWidth={stroke} fill="transparent" className="text-slate-300 dark:text-slate-700" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="transparent" strokeDasharray={`${dash} ${c}`} strokeLinecap="round" />
      </svg>
      <div className="absolute text-center">
        <p className="text-base font-extrabold text-[#020617] dark:text-white">{value}%</p>
        {sublabel && <p className="text-[10px] font-extrabold uppercase text-[#0284C7] dark:text-[#7DD3FC]">{sublabel}</p>}
      </div>
    </div>
  );
}

export function Bars({ data, height = 150 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-2.5 pt-4" style={{ height }}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
            <div className="w-full rounded-t-xl bg-gradient-to-t from-[#15803D] to-[#0284C7] transition-all" style={{ height: `${pct}%` }} />
            <span className="text-xs font-extrabold text-[#020617] dark:text-white">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Sparkline({ data, color = '#15803D', width = 90, height = 28 }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2.5" points={pts} strokeLinecap="round" />
    </svg>
  );
}
