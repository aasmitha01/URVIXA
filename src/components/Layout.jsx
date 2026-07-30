import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FlaskConical, Satellite, ScanLine, Sprout, CloudSun, TrendingUp,
  Tractor, Users, PlayCircle, Bell, User, LogOut, Menu, X, Search, ChevronRight, Sun, Moon, Sparkles
} from 'lucide-react';
import { navigate } from '../lib/router.js';
import { useAuth } from '../lib/auth.jsx';
import { useTheme } from '../lib/theme.jsx';
import { NatureBackground } from './NatureBackground.jsx';
import { UrvixaVoiceAssistant } from './UrvixaVoiceAssistant.jsx';

const nav = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/soil', label: 'Soil Passport', icon: FlaskConical },
  { path: '/precision', label: 'Precision Farming', icon: Satellite, badge: 'AI Satellite' },
  { path: '/disease', label: 'Disease Analysis', icon: ScanLine },
  { path: '/crop', label: 'Crop Recommendation', icon: Sprout },
  { path: '/weather', label: 'Weather', icon: CloudSun },
  { path: '/market', label: 'Market Prices', icon: TrendingUp },
  { path: '/equipment', label: 'Equipment Rental', icon: Tractor },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/tutorials', label: 'Video Tutorials', icon: PlayCircle },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/profile', label: 'Profile', icon: User },
];

export function Layout({ current, children }) {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const go = (p) => {
    navigate(p);
    setOpen(false);
  };

  const isDark = theme === 'dark';
  const isYellow = theme === 'yellow';
  const themeLabel = isDark ? 'DARK' : isYellow ? 'RIPEN GOLD' : 'LIGHT GREEN';

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const searchResults = nav.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="relative min-h-screen text-[#020617] dark:text-[#FFFFFF] selection:bg-[#38BDF8]/30 selection:text-[#020617] overflow-x-hidden transition-colors duration-300 font-normal">
      <NatureBackground />

      <div className="relative z-10 flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform glass-sidebar backdrop-blur-2xl transition-transform duration-300 ease-out lg:translate-x-0 flex flex-col justify-between ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-300 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-[#15803D] via-[#2E8B57] to-[#86E39A] text-white shadow-lg shadow-[#15803D]/20 border-2 border-white/40">
                  <Sprout className="h-6 w-6 text-white" />
                </div>
                <div className="leading-tight">
                  <p className="text-xl font-bold tracking-tight text-[#020617] dark:text-white">Urvixa</p>
                  <p className="text-xs uppercase font-semibold tracking-widest text-[#15803D] dark:text-[#86E39A]">Agri AI Suite</p>
                </div>
              </div>

              <button onClick={() => setOpen(false)} className="text-[#1E293B] dark:text-[#E2E8F0] hover:text-[#020617] lg:hidden">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="mt-3 flex flex-col gap-1.5 px-4 py-2 overflow-y-auto flex-1 pb-6">
              {nav.map((n) => {
                const active = current === n.path;
                return (
                  <motion.button
                    key={n.path}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => go(n.path)}
                    className={`nav-item flex items-center justify-between py-3 ${
                      active ? 'active' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-gradient-to-tr from-[#15803D] to-[#0284C7] text-white shadow-xs' : 'bg-white dark:bg-white/10 text-[#15803D] dark:text-[#86E39A]'}`}>
                        <n.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-[#020617] dark:text-white">{n.label}</span>
                    </div>
                    {n.badge ? (
                      <span className="rounded-full bg-[#DFF8E7] dark:bg-[#15803D]/30 px-3 py-0.5 text-xs font-semibold text-[#15803D] dark:text-[#86E39A] border border-[#15803D]/40">
                        {n.badge}
                      </span>
                    ) : active ? (
                      <ChevronRight className="h-4.5 w-4.5 text-[#15803D] dark:text-[#86E39A]" />
                    ) : null}
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </aside>

        {open && (
          <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-xs lg:hidden" onClick={() => setOpen(false)} />
        )}

        <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
          <header className="sticky top-0 z-20 glass-header px-6 py-3">
            <div className="flex h-12 items-center gap-4">
              <button onClick={() => setOpen(true)} className="text-[#020617] dark:text-white lg:hidden">
                <Menu className="h-6 w-6" />
              </button>

              <div className="relative hidden max-w-md flex-1 sm:block">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#334155] dark:text-[#E2E8F0]" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearch(true);
                  }}
                  onFocus={() => setShowSearch(true)}
                  placeholder="Search Urvixa crops, soil health, AI diagnosis…"
                  className="input pl-11 pr-4 text-sm font-medium text-[#020617] dark:text-white"
                />

                {showSearch && searchQuery.trim() !== '' && (
                  <div className="absolute left-0 right-0 top-14 rounded-2xl glass-panel p-2 shadow-2xl z-50 border-2 border-slate-300 dark:border-slate-700 max-h-64 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((res) => (
                        <div
                          key={res.path}
                          onClick={() => {
                            go(res.path);
                            setShowSearch(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-[#E0F2FE] dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <res.icon className="h-5 w-5 text-[#15803D] dark:text-[#4ADE80]" />
                            <span className="text-sm font-semibold text-[#020617] dark:text-white">{res.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-xs font-medium text-slate-500">No matching section found</div>
                    )}
                  </div>
                )}
              </div>

              <div className="ml-auto flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={toggleTheme}
                  title={`Switch Theme (Current: ${themeLabel})`}
                  className="relative grid h-10 w-10 place-items-center rounded-2xl bg-white dark:bg-slate-800 text-[#020617] dark:text-white border-2 border-slate-300 dark:border-white/20 shadow-xs hover:bg-white"
                >
                  <AnimatePresence mode="wait">
                    {isDark ? (
                      <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                        <Sun className="h-5 w-5 text-[#FFBD2E]" />
                      </motion.div>
                    ) : isYellow ? (
                      <motion.div key="sparkles" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                        <Sparkles className="h-5 w-5 text-[#D97706]" />
                      </motion.div>
                    ) : (
                      <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                        <Moon className="h-5 w-5 text-[#15803D]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => go('/weather')}
                  className="hidden items-center gap-2 rounded-2xl bg-[#DFF8E7] dark:bg-[#15803D]/30 px-4 py-2 text-xs sm:text-sm font-semibold text-[#15803D] dark:text-[#86E39A] border border-[#15803D]/40 shadow-xs md:flex"
                >
                  <CloudSun className="h-4.5 w-4.5 text-[#15803D] dark:text-[#86E39A]" /> 29°C · Clear Sky
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => go('/notifications')}
                  className="relative grid h-10 w-10 place-items-center rounded-2xl bg-white dark:bg-slate-800 text-[#020617] dark:text-white border-2 border-slate-300 dark:border-white/20 shadow-xs"
                >
                  <Bell className="h-4.5 w-4.5 text-[#15803D] dark:text-[#86E39A]" />
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#15803D] ring-2 ring-white dark:ring-slate-900" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => go('/profile')}
                  className="flex items-center gap-2.5 rounded-2xl bg-white dark:bg-slate-800 p-1.5 pr-4 border-2 border-slate-300 dark:border-white/20 shadow-xs"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-[#15803D] to-[#0284C7] text-sm font-bold text-white shadow-xs">
                    {(profile?.full_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden text-sm font-semibold text-[#020617] dark:text-white sm:block">
                    {profile?.full_name?.split(' ')[0] || 'Farmer'}
                  </span>
                </motion.button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 12, scale: 0.99, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, scale: 0.99, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto max-w-7xl"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Floating AI Voice Assistant */}
      <UrvixaVoiceAssistant />
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#020617] dark:text-white">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm sm:text-base font-normal text-[#1E293B] dark:text-[#E2E8F0]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
