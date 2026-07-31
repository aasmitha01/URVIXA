import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudSun,
  Droplets,
  Sun,
  Wind,
  CloudRain,
  RefreshCw,
  MapPin,
  AlertTriangle,
  LocateFixed,
  Compass,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { PageHeader } from '../components/Layout.jsx';

const presetLocations = {
  'Medak, Telangana': { lat: 18.0449, lon: 78.2611, temp: 29, condition: 'Partly Cloudy', humidity: 74, wind: 14, rainfall: 2.4, uv: 6, advisory: 'Optimal window for pesticide spraying between 6:00 AM – 10:00 AM tomorrow.' },
  'Hyderabad, Telangana': { lat: 17.3850, lon: 78.4867, temp: 31, condition: 'Sunny Clear', humidity: 62, wind: 11, rainfall: 0.0, uv: 8, advisory: 'High UV index. Ensure regular drip irrigation to avoid leaf scorching.' },
  'Warangal, Telangana': { lat: 17.9784, lon: 79.5941, temp: 28, condition: 'Light Rain', humidity: 82, wind: 18, rainfall: 8.5, uv: 4, advisory: 'Postpone pesticide spraying today due to 80% rainfall likelihood.' },
  'Nizamabad, Telangana': { lat: 18.6725, lon: 78.0941, temp: 30, condition: 'Humid Haze', humidity: 70, wind: 12, rainfall: 1.2, uv: 7, advisory: 'Favorable conditions for paddy harvesting in late afternoon.' },
  'Guntur, Andhra Pradesh': { lat: 16.3067, lon: 80.4365, temp: 33, condition: 'Hot Sunny', humidity: 58, wind: 10, rainfall: 0.0, uv: 9, advisory: 'Chili crops require deep soil hydration today.' },
  'Bangalore, Karnataka': { lat: 12.9716, lon: 77.5946, temp: 25, condition: 'Pleasant Breeze', humidity: 65, wind: 16, rainfall: 0.5, uv: 5, advisory: 'Ideal weather for organic compost application.' }
};

export function Weather() {
  const [selectedLoc, setSelectedLoc] = useState('Medak, Telangana');
  const [currentWeather, setCurrentWeather] = useState(presetLocations['Medak, Telangana']);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [hourlyList, setHourlyList] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);

  // Generate dynamic hourly breakdown
  const generateHourly = (baseTemp, rainVal) => [
    { time: '6 AM', temp: `${Math.round(baseTemp - 4)}°C`, rain: `${Math.min(90, Math.round(rainVal * 10))}%` },
    { time: '9 AM', temp: `${Math.round(baseTemp - 2)}°C`, rain: `${Math.min(90, Math.round(rainVal * 8))}%` },
    { time: '12 PM', temp: `${Math.round(baseTemp + 3)}°C`, rain: `${Math.min(90, Math.round(rainVal * 12))}%` },
    { time: '3 PM', temp: `${Math.round(baseTemp + 1)}°C`, rain: `${Math.min(90, Math.round(rainVal * 9))}%` },
    { time: '6 PM', temp: `${Math.round(baseTemp - 2)}°C`, rain: `${Math.min(90, Math.round(rainVal * 5))}%` },
    { time: '9 PM', temp: `${Math.round(baseTemp - 5)}°C`, rain: '5%' },
  ];

  // Generate 7-day forecast relative to current temp
  const generateForecast = (baseTemp) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => {
      const offset = (i % 3) - 1;
      const hi = Math.round(baseTemp + offset + 2);
      const lo = Math.round(baseTemp + offset - 6);
      const rain = (i * 15) % 80;
      return { day, hi, lo, rain };
    });
  };

  useEffect(() => {
    setHourlyList(generateHourly(currentWeather.temp, currentWeather.rainfall));
    setDailyForecast(generateForecast(currentWeather.temp));
  }, [currentWeather]);

  // Real-time Geolocation Access Handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setCoords({ lat: latitude, lon: longitude });
        setIsGpsActive(true);

        try {
          // Reverse geocoding via OpenStreetMap Nominatim API
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          let detectedName = `GPS Location (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`;

          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const addr = geoData.address || {};
            const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || 'Your Farm Location';
            const state = addr.state || addr.country || '';
            detectedName = `${city}${state ? `, ${state}` : ''}`;
          }

          // Real-time Weather Data via Open-Meteo API
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m,rain&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
          );

          if (weatherRes.ok) {
            const weatherData = await weatherRes.json();
            const cw = weatherData.current_weather || {};
            const temp = Math.round(cw.temperature ?? 28);
            const wind = Math.round(cw.windspeed ?? 12);
            
            // Map WMO weather code to text condition
            const code = cw.weathercode ?? 0;
            let condition = 'Clear Sky';
            if (code >= 1 && code <= 3) condition = 'Partly Cloudy';
            else if (code >= 45 && code <= 48) condition = 'Foggy Haze';
            else if (code >= 51 && code <= 67) condition = 'Light Rain';
            else if (code >= 80 && code <= 99) condition = 'Heavy Thunderstorm';

            const humidity = weatherData.hourly?.relative_humidity_2m?.[0] ?? 68;
            const rainfall = weatherData.daily?.precipitation_sum?.[0] ?? 0.0;
            const uv = Math.min(10, Math.max(3, Math.round(temp / 3.5)));

            let advisory = 'Optimal weather conditions for normal agricultural operations.';
            if (rainfall > 3) {
              advisory = 'Rainfall expected. Postpone foliar pesticide sprays to prevent chemical wash-off.';
            } else if (temp > 32) {
              advisory = 'High temperature alert. Increase drip irrigation volume during early morning hours.';
            } else if (wind > 15) {
              advisory = 'High wind speeds detected. Avoid drone or manual spraying until winds drop below 12 km/h.';
            }

            const liveWeatherObj = {
              lat: latitude,
              lon: longitude,
              temp,
              condition,
              humidity,
              wind,
              rainfall,
              uv,
              advisory
            };

            setSelectedLoc(detectedName);
            setCurrentWeather(liveWeatherObj);
          } else {
            // Fallback if weather API takes time
            setSelectedLoc(detectedName);
          }
        } catch {
          // If network fetch fails, set fallback GPS coords display
          setSelectedLoc(`Live Location (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg('Location access denied. Please allow location permissions in your browser.');
        } else {
          setErrorMsg('Unable to retrieve real-time location coordinates.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handleSelectPreset = (locName) => {
    setSelectedLoc(locName);
    setIsGpsActive(false);
    setCoords(null);
    setErrorMsg(null);
    if (presetLocations[locName]) {
      setCurrentWeather(presetLocations[locName]);
    }
  };

  const refreshWeather = () => {
    setLoading(true);
    setTimeout(() => {
      if (isGpsActive && coords) {
        handleDetectLocation();
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-8 font-sans antialiased">
      <PageHeader
        title="Weather Intelligence & Real-Time GPS Surveillance"
        subtitle="Hyper-local climate monitoring, precision rainfall tracking, and agricultural spray advisories."
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Real-time Location Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDetectLocation}
              disabled={locating}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
                isGpsActive
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-[#15803D] hover:bg-[#166534] text-white'
              }`}
            >
              {locating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Acquiring Satellite GPS...</span>
                </>
              ) : (
                <>
                  <LocateFixed className="h-4.5 w-4.5 animate-pulse text-emerald-200" />
                  <span>Use My Real-time Location</span>
                </>
              )}
            </motion.button>

            {/* Location Preset Selector */}
            <select
              value={selectedLoc}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white max-w-xs focus:outline-none focus:ring-2 focus:ring-[#15803D]"
            >
              {isGpsActive && <option value={selectedLoc}>📍 {selectedLoc} (GPS)</option>}
              {Object.keys(presetLocations).map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Refresh Button */}
            <button
              onClick={refreshWeather}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              title="Refresh weather feed"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#15803D]' : ''}`} />
            </button>
          </div>
        }
      />

      {/* Geolocation Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="font-semibold underline ml-2 shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {/* Active GPS Indicator Badge */}
      {isGpsActive && coords && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-bold">Real-time GPS Active:</span>
            <span>
              {selectedLoc} (Lat: {coords.lat.toFixed(4)}°, Lon: {coords.lon.toFixed(4)}°)
            </span>
          </div>
          <span className="text-[11px] font-semibold bg-emerald-600 text-white px-2 py-0.5 rounded-md">Live Telemetry</span>
        </motion.div>
      )}

      {/* Spray & Agricultural Advisory Banner */}
      <div className="p-5 rounded-2xl border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 flex items-start gap-4 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
            Precision Spray & Field Advisory Window
          </span>
          <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 mt-0.5">
            {currentWeather.advisory}
          </p>
        </div>
      </div>

      {/* Main Climate Card */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200 dark:border-sky-800 shadow-2xs">
              <CloudSun className="h-10 w-10 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {currentWeather.temp}°C
              </p>
              <p className="text-sm font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                {currentWeather.condition}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                <MapPin className="h-4 w-4 text-[#15803D]" />
                <span>{selectedLoc}</span>
                {isGpsActive && <span className="text-emerald-600 font-semibold">• Live GPS Stream</span>}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs sm:text-sm">
            <Metric icon={Droplets} label="Humidity" value={`${currentWeather.humidity}%`} />
            <Metric icon={Wind} label="Wind Speed" value={`${currentWeather.wind} km/h`} />
            <Metric icon={CloudRain} label="Rainfall" value={`${currentWeather.rainfall} mm`} />
            <Metric icon={Sun} label="UV Index" value={`${currentWeather.uv}`} />
          </div>
        </div>

        {/* Hourly Breakdown */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-3">
            Today's Hourly Temperature & Rain Probability
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {hourlyList.map((h, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center border border-slate-200/80 dark:border-slate-800"
              >
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{h.time}</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white my-1">{h.temp}</p>
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">{h.rain}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7-Day Extended Forecast */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">7-Day Extended Weather Forecast</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-7">
          {dailyForecast.map((f) => (
            <div
              key={f.day}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center border border-slate-200/80 dark:border-slate-800 hover:border-sky-300 transition-colors"
            >
              <p className="text-xs font-bold text-slate-900 dark:text-white">{f.day}</p>
              <CloudSun className="h-6 w-6 text-sky-500 mx-auto my-2" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">{f.hi}°</p>
              <p className="text-xs text-slate-400">{f.lo}°</p>
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mt-1.5">{f.rain}% rain</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 mb-1">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] uppercase font-bold tracking-wider">{label}</span>
      </div>
      <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
