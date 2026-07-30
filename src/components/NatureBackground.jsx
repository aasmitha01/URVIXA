import React from 'react';
import { useTheme } from '../lib/theme.jsx';

export function NatureBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isYellow = theme === 'yellow';

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-[#090D16]' : isYellow ? 'bg-[#FEFCE8]' : 'bg-[#F0FDF4]'
      }`}
    >
      <div
        className="orb-1 absolute -top-40 -left-40 w-[680px] h-[680px] rounded-full opacity-40 filter blur-[90px]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(92, 203, 120, 0.25) 0%, rgba(46, 139, 87, 0.1) 60%, transparent 100%)'
            : isYellow
            ? 'radial-gradient(circle, rgba(250, 204, 21, 0.4) 0%, rgba(217, 119, 6, 0.2) 60%, transparent 100%)'
            : 'radial-gradient(circle, rgba(134, 227, 154, 0.6) 0%, rgba(223, 248, 231, 0.3) 60%, transparent 100%)'
        }}
      />

      <div
        className="orb-2 absolute top-1/4 -right-40 w-[720px] h-[720px] rounded-full opacity-40 filter blur-[90px]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(2, 132, 199, 0.12) 65%, transparent 100%)'
            : isYellow
            ? 'radial-gradient(circle, rgba(254, 240, 138, 0.6) 0%, rgba(245, 158, 11, 0.2) 65%, transparent 100%)'
            : 'radial-gradient(circle, rgba(125, 211, 252, 0.6) 0%, rgba(224, 242, 254, 0.4) 65%, transparent 100%)'
        }}
      />

      <div
        className="orb-3 absolute -bottom-40 left-1/3 w-[620px] h-[620px] rounded-full opacity-30 filter blur-[80px]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(92, 203, 120, 0.2) 0%, rgba(56, 189, 248, 0.18) 60%, transparent 100%)'
            : isYellow
            ? 'radial-gradient(circle, rgba(234, 179, 8, 0.35) 0%, rgba(132, 204, 22, 0.2) 60%, transparent 100%)'
            : 'radial-gradient(circle, rgba(92, 203, 120, 0.4) 0%, rgba(56, 189, 248, 0.3) 60%, transparent 100%)'
        }}
      />

      <div className={`absolute inset-0 transition-opacity duration-500 ${
        isDark ? 'bg-gradient-to-b from-black/40 via-transparent to-black/60 opacity-90' : 'bg-gradient-to-b from-black/[0.01] via-transparent to-black/[0.02] opacity-80'
      }`} />
    </div>
  );
}
