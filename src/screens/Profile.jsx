import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck, Phone, MapPin, Globe, Save, Sprout, ShieldCheck, CheckCircle2,
  Tractor, BadgeCheck, Compass, Home, PhoneCall, Building2, Layers, ChevronDown,
  GripVertical, ArrowUp, ArrowDown, ChevronUp, RefreshCw, Sparkles, LogOut
} from 'lucide-react';
import { PageHeader } from '../components/Layout.jsx';
import { useAuth } from '../lib/auth.jsx';
import { supabase } from '../lib/supabase.js';

export function Profile() {
  const { user, profile, refreshProfile, signOut } = useAuth();

  const [fullName, setFullName] = useState('');
  const [farmerId, setFarmerId] = useState('');
  const [farmerType, setFarmerType] = useState('');
  const [mobile, setMobile] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [language, setLanguage] = useState('English');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [landArea, setLandArea] = useState('');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Section Order & Collapse States for Floatable Sections
  const [sectionsOrder, setSectionsOrder] = useState(() => {
    const savedOrder = localStorage.getItem('urvixa_profile_sections_order');
    return savedOrder ? JSON.parse(savedOrder) : ['personal', 'contact', 'location'];
  });

  const [collapsedSections, setCollapsedSections] = useState({});

  useEffect(() => {
    setFullName(profile?.full_name || localStorage.getItem('user_full_name') || 'Ramesh Kumar');
    setFarmerId(profile?.farmer_id || localStorage.getItem('user_farmer_id') || 'URV-FARMER-9042');
    setFarmerType(profile?.farmer_type || localStorage.getItem('user_farmer_type') || 'Organic Cereal & Commercial Crop Specialist');
    setMobile(profile?.mobile || localStorage.getItem('user_mobile') || '+91 98765 43210');
    setEmergencyContact(profile?.emergency_contact || localStorage.getItem('user_emergency_contact') || '+91 1800 180 1551 (KVK)');
    setLanguage(profile?.language || localStorage.getItem('user_language') || 'English');
    setVillage(profile?.village || localStorage.getItem('user_village') || 'Chandapur');
    setDistrict(profile?.district || localStorage.getItem('user_district') || 'Medak');
    setStateRegion(profile?.state_region || localStorage.getItem('user_state_region') || 'Telangana (Deccan Zone)');
    setLandArea(profile?.land_area || localStorage.getItem('user_land_area') || '8.5 Acres');
  }, [profile]);

  const moveSection = (index, direction) => {
    const newOrder = [...sectionsOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setSectionsOrder(newOrder);
    localStorage.setItem('urvixa_profile_sections_order', JSON.stringify(newOrder));
  };

  const toggleCollapse = (id) => {
    setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetSectionOrder = () => {
    const defaultOrder = ['personal', 'contact', 'location'];
    setSectionsOrder(defaultOrder);
    localStorage.setItem('urvixa_profile_sections_order', JSON.stringify(defaultOrder));
  };

  const save = async () => {
    setSaving(true);
    const updatedProfileData = {
      id: user?.id || 'demo-farmer-id',
      full_name: fullName,
      farmer_id: farmerId,
      farmer_type: farmerType,
      mobile,
      emergency_contact: emergencyContact,
      language,
      village,
      district,
      state_region: stateRegion,
      land_area: landArea
    };

    try {
      if (user) {
        await supabase.from('profiles').upsert(updatedProfileData);
      }
    } catch {}

    localStorage.setItem('user_full_name', fullName);
    localStorage.setItem('user_farmer_id', farmerId);
    localStorage.setItem('user_farmer_type', farmerType);
    localStorage.setItem('user_mobile', mobile);
    localStorage.setItem('user_emergency_contact', emergencyContact);
    localStorage.setItem('user_language', language);
    localStorage.setItem('user_village', village);
    localStorage.setItem('user_district', district);
    localStorage.setItem('user_state_region', stateRegion);
    localStorage.setItem('user_land_area', landArea);

    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const renderSection = (id, index) => {
    const isFirst = index === 0;
    const isLast = index === sectionsOrder.length - 1;
    const isCollapsed = !!collapsedSections[id];

    switch (id) {
      case 'personal':
        return (
          <motion.div
            layout
            key="personal"
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="space-y-4 rounded-2xl p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 relative"
          >
            {/* Floatable Section Header */}
            <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#E0F2FE] dark:bg-[#0284C7]/20 text-[#0284C7] dark:text-[#7DD3FC]">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#020617] dark:text-white flex items-center gap-2">
                    Personal Information <Sprout className="h-4 w-4 text-[#15803D] opacity-70" />
                  </h4>
                  <p className="text-xs font-extrabold text-[#1E293B] dark:text-[#E2E8F0]">Grower identification & farming specialization</p>
                </div>
              </div>

              {/* Floatable / Re-order Controls */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs">
                <button
                  type="button"
                  onClick={() => moveSection(index, 'up')}
                  disabled={isFirst}
                  title="Move Section Up"
                  className={`p-1 rounded-lg transition ${isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-[#0284C7]'}`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(index, 'down')}
                  disabled={isLast}
                  title="Move Section Down"
                  className={`p-1 rounded-lg transition ${isLast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-[#0284C7]'}`}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5" />
                <button
                  type="button"
                  onClick={() => toggleCollapse(id)}
                  title={isCollapsed ? 'Expand Section' : 'Collapse Section'}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                >
                  {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </button>
                <span className="p-1 text-slate-400 cursor-grab active:cursor-grabbing" title="Floatable Section">
                  <GripVertical className="h-4 w-4" />
                </span>
              </div>
            </div>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 text-sm font-extrabold pt-1"
                >
                  <div>
                    <label className="mb-1.5 block text-[#020617] dark:text-white">Full Name</label>
                    <div className="relative">
                      <UserCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#0284C7] dark:text-[#7DD3FC]" />
                      <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input pl-11 font-extrabold" placeholder="Enter Full Name" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[#020617] dark:text-white">Agriculture ID / Registration</label>
                    <div className="relative">
                      <BadgeCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#0284C7] dark:text-[#7DD3FC]" />
                      <input value={farmerId} onChange={(e) => setFarmerId(e.target.value)} className="input pl-11 font-extrabold" placeholder="Enter Farmer ID" />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[#020617] dark:text-white">Farming Specialization</label>
                    <div className="relative">
                      <Tractor className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#0284C7] dark:text-[#7DD3FC]" />
                      <input value={farmerType} onChange={(e) => setFarmerType(e.target.value)} className="input pl-11 font-extrabold" placeholder="e.g. Organic Cereal & Cash Crop Specialist" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case 'contact':
        return (
          <motion.div
            layout
            key="contact"
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="space-y-4 rounded-2xl p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 relative"
          >
            {/* Floatable Section Header */}
            <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#DFF8E7] dark:bg-[#15803D]/20 text-[#15803D] dark:text-[#86E39A]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#020617] dark:text-white flex items-center gap-2">
                    Contact Information <Sprout className="h-4 w-4 text-[#15803D] opacity-70" />
                  </h4>
                  <p className="text-xs font-extrabold text-[#1E293B] dark:text-[#E2E8F0]">Mobile contact, helpline, and interface language</p>
                </div>
              </div>

              {/* Floatable / Re-order Controls */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs">
                <button
                  type="button"
                  onClick={() => moveSection(index, 'up')}
                  disabled={isFirst}
                  title="Move Section Up"
                  className={`p-1 rounded-lg transition ${isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-[#15803D]'}`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(index, 'down')}
                  disabled={isLast}
                  title="Move Section Down"
                  className={`p-1 rounded-lg transition ${isLast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-[#15803D]'}`}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5" />
                <button
                  type="button"
                  onClick={() => toggleCollapse(id)}
                  title={isCollapsed ? 'Expand Section' : 'Collapse Section'}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                >
                  {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </button>
                <span className="p-1 text-slate-400 cursor-grab active:cursor-grabbing" title="Floatable Section">
                  <GripVertical className="h-4 w-4" />
                </span>
              </div>
            </div>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 text-sm font-extrabold pt-1"
                >
                  <div>
                    <label className="mb-1.5 block text-[#020617] dark:text-white">Mobile Phone Number</label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#0284C7] dark:text-[#7DD3FC]" />
                      <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="input pl-11 font-extrabold" placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[#020617] dark:text-white">Emergency Krishi Helpline Contact</label>
                    <div className="relative">
                      <PhoneCall className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#0284C7] dark:text-[#7DD3FC]" />
                      <input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} className="input pl-11 font-extrabold" placeholder="Helpline Phone" />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[#020617] dark:text-white">Preferred Interface Language</label>
                    <div className="relative flex items-center">
                      <Globe className="pointer-events-none absolute left-3.5 z-10 h-4.5 w-4.5 text-[#0284C7] dark:text-[#7DD3FC]" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="input pl-11 pr-10 font-extrabold appearance-none cursor-pointer relative z-0"
                      >
                        <option value="English">English (Default)</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                        <option value="Telugu">Telugu (తెలుగు)</option>
                        <option value="Marathi">Marathi (मराठी)</option>
                        <option value="Tamil">Tamil (தமிழ்)</option>
                        <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 z-10 h-4 w-4 text-[#0284C7] dark:text-[#7DD3FC]" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case 'location':
        return (
          <motion.div
            layout
            key="location"
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="space-y-4 rounded-2xl p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 relative"
          >
            {/* Floatable Section Header */}
            <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FEF08A]/60 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#020617] dark:text-white flex items-center gap-2">
                    Location & Farm Details <Sprout className="h-4 w-4 text-[#15803D] opacity-70" />
                  </h4>
                  <p className="text-xs font-extrabold text-[#1E293B] dark:text-[#E2E8F0]">Gram Panchayat, district, state APMC zone & land acreage</p>
                </div>
              </div>

              {/* Floatable / Re-order Controls */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs">
                <button
                  type="button"
                  onClick={() => moveSection(index, 'up')}
                  disabled={isFirst}
                  title="Move Section Up"
                  className={`p-1 rounded-lg transition ${isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-amber-700'}`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(index, 'down')}
                  disabled={isLast}
                  title="Move Section Down"
                  className={`p-1 rounded-lg transition ${isLast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-amber-700'}`}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5" />
                <button
                  type="button"
                  onClick={() => toggleCollapse(id)}
                  title={isCollapsed ? 'Expand Section' : 'Collapse Section'}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                >
                  {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </button>
                <span className="p-1 text-slate-400 cursor-grab active:cursor-grabbing" title="Floatable Section">
                  <GripVertical className="h-4 w-4" />
                </span>
              </div>
            </div>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 text-sm font-extrabold pt-1"
                >
                  <div>
                    <label className="mb-1.5 block text-[#020617] dark:text-white">Village / Gram Panchayat</label>
                    <div className="relative">
                      <Home className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#0284C7] dark:text-[#7DD3FC]" />
                      <input value={village} onChange={(e) => setVillage(e.target.value)} className="input pl-11 font-extrabold" placeholder="Village Name" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[#020617] dark:text-white">District / APMC Mandi Region</label>
                    <div className="relative">
                      <Compass className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#0284C7] dark:text-[#7DD3FC]" />
                      <input value={district} onChange={(e) => setDistrict(e.target.value)} className="input pl-11 font-extrabold" placeholder="District Name" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[#020617] dark:text-white">State / Agricultural Agro-Zone</label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#0284C7] dark:text-[#7DD3FC]" />
                      <input value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} className="input pl-11 font-extrabold" placeholder="State / Agro-Zone" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[#020617] dark:text-white">Total Cultivated Farm Land</label>
                    <div className="relative">
                      <Layers className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#0284C7] dark:text-[#7DD3FC]" />
                      <input value={landArea} onChange={(e) => setLandArea(e.target.value)} className="input pl-11 font-extrabold" placeholder="e.g. 8.5 Acres" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 font-normal">
      <PageHeader
        title="Farmer Profile Settings"
        subtitle="Manage your agricultural credentials, land details, and regional preferences."
      />

      <div className="max-w-4xl space-y-6">
        
        {/* Dynamic Profile Header Card */}
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-5 dark:opacity-10 text-[#15803D]">
            <Tractor className="h-44 w-44" />
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            <div className="relative">
              <div className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-full bg-gradient-to-tr from-[#15803D] via-[#0284C7] to-[#86E39A] text-3xl font-extrabold text-white shadow-lg border-4 border-white/60">
                {(fullName || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-[#15803D] text-white shadow-md border-2 border-white" title="Verified Agriculture Specialist">
                <Sprout className="h-4 w-4" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="text-2xl font-extrabold text-[#020617] dark:text-white tracking-tight">{fullName || 'Farmer Profile'}</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DFF8E7] dark:bg-[#15803D]/30 px-3.5 py-1 text-xs font-extrabold text-[#15803D] dark:text-[#86E39A] border border-[#15803D]/30 w-fit mx-auto sm:mx-0">
                  <ShieldCheck className="h-4 w-4 text-[#15803D] dark:text-[#86E39A]" /> Verified Urvixa Grower
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-extrabold text-[#1E293B] dark:text-[#E2E8F0]">
                <span className="flex items-center gap-1 text-[#0284C7] dark:text-[#7DD3FC]">
                  <BadgeCheck className="h-3.5 w-3.5" /> ID: {farmerId || 'URV-FARMER-9042'}
                </span>
                <span>•</span>
                <span>{user?.email || 'farmer@urvixa.ai'}</span>
                <span>•</span>
                <span className="text-[#15803D] dark:text-[#86E39A] flex items-center gap-1">
                  <Tractor className="h-3.5 w-3.5" /> {landArea || 'Cultivated Land'}
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="rounded-xl bg-white/70 dark:bg-slate-800/70 px-3 py-1 text-[11px] font-extrabold text-[#020617] dark:text-white border border-slate-200 dark:border-slate-700">
                    Village: {village || 'Chandapur'}
                  </span>
                  <span className="rounded-xl bg-white/70 dark:bg-slate-800/70 px-3 py-1 text-[11px] font-extrabold text-[#020617] dark:text-white border border-slate-200 dark:border-slate-700">
                    APMC Zone: {district || 'Medak'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floatable Layout Action Ribbon */}
        <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-transparent border border-[#15803D]/30">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#020617] dark:text-white">
            <Sparkles className="h-4 w-4 text-[#15803D]" />
            <span>Floatable Sections Active — Drag & move sections in any order you prefer!</span>
          </div>
          <button
            type="button"
            onClick={resetSectionOrder}
            className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5 font-extrabold border-slate-300"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset Section Order
          </button>
        </div>

        {/* Floatable Profile Form Cards Container */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          {sectionsOrder.map((id, idx) => renderSection(id, idx))}

          {/* Action Save Button */}
          <div className="pt-4 border-t border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#15803D] dark:text-[#86E39A]">
              <ShieldCheck className="h-4 w-4" /> All floatable farm settings encrypted & synced with Urvixa AI Engine
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={signOut}
                className="px-6 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 dark:bg-rose-950/40 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer w-full sm:w-auto"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>Sign Out of Account</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={save}
                disabled={saving}
                className="btn-primary text-xs sm:text-sm font-extrabold shadow-md w-full sm:w-auto px-8 py-3.5 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><span className="h-4.5 w-4.5 animate-spin-slow rounded-full border-2 border-white/40 border-t-white" /> Saving Profile…</>
                ) : saved ? (
                  <><CheckCircle2 className="h-4.5 w-4.5 text-white" /> Profile Saved Successfully!</>
                ) : (
                  <><Sprout className="h-4.5 w-4.5" /> <Save className="h-4.5 w-4.5" /> Save Profile Changes</>
                )}
              </motion.button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
