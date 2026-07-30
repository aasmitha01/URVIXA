import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Sparkles, Award, ChevronRight, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../components/Layout.jsx';
import { seasons, soilTypes, recommendCrops } from '../lib/data.js';

export function CropRecommendation() {
  const [season, setSeason] = useState('Kharif (Monsoon)');
  const [soil, setSoil] = useState('Black Cotton Soil');
  const [water, setWater] = useState('Medium Availability');
  const [area, setArea] = useState(5);
  const [climate, setClimate] = useState('Tropical Wet');
  const [irrigation, setIrrigation] = useState('Drip Irrigation');
  const [picks, setPicks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCropModal, setSelectedCropModal] = useState(null);

  const getRecs = () => {
    setLoading(true);
    setTimeout(() => {
      setPicks(recommendCrops({ season, soil, water, area, climate }));
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-8 font-normal">
      <PageHeader title="AI Crop Recommendation Engine" subtitle="Input your land & climate conditions to receive optimal crop selections." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card p-7 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#E0F2FE] dark:bg-[#0284C7]/30 text-[#0284C7] dark:text-[#7DD3FC]">
              <Sprout className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-[#020617] dark:text-white">Land Parameters</h3>
          </div>

          <div className="space-y-4 text-sm font-medium">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#020617] dark:text-white">Farming Season</label>
              <select value={season} onChange={(e) => setSeason(e.target.value)} className="input text-sm">
                {seasons.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#020617] dark:text-white">Soil Type</label>
              <select value={soil} onChange={(e) => setSoil(e.target.value)} className="input text-sm">
                {soilTypes.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#020617] dark:text-white">Irrigation Infrastructure</label>
              <select value={irrigation} onChange={(e) => setIrrigation(e.target.value)} className="input text-sm">
                <option value="Drip Irrigation">Drip Irrigation System</option>
                <option value="Borewell Water">Borewell Water Pump</option>
                <option value="Rainfed Only">Rainfed Only (Monsoon)</option>
                <option value="Canal Irrigation">Canal Irrigation</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#020617] dark:text-white">Land Area (Acres)</label>
              <input type="number" value={area} onChange={(e) => setArea(+e.target.value)} className="input text-sm" />
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={getRecs} disabled={loading} className="btn-primary w-full py-3.5 text-sm font-bold shadow-md mt-2">
            {loading ? 'Processing Neural Model…' : 'Generate AI Recommendations'}
          </motion.button>
        </div>

        <div className="lg:col-span-2 space-y-5">
          {loading ? (
            <div className="glass-card p-16 text-center space-y-3 text-[#1E293B] dark:text-[#E2E8F0]">
              <div className="h-10 w-10 animate-spin-slow rounded-full border-4 border-[#0284C7]/20 border-t-[#0284C7] mx-auto" />
              <p className="text-sm font-bold">Matching soil NPK, seasonal rainfall, and market demand...</p>
            </div>
          ) : picks ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#020617] dark:text-white">Top Recommended Crops for {area} Acres</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {picks.map((p, idx) => (
                  <motion.div key={p.crop} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#E0F2FE] dark:bg-[#0284C7]/30 px-3 py-0.5 text-xs font-bold text-[#0284C7] dark:text-[#7DD3FC]">#{idx + 1} Choice</span>
                        <span className="text-xs font-bold text-[#15803D] dark:text-[#4ADE80]">{p.confidence}% Match</span>
                      </div>
                      <h4 className="text-lg font-bold text-[#020617] dark:text-white mt-3">{p.crop}</h4>
                      <div className="mt-4 space-y-2 text-xs sm:text-sm">
                        <div className="rounded-2xl bg-white dark:bg-slate-800 p-2.5 border-1.5 border-slate-300 dark:border-slate-700">
                          <p className="text-xs text-[#0284C7] dark:text-[#7DD3FC] uppercase font-bold">Expected Yield</p>
                          <p className="text-sm font-bold text-[#020617] dark:text-white">{p.yield}</p>
                        </div>
                        <div className="rounded-2xl bg-white dark:bg-slate-800 p-2.5 border-1.5 border-slate-300 dark:border-slate-700">
                          <p className="text-xs text-[#0284C7] dark:text-[#7DD3FC] uppercase font-bold">Net Profit / Acre</p>
                          <p className="text-sm font-bold text-[#15803D] dark:text-[#4ADE80]">{p.profit}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCropModal(p)}
                      className="btn-ghost text-xs py-2 mt-4 w-full justify-center flex items-center gap-1 font-bold"
                    >
                      View Crop Plan <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-16 text-center space-y-3 text-[#1E293B] dark:text-[#E2E8F0]">
              <Award className="mx-auto h-12 w-12 text-[#0284C7]" />
              <p className="text-base font-bold text-[#020617] dark:text-white">Ready for AI Crop Matching</p>
              <p className="text-sm font-medium">Select your land parameters and click Generate Recommendations.</p>
            </div>
          )}
        </div>
      </div>

      {/* Crop Plan Modal */}
      <AnimatePresence>
        {selectedCropModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel w-full max-w-lg p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-3">
                  <Sprout className="h-6 w-6 text-[#15803D]" />
                  <h3 className="text-lg font-bold text-[#020617] dark:text-white">{selectedCropModal.crop} Cultivation Blueprint</h3>
                </div>
                <button onClick={() => setSelectedCropModal(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm font-medium">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-slate-800 border border-emerald-500/30">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">Fertilizer Schedule:</span>
                  <p className="text-slate-700 dark:text-slate-200 mt-1">NPK 19-19-19 basal dose + Organic Vermicompost at day 15 and day 45.</p>
                </div>

                <div className="p-3 rounded-xl bg-sky-50 dark:bg-slate-800 border border-sky-500/30">
                  <span className="font-bold text-sky-800 dark:text-sky-300">Irrigation Plan:</span>
                  <p className="text-slate-700 dark:text-slate-200 mt-1">Frequency: 2 hours every alternate day using {irrigation}.</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-500/30">
                  <span className="font-bold text-amber-800 dark:text-amber-300">Total Projected Return ({area} Acres):</span>
                  <p className="text-slate-700 dark:text-slate-200 font-bold text-base mt-1 text-emerald-700 dark:text-emerald-300">
                    Est. Yield: {(+selectedCropModal.yield.split(' ')[0] * area)} Quintals · Net Income: ₹{(parseInt(selectedCropModal.profit.replace(/[^0-9]/g, '')) * area).toLocaleString()}
                  </p>
                </div>
              </div>

              <button onClick={() => setSelectedCropModal(null)} className="btn-primary w-full py-3 text-sm font-bold">
                Close Plan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
