import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HeartPulse, CloudSun, Sprout, TrendingUp, Droplets, FlaskConical,
  ScanLine, Satellite, Tractor, Users, PlayCircle, ArrowUpRight, ArrowDownRight, Leaf, Sparkles, ShieldCheck
} from 'lucide-react';
import { PageHeader } from '../components/Layout.jsx';
import { LineChart, Donut, Bars, Sparkline } from '../components/Charts.jsx';
import { weatherNow, marketPrices } from '../lib/data.js';
import { navigate } from '../lib/router.js';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/auth.jsx';

const quick = [
  { path: '/soil', label: 'Soil Passport', icon: FlaskConical },
  { path: '/precision', label: 'Precision Farming', icon: Satellite },
  { path: '/disease', label: 'Disease Analysis', icon: ScanLine },
  { path: '/crop', label: 'Crop Recommendation', icon: Sprout },
  { path: '/equipment', label: 'Equipment Rental', icon: Tractor },
  { path: '/tutorials', label: 'Video Tutorials', icon: PlayCircle },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/weather', label: 'Weather', icon: CloudSun },
];

const alerts = [
  { title: 'Heavy rainfall expected Wed–Thu', time: '2h ago', badge: 'Weather Alert' },
  { title: 'Rice Blast risk elevated in your region', time: '5h ago', badge: 'AI Disease Warning' },
  { title: 'Cotton price dropped 1.4% today', time: '8h ago', badge: 'Market Update' },
];

export function Dashboard() {
  const { profile } = useAuth();
  const [farmCount, setFarmCount] = useState(1);
  const [healthScore, setHealthScore] = useState(86);

  useEffect(() => {
    (async () => {
      try {
        const { count } = await supabase.from('farms').select('*', { count: 'exact', head: true });
        if (count) {
          setFarmCount(count);
          setHealthScore(78 + Math.min(count * 4, 18));
        }
      } catch {}
    })();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome to Urvixa, ${profile?.full_name?.split(' ')[0] || 'Farmer'}`}
        subtitle="AI-driven agricultural intelligence & crop health monitoring."
        action={
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/disease')}
            className="btn-primary text-xs sm:text-sm font-semibold shadow-lg"
          >
            <ScanLine className="h-4.5 w-4.5" /> AI Crop Diagnosis
          </motion.button>
        }
      />

      {/* Motion Graphic Hero Banner Tile */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.005 }}
        className="relative overflow-hidden rounded-3xl border-2 border-slate-300 dark:border-white/20 shadow-xl min-h-[190px] flex items-center p-7 text-white"
      >
        <img
          src="/agri_motion_tile.jpg"
          alt="Agricultural Motion"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />

        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#15803D]/90 backdrop-blur px-3.5 py-1 text-xs font-extrabold text-[#86E39A] border border-[#86E39A]/40 shadow-xs">
            <Sprout className="h-4 w-4 animate-bounce" /> Live Smart Agri Surveillance
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">AI Harvest & Crop Yield Monitoring</h2>
          <p className="text-xs sm:text-sm text-slate-200 font-extrabold">
            Realtime satellite NDVI spectrum, soil moisture tracking, and instant disease diagnosis active.
          </p>
        </div>
      </motion.div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <GlassWidget icon={HeartPulse} label="Farm Health Index" value={`${healthScore}/100`} foot="+5 points this week">
          <Donut value={healthScore} size={92} stroke={9} />
        </GlassWidget>
        <GlassWidget icon={CloudSun} label="Today's Climate" value={`${weatherNow.temp}°C`} foot={weatherNow.condition}>
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#020617] dark:text-white">
            <span className="flex items-center gap-1 text-[#0284C7] dark:text-[#7DD3FC]"><Droplets className="h-4 w-4" />{weatherNow.humidity}%</span>
            <span>·</span>
            <span>{weatherNow.wind} km/h</span>
          </div>
        </GlassWidget>
        <GlassWidget icon={Sprout} label="Active Crops" value={farmCount ? 'Thriving' : 'No crops'} foot={`${farmCount} parcel tracked`}>
          <div className="flex items-end gap-1.5">
            {[45, 70, 55, 85, 65, 95, 80].map((h, i) => (
              <div key={i} className="w-2.5 rounded-full bg-[#15803D] dark:bg-[#4ADE80]" style={{ height: h * 0.45 }} />
            ))}
          </div>
        </GlassWidget>
        <GlassWidget icon={TrendingUp} label="Rice Market Rate" value="₹2,450/q" foot="Today · +2.9%">
          <Sparkline data={marketPrices[0].trend} width={100} height={32} color="#15803D" />
        </GlassWidget>
      </div>

      {/* Farm Yield Performance Chart Tile */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div whileHover={{ y: -3 }} className="glass-card p-7 lg:col-span-2 overflow-hidden">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#020617] dark:text-white">Farm Yield Performance</h3>
              <p className="text-xs sm:text-sm font-extrabold text-[#1E293B] dark:text-[#E2E8F0]">Actual yield vs target metrics over 7 weeks (quintals/acre)</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DFF8E7] dark:bg-emerald-950/60 px-3.5 py-1 text-xs font-extrabold text-[#15803D] dark:text-[#86E39A] border border-[#86E39A]/60">
              <Leaf className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80]" /> Optimal Growth
            </span>
          </div>
          <LineChart data={[64, 70, 68, 76, 75, 82, 88]} labels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']} height={230} />
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="glass-card p-7 flex flex-col justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#020617] dark:text-white">Urvixa Realtime Alerts</h3>
            <div className="mt-4 space-y-3">
              {alerts.map((a, idx) => (
                <div key={idx} className="rounded-2xl bg-white/90 dark:bg-slate-800/90 p-4 border-1.5 border-slate-300 dark:border-slate-700 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold text-[#0284C7] dark:text-[#7DD3FC] uppercase tracking-wider">{a.badge}</span>
                    <span className="text-xs font-extrabold text-[#1E293B] dark:text-[#E2E8F0]">{a.time}</span>
                  </div>
                  <p className="text-sm font-extrabold text-[#020617] dark:text-white">{a.title}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/notifications')} className="btn-ghost text-xs sm:text-sm font-extrabold mt-4 w-full justify-center">
            View All Notifications
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card p-7 lg:col-span-2">
          <h3 className="text-lg sm:text-xl font-extrabold text-[#020617] dark:text-white mb-4">Quick AI Services</h3>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {quick.map((q) => (
              <motion.button
                key={q.path}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(q.path)}
                className="flex flex-col items-center gap-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 p-4 border-1.5 border-slate-300 dark:border-slate-700 transition-all hover:bg-white"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#DFF8E7] dark:bg-[#15803D]/30 text-[#15803D] dark:text-[#86E39A] shadow-xs border border-[#15803D]/40">
                  <q.icon className="h-5 w-5" />
                </div>
                <span className="text-center text-xs sm:text-sm font-extrabold text-[#020617] dark:text-white">{q.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="glass-card p-7">
          <h3 className="text-lg sm:text-xl font-extrabold text-[#020617] dark:text-white">Soil Nutrient Balance</h3>
          <p className="text-xs sm:text-sm font-extrabold text-[#1E293B] dark:text-[#E2E8F0]">NPK levels across your parcels</p>
          <div className="mt-4">
            <Bars data={[{ label: 'N', value: 82 }, { label: 'P', value: 58 }, { label: 'K', value: 72 }, { label: 'OC', value: 45 }]} height={160} />
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-300 dark:border-white/15">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#020617] dark:text-white">Market Prices Today</h3>
            <p className="text-xs sm:text-sm font-extrabold text-[#1E293B] dark:text-[#E2E8F0]">Live agricultural mandi rates</p>
          </div>
          <button onClick={() => navigate('/market')} className="text-xs sm:text-sm font-extrabold text-[#15803D] dark:text-[#86E39A] hover:underline">
            View All Commodities &rarr;
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-300 dark:border-white/15 bg-white/40 dark:bg-slate-800/40 text-left font-extrabold text-[#020617] dark:text-white uppercase tracking-wider text-xs">
                <th className="px-6 py-3.5">Commodity</th>
                <th className="px-6 py-3.5">Today</th>
                <th className="px-6 py-3.5">Yesterday</th>
                <th className="px-6 py-3.5">Change</th>
                <th className="px-6 py-3.5">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 dark:divide-white/10 font-extrabold">
              {marketPrices.map((m) => {
                const change = m.today - m.yesterday;
                const up = change >= 0;
                return (
                  <tr key={m.commodity} className="hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-6 py-4 font-extrabold text-[#020617] dark:text-white">{m.commodity}</td>
                    <td className="px-6 py-4 text-[#020617] dark:text-white">₹{m.today.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[#1E293B] dark:text-[#E2E8F0]">₹{m.yesterday.toLocaleString()}</td>
                    <td className={`px-6 py-4 font-extrabold ${up ? 'text-[#15803D] dark:text-[#4ADE80]' : 'text-rose-600 dark:text-rose-400'}`}>
                      <span className="inline-flex items-center gap-1">
                        {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {up ? '+' : ''}{change}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Sparkline data={m.trend} color={up ? '#15803D' : '#ef4444'} width={84} height={24} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GlassWidget({ icon: Icon, label, value, foot, children }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="glass-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#DFF8E7] dark:bg-[#15803D]/30 text-[#15803D] dark:text-[#86E39A]">
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-xs sm:text-sm font-extrabold text-[#1E293B] dark:text-[#E2E8F0]">{label}</p>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#020617] dark:text-white">{value}</p>
        <p className="text-xs font-extrabold text-[#1E293B] dark:text-[#E2E8F0] mt-1">{foot}</p>
      </div>
      <div className="mt-4 flex items-end justify-end">{children}</div>
    </motion.div>
  );
}
