import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Satellite,
  Droplets,
  FlaskConical,
  CalendarDays,
  Sprout,
  TrendingUp,
  Sun,
  CloudRain,
  Navigation,
  Layers,
  MapPin,
  Maximize2,
  RefreshCw,
  Eye,
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import L from 'leaflet';
import { PageHeader } from '../components/Layout.jsx';
import { Donut } from '../components/Charts.jsx';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/auth.jsx';

const stages = ['Sowing', 'Germination', 'Vegetative', 'Flowering', 'Grain filling', 'Maturity'];

const FARMS_PRESETS = [
  {
    id: 'f1',
    name: 'Chandapur Farm Parcel A',
    area_acres: 5.5,
    crop: 'Tomato',
    stage: 'Vegetative',
    planting_date: '2026-06-15',
    lat: 18.0463,
    lng: 78.2611,
    ndvi: 0.82,
    moisture: 64,
    ph: 6.8,
    boundary: [
      [18.0475, 78.2600],
      [18.0478, 78.2625],
      [18.0452, 78.2628],
      [18.0449, 78.2602]
    ]
  },
  {
    id: 'f2',
    name: 'Ramayanpet Paddy Field B',
    area_acres: 8.2,
    crop: 'Paddy Rice',
    stage: 'Flowering',
    planting_date: '2026-05-20',
    lat: 18.0811,
    lng: 78.2944,
    ndvi: 0.89,
    moisture: 78,
    ph: 6.5,
    boundary: [
      [18.0825, 78.2930],
      [18.0830, 78.2960],
      [18.0795, 78.2965],
      [18.0790, 78.2935]
    ]
  },
  {
    id: 'f3',
    name: 'Medak Cotton Farm C',
    area_acres: 12.0,
    crop: 'Cotton',
    stage: 'Germination',
    planting_date: '2026-07-01',
    lat: 18.0322,
    lng: 78.2411,
    ndvi: 0.65,
    moisture: 58,
    ph: 7.2,
    boundary: [
      [18.0340, 78.2395],
      [18.0345, 78.2430],
      [18.0305, 78.2435],
      [18.0300, 78.2400]
    ]
  }
];

export function PrecisionFarming() {
  const { user } = useAuth();
  const [farms, setFarms] = useState(FARMS_PRESETS);
  const [activeFarmId, setActiveFarmId] = useState('f1');
  const [mapLayer, setMapLayer] = useState('satellite'); // 'satellite' | 'ndvi' | 'moisture'
  const [gpsActive, setGpsActive] = useState(false);
  const [userGps, setUserGps] = useState(null);
  const [satellitePassTime, setSatellitePassTime] = useState('Sentinel-2 • 14 mins ago');
  const [refreshingScan, setRefreshingScan] = useState(false);

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const polygonLayerRef = useRef(null);
  const tileLayerRef = useRef(null);

  const activeFarm = farms.find((f) => f.id === activeFarmId) || farms[0];
  const stageIndex = Math.max(0, stages.indexOf(activeFarm.stage || 'Vegetative'));
  const growthPct = Math.round(((stageIndex + 1) / stages.length) * 100);

  // Initialize Leaflet Real-time Satellite Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing map instance if present
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [activeFarm.lat, activeFarm.lng],
      zoom: 16,
      zoomControl: false
    });

    leafletMapRef.current = map;

    // Tile Layers
    const esriSatellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Esri Satellite • Sentinel-2 MultiSpectral AI',
        maxZoom: 19
      }
    );

    const osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });

    if (mapLayer === 'satellite') {
      esriSatellite.addTo(map);
      tileLayerRef.current = esriSatellite;
    } else {
      osmStandard.addTo(map);
      tileLayerRef.current = osmStandard;
    }

    // Render Farm Boundary Polygon
    if (activeFarm.boundary) {
      const boundaryPolygon = L.polygon(activeFarm.boundary, {
        color: mapLayer === 'ndvi' ? '#22c55e' : mapLayer === 'moisture' ? '#3b82f6' : '#10b981',
        weight: 3,
        fillColor: mapLayer === 'ndvi' ? '#22c55e' : mapLayer === 'moisture' ? '#3b82f6' : '#86efac',
        fillOpacity: 0.35
      }).addTo(map);

      boundaryPolygon.bindTooltip(
        `<b>${activeFarm.name}</b><br/>Crop: ${activeFarm.crop}<br/>Area: ${activeFarm.area_acres} Acres<br/>NDVI Index: ${activeFarm.ndvi}`,
        { permanent: true, direction: 'center', className: 'satellite-map-tooltip' }
      );

      polygonLayerRef.current = boundaryPolygon;
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [activeFarmId, mapLayer]);

  // Handle Geolocation Live GPS
  const handleLocateGPS = () => {
    setGpsActive(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserGps({ lat: latitude, lng: longitude });
          if (leafletMapRef.current) {
            leafletMapRef.current.setView([latitude, longitude], 17);
            L.marker([latitude, longitude])
              .addTo(leafletMapRef.current)
              .bindPopup('<b>📍 Your Live GPS Location</b><br/>Active Precision Field')
              .openPopup();
          }
        },
        () => {
          setGpsActive(false);
        }
      );
    }
  };

  // Refresh Satellite Scan Trigger
  const triggerFreshScan = () => {
    setRefreshingScan(true);
    setTimeout(() => {
      setSatellitePassTime(`Sentinel-2 • Just Updated (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
      setRefreshingScan(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 font-sans antialiased">
      <PageHeader
        title="Precision Farming & AI Satellite Monitoring"
        subtitle="Real-time multi-spectral satellite imagery, NDVI vegetation health indices, and GPS parcel analytics."
      />

      {/* Farm Selection Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {farms.map((f) => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={f.id}
              onClick={() => setActiveFarmId(f.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                activeFarmId === f.id
                  ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              {f.name}
            </motion.button>
          ))}
        </div>

        {/* Live Satellite Status Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>{satellitePassTime}</span>
          <button
            onClick={triggerFreshScan}
            disabled={refreshingScan}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title="Request Fresh Satellite Pass"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshingScan ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Real-time Satellite Map Section */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-0">
        {/* Satellite Map Toolbar */}
        <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#15803D] text-white flex items-center justify-center">
              <Satellite className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Real-Time Satellite Map View ({activeFarm.name})
              </h3>
              <p className="text-[11px] text-slate-400">Coordinates: {activeFarm.lat}° N, {activeFarm.lng}° E • Resolution: 10m Multi-spectral</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Map Mode Selector */}
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setMapLayer('satellite')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  mapLayer === 'satellite' ? 'bg-[#15803D] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Satellite RGB
              </button>
              <button
                onClick={() => setMapLayer('ndvi')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  mapLayer === 'ndvi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                NDVI Chlorophyll
              </button>
              <button
                onClick={() => setMapLayer('moisture')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  mapLayer === 'moisture' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Canopy Moisture
              </button>
            </div>

            {/* GPS Geolocation Button */}
            <button
              onClick={handleLocateGPS}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{gpsActive ? 'GPS Active' : 'Locate Field'}</span>
            </button>
          </div>
        </div>

        {/* Leaflet Map Viewer */}
        <div className="relative w-full h-[420px] bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Map Overlay Spectral Legend */}
          <div className="absolute bottom-4 left-4 z-20 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md text-white border border-slate-800 text-xs space-y-2">
            <span className="block font-bold text-[11px] text-slate-300">
              {mapLayer === 'ndvi' ? 'NDVI Crop Vigour Spectrum' : mapLayer === 'moisture' ? 'Canopy Moisture Layer' : 'Satellite Boundary Legend'}
            </span>
            <div className="flex items-center gap-3 text-[10px] font-semibold">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Healthy (0.8+)
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Moderate (0.5 - 0.7)
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span> Stress (&lt; 0.4)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parcel Analytics & Soil Health Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 lg:col-span-2 space-y-6 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#15803D] dark:text-[#86E39A] flex items-center justify-center">
              <Sprout className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Parcel Telemetry & Growth Timeline</h3>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            <Stat label="Active Crop" value={activeFarm.crop || 'Tomato'} />
            <Stat label="Parcel Area" value={`${activeFarm.area_acres} acres`} />
            <Stat label="Growth Phase" value={activeFarm.stage || 'Vegetative'} />
            <Stat label="Planted Date" value={activeFarm.planting_date ? new Date(activeFarm.planting_date).toLocaleDateString() : 'Jun 15, 2026'} />
          </div>

          {/* Growth Timeline Progress */}
          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-900 dark:text-white">Phenological Growth Timeline</span>
              <span className="text-[#15803D] dark:text-[#86E39A]">{growthPct}% Completed</span>
            </div>
            <div className="relative h-3.5 rounded-full bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${growthPct}%` }}
                transition={{ duration: 1 }}
                className="h-full rounded-full bg-gradient-to-r from-[#15803D] to-[#0284C7]"
              />
            </div>
            <div className="mt-2.5 flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              {stages.map((s, i) => (
                <span key={s} className={i <= stageIndex ? 'text-[#15803D] dark:text-[#86E39A] font-bold' : ''}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Soil Health Score Donut Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Soil & Canopy Health Index</h3>
            <div className="mt-4 flex items-center justify-center">
              <Donut value={Math.round(activeFarm.ndvi * 100)} size={110} sublabel="NDVI Index" color="#15803D" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 text-center border border-slate-200 dark:border-slate-700">
              <p className="text-[11px] font-bold uppercase text-[#0284C7] dark:text-[#7DD3FC]">Soil Moisture</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">{activeFarm.moisture}%</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 text-center border border-slate-200 dark:border-slate-700">
              <p className="text-[11px] font-bold uppercase text-[#0284C7] dark:text-[#7DD3FC]">Soil pH</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">{activeFarm.ph}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-800">
      <p className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
