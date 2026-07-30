import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Calculator,
  X,
  ShieldCheck,
  RefreshCw,
  Bell,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { PageHeader } from '../components/Layout.jsx';
import { Sparkline } from '../components/Charts.jsx';
import { marketPrices as initialPrices } from '../lib/data.js';

export function MarketPrices() {
  const [prices, setPrices] = useState(initialPrices);
  const [search, setSearch] = useState('');
  const [selectedMandi, setSelectedMandi] = useState('All APMC Mandis');
  const [activeCategory, setActiveCategory] = useState('All');
  const [trendFilter, setTrendFilter] = useState('All');

  // Live Refresh State
  const [lastUpdatedTime, setLastUpdatedTime] = useState(() => new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculator State
  const [selectedCalc, setSelectedCalc] = useState(null);
  const [quantity, setQuantity] = useState(10); // quintals
  const [transportCost, setTransportCost] = useState(500);

  // Price Alert Modal State
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertCommodity, setAlertCommodity] = useState(null);
  const [targetPrice, setTargetPrice] = useState(2500);
  const [alertPhone, setAlertPhone] = useState('+91 98450 12345');
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 'al1', commodity: 'Cotton (Kapas Long Staple)', targetPrice: 7500, phone: '+91 98450 12345' }
  ]);
  const [alertSuccess, setAlertSuccess] = useState(null);

  const mandis = [
    'All APMC Mandis',
    'Medak APMC Mandi',
    'Bowenpally APMC Hyderabad',
    'Warangal Grain Market',
    'Nizamabad APMC',
    'Guntur APMC Yard',
    'Tupran APMC Yard',
    'Khammam Market'
  ];

  const categories = ['All', 'Grains & Cereals', 'Commercial Crops', 'Vegetables & Spices', 'Pulses & Oilseeds'];

  // Real-time Live Price Refresh Simulation
  const refreshLivePrices = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPrices((prevPrices) =>
        prevPrices.map((item) => {
          const delta = Math.floor((Math.random() - 0.45) * 40);
          const newToday = Math.max(100, item.today + delta);
          return {
            ...item,
            yesterday: item.today,
            today: newToday,
            trend: [...item.trend.slice(1), newToday]
          };
        })
      );
      setLastUpdatedTime(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 800);
  };

  const filteredPrices = prices.filter((item) => {
    const matchesSearch =
      item.commodity.toLowerCase().includes(search.toLowerCase()) ||
      item.mandi.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesMandi = selectedMandi === 'All APMC Mandis' || item.mandi.toLowerCase().includes(selectedMandi.toLowerCase());
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const change = item.today - item.yesterday;
    const matchesTrend = trendFilter === 'All' || (trendFilter === 'Up' && change >= 0) || (trendFilter === 'Down' && change < 0);

    return matchesSearch && matchesMandi && matchesCat && matchesTrend;
  });

  const handleSetAlert = (item) => {
    setAlertCommodity(item);
    setTargetPrice(item.today + 100);
    setShowAlertModal(true);
  };

  const saveAlertSubscription = (e) => {
    e.preventDefault();
    if (!alertCommodity) return;

    const newAlert = {
      id: `al-${Date.now()}`,
      commodity: alertCommodity.commodity,
      targetPrice: parseFloat(targetPrice),
      phone: alertPhone
    };

    setActiveAlerts((prev) => [newAlert, ...prev]);
    setShowAlertModal(false);
    setAlertSuccess(`Live SMS/WhatsApp Price Alert set for ${alertCommodity.commodity} when rate reaches ₹${targetPrice}/Quintal!`);
  };

  return (
    <div className="space-y-8 font-sans antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Live APMC Mandi Market Prices"
          subtitle="Real-time Agmarknet mandi commodity rates, price trends, and instant harvest revenue calculator."
        />

        {/* Live Refresh & Location Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedMandi}
            onChange={(e) => setSelectedMandi(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
          >
            {mandis.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <button
            onClick={refreshLivePrices}
            disabled={isRefreshing}
            className="h-10 px-3.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Refresh Live APMC Market Feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Updating...' : 'Live Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Alert Confirmation Banner */}
      <AnimatePresence>
        {alertSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" />
              <span>{alertSuccess}</span>
            </div>
            <button onClick={() => setAlertSuccess(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Price Alerts Bar */}
      {activeAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
            <span className="flex items-center gap-1.5 text-[#15803D] dark:text-[#86E39A]">
              <Bell className="w-4 h-4 animate-bounce" /> Active Real-Time SMS/WhatsApp Price Triggers ({activeAlerts.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {activeAlerts.map((al) => (
              <span key={al.id} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>{al.commodity}: Target &gt; ₹{al.targetPrice}</span>
                <button
                  onClick={() => setActiveAlerts(activeAlerts.filter((a) => a.id !== al.id))}
                  className="text-slate-400 hover:text-rose-600 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Category Pills & Search Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#15803D] text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            {['All', 'Up', 'Down'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTrendFilter(tf)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  trendFilter === tf ? 'bg-[#15803D] text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {tf === 'Up' ? 'Price Up 📈' : tf === 'Down' ? 'Price Down 📉' : 'All Rates'}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full sm:w-auto">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commodity or mandi..."
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15803D]"
            />
          </div>
        </div>
      </div>

      {/* Main APMC Commodity Rates Table Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40 dark:bg-slate-900/40">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#15803D]" /> Real-Time Mandi Commodity Index
            </h3>
            <p className="text-xs text-slate-500">Live Agmarknet government APMC feeds • Last sync: {lastUpdatedTime}</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>● Real-time Live Market Feeds Active</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-left font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                <th className="px-6 py-3.5">Commodity</th>
                <th className="px-6 py-3.5">APMC Mandi</th>
                <th className="px-6 py-3.5">Modal Rate</th>
                <th className="px-6 py-3.5">Min - Max Rate</th>
                <th className="px-6 py-3.5">Daily Change</th>
                <th className="px-6 py-3.5">7-Day Trend</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredPrices.map((m) => {
                const change = m.today - m.yesterday;
                const pctChange = ((change / m.yesterday) * 100).toFixed(1);
                const up = change >= 0;

                return (
                  <tr key={m.id || m.commodity} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#15803D] dark:text-[#86E39A] font-bold text-xs flex items-center justify-center shrink-0">
                          {m.commodity.charAt(0)}
                        </div>
                        <div>
                          <p className="leading-snug">{m.commodity}</p>
                          <span className="text-[10px] font-normal text-slate-400">{m.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {m.mandi}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                      ₹{m.today.toLocaleString()} <span className="text-[11px] font-normal text-slate-400">/{m.unit}</span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      ₹{m.minPrice ? m.minPrice.toLocaleString() : m.today - 100} - ₹{m.maxPrice ? m.maxPrice.toLocaleString() : m.today + 120}
                    </td>

                    <td className={`px-6 py-4 font-bold ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      <span className="inline-flex items-center gap-1 text-xs">
                        {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {up ? '+' : ''}{change} ({up ? '+' : ''}{pctChange}%)
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <Sparkline data={m.trend} color={up ? '#15803D' : '#ef4444'} width={90} height={26} />
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCalc(m)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#15803D] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Calculator className="h-3.5 w-3.5" /> Estimate
                      </button>

                      <button
                        onClick={() => handleSetAlert(m)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer border border-amber-500/30"
                        title="Set SMS/WhatsApp Price Alert"
                      >
                        <Bell className="h-3.5 w-3.5" /> Alert
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Set Price Alert Modal */}
      <AnimatePresence>
        {showAlertModal && alertCommodity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Set Real-Time Price Alert
                    </h3>
                    <p className="text-xs text-slate-500">{alertCommodity.commodity}</p>
                  </div>
                </div>
                <button onClick={() => setShowAlertModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={saveAlertSubscription} className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                    Target Trigger Price (₹/Quintal)
                  </label>
                  <input
                    type="number"
                    required
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Current rate today: ₹{alertCommodity.today.toLocaleString()}</p>
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                    Mobile Phone for SMS & WhatsApp Alert
                  </label>
                  <input
                    required
                    value={alertPhone}
                    onChange={(e) => setAlertPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button type="submit" className="flex-1 h-10 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold cursor-pointer shadow-xs">
                    Save Live Alert
                  </button>
                  <button type="button" onClick={() => setShowAlertModal(false)} className="h-10 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Harvest Revenue Calculator Modal */}
      <AnimatePresence>
        {selectedCalc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#15803D] text-white flex items-center justify-center">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedCalc.commodity} Mandi Harvest Estimate
                    </h3>
                    <p className="text-xs text-slate-500">{selectedCalc.mandi}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCalc(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300 font-bold">
                    Harvest Yield Quantity ({selectedCalc.unit}s)
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, +e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300 font-bold">
                    Estimated Transport & Logistics Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={transportCost}
                    onChange={(e) => setTransportCost(Math.max(0, +e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold"
                  />
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 space-y-2 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Mandi Rate / {selectedCalc.unit}:</span>
                    <span>₹{selectedCalc.today.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Gross Harvest Income ({quantity} Qtl):</span>
                    <span>₹{(selectedCalc.today * quantity).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>APMC Cess Tax (1%):</span>
                    <span>-₹{Math.round(selectedCalc.today * quantity * 0.01).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Transport Cost:</span>
                    <span>-₹{transportCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-[#15803D] dark:text-[#86E39A] pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>Net Take-Home Earnings:</span>
                    <span>₹{Math.max(0, selectedCalc.today * quantity - Math.round(selectedCalc.today * quantity * 0.01) - transportCost).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedCalc(null)} className="w-full h-10 rounded-xl bg-[#15803D] text-white font-semibold text-xs cursor-pointer shadow-xs">
                Close Estimator
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
