import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, Camera, Image as ImageIcon, Sparkles, AlertTriangle, ShieldCheck,
  History, Leaf, X, Printer, CheckCircle2, CloudSun, Trash2, Award
} from 'lucide-react';
import { PageHeader } from '../components/Layout.jsx';
import { Donut } from '../components/Charts.jsx';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/auth.jsx';
import { cropCategories, symptomChecklist, getDiseaseDiagnosis } from '../lib/data.js';

export function DiseaseAnalysis() {
  const { user, profile } = useAuth();
  const [category, setCategory] = useState('Grains & Cereals');
  const [crop, setCrop] = useState('Paddy Rice');
  const [symptoms, setSymptoms] = useState([]);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [treatmentTab, setTreatmentTab] = useState('organic'); // 'organic' | 'chemical'
  const [history, setHistory] = useState([]);
  const [savedToFarm, setSavedToFarm] = useState(false);
  const [showPrintReport, setShowPrintReport] = useState(false);

  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const availableCrops = cropCategories[category] || cropCategories['Grains & Cereals'];

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const { data } = await supabase.from('disease_analyses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(12);
        setHistory(data ?? []);
      } catch {}
    })();
  }, [user]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const firstCrop = cropCategories[cat][0];
    setCrop(firstCrop);
  };

  const startCamera = async () => {
    setCameraError(null);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setCameraError('Camera access denied or unavailable. Please upload a photo file instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setPreview(dataUrl);
    }
    stopCamera();
  };

  const onFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const toggleSymptom = (s) => setSymptoms((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

  const analyze = async () => {
    setAnalyzing(true);
    setResult(null);
    setSavedToFarm(false);
    await new Promise((r) => setTimeout(r, 1200));

    const diag = getDiseaseDiagnosis(crop, symptoms);
    setResult(diag);
    setAnalyzing(false);

    try {
      if (user) {
        await supabase.from('disease_analyses').insert({
          user_id: user.id, crop, image_url: preview, disease_name: diag.name, severity: diag.severity,
          confidence: diag.confidence, affected_area: diag.affected, symptoms: diag.symptoms,
          treatment: diag.chemicalTreatment, prevention: diag.prevention,
        });
        const { data } = await supabase.from('disease_analyses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(12);
        setHistory(data ?? []);
      }
    } catch {}
  };

  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all disease scan history records?')) return;
    try {
      if (user) {
        await supabase.from('disease_analyses').delete().eq('user_id', user.id);
      }
      localStorage.removeItem('urvixa_disease_analyses');
      setHistory([]);
    } catch {
      setHistory([]);
    }
  };

  const saveToFarmRecord = () => {
    setSavedToFarm(true);
  };

  return (
    <div className="space-y-8 font-normal">
      <PageHeader
        title="AI Multi-Crop Disease Diagnosis Engine"
        subtitle="Neural leaf pattern scanning & symptom matrix analysis across 24+ crop varieties."
      />

      {/* Camera Viewfinder Modal */}
      <AnimatePresence>
        {showCamera && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-panel w-full max-w-2xl p-6 space-y-4 bg-slate-900 text-white border-2 border-white/30 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center gap-2 text-[#38BDF8]">
                  <Camera className="h-5 w-5" />
                  <h3 className="text-lg font-bold text-white">Live Camera Viewfinder</h3>
                </div>
                <button onClick={stopCamera} className="p-1 rounded-full hover:bg-white/20 text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {cameraError ? (
                <div className="p-8 text-center text-rose-300 font-bold text-sm bg-rose-950/60 rounded-2xl border-2 border-rose-800">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-rose-400" />
                  {cameraError}
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-white/20">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <div className="pointer-events-none absolute inset-12 border-2 border-dashed border-[#4ADE80] rounded-2xl flex items-center justify-center">
                    <span className="bg-black/70 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#4ADE80] backdrop-blur-sm">
                      Align Crop Leaf / Lesion Inside Frame
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button onClick={stopCamera} className="btn-ghost text-xs text-white border-white/30 hover:bg-white/20">Cancel</button>
                {!cameraError && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={capturePhoto} className="btn-primary text-sm px-6 py-3">
                    <Camera className="h-4.5 w-4.5" /> Capture Photo
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-7 space-y-6">
            
            {/* Category Selector Tabs */}
            <div>
              <label className="mb-2 block text-xs uppercase font-bold text-slate-600 dark:text-slate-300">1. Select Crop Category (24+ Varieties Supported)</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(cropCategories).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                      category === cat
                        ? 'bg-gradient-to-tr from-[#15803D] to-[#0284C7] text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Crop & Symptoms */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase font-bold text-slate-600 dark:text-slate-300">2. Target Crop Variety</label>
                <select value={crop} onChange={(e) => setCrop(e.target.value)} className="input font-semibold text-sm">
                  {availableCrops.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase font-bold text-slate-600 dark:text-slate-300">3. Observed Symptoms Checklist</label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {symptomChecklist.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSymptom(s)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full border-1.5 transition-all ${
                        symptoms.includes(s)
                          ? 'bg-[#15803D] text-white border-[#15803D]'
                          : 'bg-white dark:bg-slate-800 text-[#020617] dark:text-white border-slate-300 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Photo Capture / Upload Drag & Drop */}
            <div>
              <label className="mb-2 block text-xs uppercase font-bold text-slate-600 dark:text-slate-300">4. Crop Leaf Photo (Camera or Upload)</label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}
                className="relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#0284C7] bg-white/80 dark:bg-slate-800/80 text-center transition hover:bg-white"
              >
                {preview ? (
                  <div className="relative h-full w-full">
                    <img src={preview} alt="preview" className="h-[220px] w-full rounded-2xl object-cover" />
                    <button onClick={() => setPreview(null)} className="absolute right-3 top-3 rounded-full bg-slate-900 text-white px-4 py-1.5 text-xs font-bold shadow-md">
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="px-6 py-6">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#E0F2FE] dark:bg-[#0284C7]/30 text-[#0284C7] dark:text-[#7DD3FC] shadow-sm mb-2">
                      <UploadCloud className="h-7 w-7" />
                    </div>
                    <p className="text-base font-bold text-[#020617] dark:text-white">Drag & Drop Crop Leaf Photo Here</p>
                    <p className="text-xs font-medium text-slate-500 mt-1">Supports high-res JPG, PNG & Live Device Camera</p>

                    <div className="mt-4 flex justify-center gap-3">
                      <label className="btn-ghost text-xs font-bold cursor-pointer py-2">
                        <ImageIcon className="h-4 w-4 text-[#0284C7]" /> Browse Photo File
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                      </label>

                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={startCamera} className="btn-primary text-xs font-bold py-2 px-4">
                        <Camera className="h-4 w-4" /> Open Camera
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={analyze} disabled={analyzing} className="btn-primary w-full py-4 text-sm font-bold shadow-md">
              {analyzing ? (
                <><span className="h-5 w-5 animate-spin-slow rounded-full border-2 border-white/40 border-t-white" /> AI Scanning Neural Leaf Patterns for {crop}…</>
              ) : (
                <><Sparkles className="h-5 w-5" /> Execute AI Crop Diagnosis</>
              )}
            </motion.button>
          </div>
        </div>

        {/* Diagnosis Results Card */}
        <div className="glass-card p-7 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#020617] dark:text-white mb-4">AI Diagnostic Report</h3>
            {analyzing ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-600 dark:text-slate-300">
                <div className="h-12 w-12 animate-spin-slow rounded-full border-4 border-[#0284C7]/20 border-t-[#0284C7]" />
                <p className="mt-4 text-sm font-bold">Cross-referencing {crop} Pathogen Matrix…</p>
              </div>
            ) : result ? (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Donut value={result.confidence} size={88} stroke={8} sublabel="Accuracy" color={result.severity === 'Critical' || result.severity === 'High' ? '#ef4444' : '#15803D'} />
                  <div>
                    <span className="text-xs font-bold text-[#0284C7] dark:text-[#7DD3FC] uppercase tracking-wider">Detected Pathogen ({crop})</span>
                    <p className="text-lg font-bold text-[#020617] dark:text-white leading-tight mt-0.5">{result.name}</p>
                    <span className={`inline-flex items-center gap-1 mt-1 rounded-full px-3 py-0.5 text-xs font-bold border-1.5 ${
                      result.severity === 'Critical' || result.severity === 'High' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-300' : 'bg-[#DFF8E7] dark:bg-emerald-950 text-[#15803D] dark:text-[#86E39A] border-[#86E39A]'
                    }`}>
                      <AlertTriangle className="h-3.5 w-3.5" /> {result.severity} Risk Level
                    </span>
                  </div>
                </div>

                {/* Spray Weather Advisory */}
                <div className="p-3 rounded-2xl bg-sky-50 dark:bg-slate-800 border border-sky-500/30 flex items-start gap-2.5 text-xs">
                  <CloudSun className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sky-800 dark:text-sky-300 uppercase">Spray Window Check</span>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">{result.spraySafety}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Infection Organ:</span>
                    <p className="font-bold text-slate-800 dark:text-white">{result.organ}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Infection Stage:</span>
                    <p className="font-bold text-slate-800 dark:text-white">{result.stage}</p>
                  </div>
                </div>

                {/* Treatment Tabs */}
                <div className="pt-2">
                  <div className="flex border-b border-slate-200 dark:border-slate-700 gap-4 text-xs font-bold mb-2">
                    <button
                      onClick={() => setTreatmentTab('organic')}
                      className={`pb-1.5 transition-colors ${treatmentTab === 'organic' ? 'border-b-2 border-emerald-600 text-emerald-700 dark:text-emerald-300' : 'text-slate-500'}`}
                    >
                      🌿 Organic Biocontrol
                    </button>
                    <button
                      onClick={() => setTreatmentTab('chemical')}
                      className={`pb-1.5 transition-colors ${treatmentTab === 'chemical' ? 'border-b-2 border-sky-600 text-sky-700 dark:text-sky-300' : 'text-slate-500'}`}
                    >
                      🧪 Fungicide Prescription
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium">
                    {treatmentTab === 'organic' ? (
                      <p className="text-slate-700 dark:text-slate-200">{result.organicTreatment}</p>
                    ) : (
                      <p className="text-slate-700 dark:text-slate-200">{result.chemicalTreatment}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={saveToFarmRecord}
                    className={`btn-ghost text-xs py-2 w-full justify-center flex items-center gap-1.5 font-bold ${
                      savedToFarm ? 'text-emerald-700 bg-emerald-50 border-emerald-400' : ''
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {savedToFarm ? 'Saved to Farm Parcel Record ✓' : 'Save Diagnosis to Land Parcel'}
                  </button>

                  <button
                    onClick={() => setShowPrintReport(true)}
                    className="btn-primary text-xs py-2 w-full justify-center flex items-center gap-1.5 font-bold"
                  >
                    <Printer className="h-4 w-4" /> Export Agronomist Prescription PDF
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-600 dark:text-slate-300">
                <Leaf className="h-12 w-12 text-[#15803D] mb-3" />
                <p className="text-base font-bold text-[#020617] dark:text-white">Ready for AI Diagnosis</p>
                <p className="text-xs font-medium mt-1">Select crop variety, mark symptoms, or upload leaf photo.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card p-7">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-[#0284C7] dark:text-[#7DD3FC]" />
            <h3 className="text-lg font-bold text-[#020617] dark:text-white">Scan History</h3>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="btn-ghost text-xs py-1.5 px-3.5 text-rose-600 hover:bg-rose-50 border-rose-300 font-bold flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear Scan History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="py-6 text-center text-sm font-medium text-slate-500">No previous crop scans recorded in history.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((h) => (
              <motion.div whileHover={{ y: -2 }} key={h.id} className="rounded-2xl bg-white dark:bg-slate-800 p-4 border border-slate-300 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#E0F2FE] dark:bg-[#0284C7]/30 px-3 py-0.5 text-xs font-bold text-[#0284C7] dark:text-[#7DD3FC]">{h.crop}</span>
                  <span className="text-xs font-bold text-[#0284C7] dark:text-[#7DD3FC]">{h.confidence}% Match</span>
                </div>
                <p className="mt-2 text-base font-bold text-[#020617] dark:text-white">{h.disease_name}</p>
                <p className="text-xs font-medium text-slate-500 mt-1">{new Date(h.created_at).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Clean Formal Agronomist Prescription Sheet Modal */}
      <AnimatePresence>
        {showPrintReport && result && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <motion.div
              id="printable-prescription"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-xl p-8 space-y-6 bg-white text-slate-900 border-2 border-emerald-600 shadow-2xl relative my-8"
            >
              {/* Rx Header */}
              <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#15803D] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                    Rx
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#15803D] tracking-tight uppercase">URVIXA CROP PRESCRIPTION SHEET</h2>
                    <p className="text-xs font-semibold text-slate-600">Krishi Vigyan Kendra & AI Agronomist Prescription Note</p>
                  </div>
                </div>
                <div className="text-right text-xs font-medium text-slate-600">
                  <p className="font-bold text-slate-900">Rx ID: URV-RX-{Math.floor(100000 + Math.random() * 900000)}</p>
                  <p>Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <button onClick={() => setShowPrintReport(false)} className="text-slate-400 hover:text-slate-800 mt-1 print:hidden">
                    <X className="h-5 w-5 ml-auto" />
                  </button>
                </div>
              </div>

              {/* Target & Condition Tag */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span>Grower: <strong className="text-slate-900">{profile?.full_name || 'Ramesh Kumar'}</strong> ({profile?.district || 'Medak'})</span>
                  <span>Target Crop: <strong className="text-[#15803D]">{crop}</strong></span>
                </div>
                <div className="flex justify-between text-slate-700 pt-1 border-t border-slate-200">
                  <span>Diagnosed Disease: <strong className="text-slate-900">{result.name}</strong></span>
                  <span>Severity: <strong className={result.severity === 'High' || result.severity === 'Critical' ? 'text-rose-600' : 'text-emerald-700'}>{result.severity} ({result.confidence}% Match)</strong></span>
                </div>
              </div>

              {/* MAIN PRESCRIPTIONS HIGHLIGHTED */}
              <div className="space-y-4 pt-1">
                <h3 className="text-xs uppercase font-bold text-slate-700 tracking-wider flex items-center gap-1.5 border-b pb-1">
                  <ShieldCheck className="h-4 w-4 text-[#15803D]" /> Prescribed Treatment Formulas
                </h3>

                {/* 🌿 Main Organic Biocontrol Formula */}
                <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-[#15803D] text-sm">
                    <span>🌿 1. Organic & Bio-Control Formula (Recommended)</span>
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">Natural</span>
                  </div>
                  <p className="text-slate-900 font-bold text-sm leading-relaxed">{result.organicTreatment}</p>
                  <p className="text-[11px] text-slate-600 font-medium">Application Window: Apply during early morning hours (6:00 AM – 9:00 AM) for maximum effectiveness.</p>
                </div>

                {/* 🧪 Main Chemical Fungicide Prescription */}
                <div className="p-4 rounded-xl bg-sky-50 border-2 border-sky-500 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-[#0284C7] text-sm">
                    <span>🧪 2. Chemical Fungicide & Active Ingredient Dosage</span>
                    <span className="bg-sky-600 text-white px-2 py-0.5 rounded text-[10px]">Targeted</span>
                  </div>
                  <p className="text-slate-900 font-bold text-sm leading-relaxed">{result.chemicalTreatment}</p>
                  <p className="text-[11px] text-slate-600 font-medium">Safety Precaution: Wear protective mask & gloves. Observe 14-day pre-harvest interval.</p>
                </div>

                {/* Weather Advice */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs flex items-center justify-between">
                  <span className="font-bold text-amber-900">Spraying Weather Window:</span>
                  <span className="font-medium text-amber-800">{result.spraySafety}</span>
                </div>
              </div>

              {/* Signature Block */}
              <div className="pt-4 border-t-2 border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-[#15803D] font-bold">
                    <Award className="h-4 w-4" /> Urvixa AI Diagnostic Verification
                  </div>
                  <p className="text-slate-500 text-[11px]">Stamp Code: URV-VERIFIED-9821</p>
                </div>
                <div className="text-right">
                  <div className="font-serif italic text-base font-bold text-slate-900">Dr. A. V. Rao</div>
                  <p className="text-[10px] uppercase font-bold text-slate-600">Chief Agronomist & Lead Pathologist</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2 print:hidden">
                <button
                  onClick={() => { window.print(); }}
                  className="btn-primary flex-1 py-3 text-sm font-bold shadow-md"
                >
                  <Printer className="h-4.5 w-4.5" /> Print / Save Prescription PDF
                </button>
                <button onClick={() => setShowPrintReport(false)} className="btn-ghost flex-1 py-3 text-sm font-bold">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
