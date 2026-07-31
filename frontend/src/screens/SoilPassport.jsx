import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Plus, MapPin, Calendar, Award, Droplets, Sparkles, CheckCircle2, FileText, X } from 'lucide-react';
import { PageHeader } from '../components/Layout.jsx';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/auth.jsx';

const defaultParcels = [
  {
    id: 'f1',
    name: 'Green Meadows Parcel A',
    area_acres: 5.5,
    crop: 'Tomato',
    soil_type: 'Black Cotton Soil',
    stage: 'Vegetative',
    planting_date: '2026-06-15',
    ph: 6.8,
    nitrogen: 140,
    phosphorus: 42,
    potassium: 210,
    organic_carbon: 0.75
  },
  {
    id: 'f2',
    name: 'Sun Valley Field 2',
    area_acres: 8.0,
    crop: 'BT Cotton',
    soil_type: 'Loamy Soil',
    stage: 'Flowering',
    planting_date: '2026-05-20',
    ph: 7.2,
    nitrogen: 160,
    phosphorus: 50,
    potassium: 230,
    organic_carbon: 0.85
  }
];

export function SoilPassport() {
  const { user } = useAuth();
  const [farms, setFarms] = useState(defaultParcels);
  const [name, setName] = useState('');
  const [area, setArea] = useState(5);
  const [crop, setCrop] = useState('Tomato');
  const [soil, setSoil] = useState('Black Cotton Soil');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedPassport, setSelectedPassport] = useState(null);

  const load = async () => {
    if (!user) return;
    try {
      const { data } = await supabase.from('farms').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setFarms(data);
      }
    } catch {}
  };

  useEffect(() => { load(); }, [user]);

  const add = async () => {
    if (!name.trim()) return;
    const newParcel = {
      id: Date.now().toString(),
      name,
      area_acres: area,
      crop,
      soil_type: soil,
      stage: 'Vegetative',
      planting_date: new Date().toISOString().slice(0, 10),
      ph: 6.9,
      nitrogen: 150,
      phosphorus: 45,
      potassium: 220,
      organic_carbon: 0.8
    };

    setFarms([newParcel, ...farms]);
    setName('');
    setShowAdd(false);

    if (user) {
      try {
        await supabase.from('farms').insert({
          user_id: user.id, name, area_acres: area, crop, soil_type: soil, stage: 'Vegetative', planting_date: new Date().toISOString().slice(0, 10)
        });
      } catch {}
    }
  };

  return (
    <div className="space-y-8 font-normal">
      <PageHeader
        title="Soil Passport & Farm Parcels"
        subtitle="Verifiable land records, NPK nutrient balance & soil health scores."
        action={
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowAdd((s) => !s)}
            className="btn-primary text-xs sm:text-sm font-bold shadow-md"
          >
            <Plus className="h-4.5 w-4.5" /> Register New Farm Parcel
          </motion.button>
        }
      />

      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-7 space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-[#020617] dark:text-white">Register Land Parcel</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 text-xs sm:text-sm font-medium">
            <input placeholder="Parcel Name (e.g. Field 1)..." value={name} onChange={(e) => setName(e.target.value)} className="input" />
            <input type="number" placeholder="Acres" value={area} onChange={(e) => setArea(+e.target.value)} className="input" />
            <input placeholder="Crop (e.g. Cotton)" value={crop} onChange={(e) => setCrop(e.target.value)} className="input" />
            <input placeholder="Soil Type" value={soil} onChange={(e) => setSoil(e.target.value)} className="input" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={add} className="btn-primary text-xs sm:text-sm font-bold">Save Farm Record</button>
            <button onClick={() => setShowAdd(false)} className="btn-ghost text-xs sm:text-sm font-bold">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {farms.map((f, idx) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4 }}
            className="glass-card p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#E0F2FE] dark:bg-[#0284C7]/30 px-3.5 py-1 text-xs font-bold text-[#0284C7] dark:text-[#7DD3FC] border border-[#0284C7]/40">
                  Parcel #{idx + 1}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-[#15803D] dark:text-[#4ADE80]">
                  <CheckCircle2 className="h-4 w-4" /> Verifiable Passport
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#020617] dark:text-white mt-3">{f.name}</h3>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 border border-slate-300 dark:border-slate-700">
                  <p className="text-xs font-bold uppercase text-[#0284C7] dark:text-[#7DD3FC]">Area</p>
                  <p className="text-sm sm:text-base font-bold text-[#020617] dark:text-white">{f.area_acres} Acres</p>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 border border-slate-300 dark:border-slate-700">
                  <p className="text-xs font-bold uppercase text-[#0284C7] dark:text-[#7DD3FC]">Crop</p>
                  <p className="text-sm sm:text-base font-bold text-[#020617] dark:text-white">{f.crop || 'Tomato'}</p>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                <p><span className="font-bold text-[#0284C7] dark:text-[#7DD3FC]">Soil Type:</span> {f.soil_type || 'Black Cotton Soil'}</p>
                <p><span className="font-bold text-[#0284C7] dark:text-[#7DD3FC]">Growth Stage:</span> {f.stage || 'Vegetative'}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedPassport(f)}
              className="btn-ghost text-xs py-2.5 mt-5 w-full justify-center flex items-center gap-1.5 font-bold"
            >
              <FileText className="h-4 w-4 text-[#15803D]" /> View Soil Passport Certificate
            </button>
          </motion.div>
        ))}
      </div>

      {/* Soil Passport Modal Certificate */}
      <AnimatePresence>
        {selectedPassport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel w-full max-w-lg p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-3">
                  <FlaskConical className="h-6 w-6 text-[#15803D]" />
                  <div>
                    <h3 className="text-lg font-bold text-[#020617] dark:text-white">Soil Passport Record</h3>
                    <p className="text-xs font-medium text-slate-500">{selectedPassport.name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPassport(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">Soil pH Level:</span>
                  <p className="text-base font-bold text-emerald-600">{selectedPassport.ph || 6.8} (Optimal)</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">Organic Carbon:</span>
                  <p className="text-base font-bold text-sky-600">{selectedPassport.organic_carbon || 0.75}%</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">Nitrogen (N):</span>
                  <p className="text-base font-bold text-slate-800 dark:text-white">{selectedPassport.nitrogen || 140} kg/ha</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">Phosphorus & Potassium:</span>
                  <p className="text-base font-bold text-slate-800 dark:text-white">P: {selectedPassport.phosphorus || 42} / K: {selectedPassport.potassium || 210}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-500/30 text-xs sm:text-sm space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">Agronomist Fertilizer Dosage Recommendation:</span>
                <p className="text-slate-700 dark:text-slate-200 font-medium">Apply 25kg organic compost per acre with balanced NPK 19-19-19 prior to flowering stage.</p>
              </div>

              <button onClick={() => setSelectedPassport(null)} className="btn-primary w-full py-3 text-sm font-bold">
                Close Passport Certificate
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
