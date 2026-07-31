import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircle,
  PauseCircle,
  Eye,
  Search,
  X,
  CheckCircle,
  Volume2,
  VolumeX,
  Maximize,
  Tv,
  Sparkles,
  Clock,
  BookOpen,
  Play,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Video
} from 'lucide-react';
import { PageHeader } from '../components/Layout.jsx';
import { tutorials } from '../lib/data.js';

export function VideoTutorials() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  // Player State inside Modal
  const [playerMode, setPlayerMode] = useState('video'); // 'video' | 'youtube'
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(25);
  const videoRef = useRef(null);

  const categories = ['All', 'Soil & Fertilizer', 'Pest & Disease', 'Irrigation', 'Precision Tech'];

  const filtered = tutorials.filter((t) => {
    const matchesCat = activeTab === 'All' || t.category.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.instructor && t.instructor.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleOpenVideo = (video) => {
    setActiveVideo(video);
    setPlayerMode('video');
    setIsPlaying(true);
    setProgress(15);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-8 font-sans antialiased">
      <PageHeader
        title="Video Training Library"
        subtitle="100% playable video masterclasses on organic farming, disease control, fertigation & precision tech."
      />

      {/* Filter and Search Control Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === cat
                  ? 'bg-[#15803D] text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search masterclasses, topics..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15803D]"
          />
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t, idx) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Thumbnail Container & Play Overlay */}
              <div
                onClick={() => handleOpenVideo(t)}
                className="relative h-48 bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center"
              >
                <img
                  src={t.thumbnail}
                  alt={t.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Animated Play Button Overlay */}
                <div className="relative z-10 w-14 h-14 rounded-full bg-[#15803D] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <Play className="h-7 w-7 fill-white text-white ml-1" />
                </div>

                {/* Category & Duration Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold">
                    {t.category}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#86E39A]" /> {t.duration}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <h3
                  onClick={() => handleOpenVideo(t)}
                  className="text-base font-bold text-slate-900 dark:text-white leading-snug hover:text-[#15803D] dark:hover:text-[#86E39A] cursor-pointer transition-colors"
                >
                  {t.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.instructor || 'Urvixa Master Agronomist'}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-[#15803D] dark:text-[#86E39A]">
                    <Eye className="h-3.5 w-3.5" /> {t.views.toLocaleString()} views
                  </span>
                </div>

                {t.takeaways && t.takeaways.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#15803D]" /> Key Takeaway:
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {t.takeaways[0]}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => handleOpenVideo(t)}
                className="w-full py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Play className="w-4 h-4 fill-white" /> Watch Masterclass Video
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 100% Playable Multi-Source Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-4xl rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-2xl overflow-hidden space-y-0"
            >
              {/* Modal Header */}
              <div className="p-4 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#15803D] text-white flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white truncate max-w-md">{activeVideo.title}</h3>
                    <p className="text-xs text-slate-400">{activeVideo.category} • {activeVideo.instructor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Player Mode Switcher */}
                  <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                    <button
                      onClick={() => setPlayerMode('video')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        playerMode === 'video' ? 'bg-[#15803D] text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      HD Direct Stream
                    </button>
                    <button
                      onClick={() => setPlayerMode('youtube')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        playerMode === 'youtube' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      YouTube Mode
                    </button>
                  </div>

                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId || 'W98pXFwH760'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Open on YouTube website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setActiveVideo(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Video Player Display Container */}
              <div className="relative aspect-video w-full bg-black overflow-hidden group">
                {playerMode === 'video' ? (
                  <video
                    ref={videoRef}
                    controls
                    autoPlay
                    loop
                    playsInline
                    poster={activeVideo.thumbnail}
                    src={activeVideo.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-farmer-hands-checking-drip-irrigation-in-a-greenhouse-41551-large.mp4'}
                    onTimeUpdate={(e) => {
                      const cur = e.currentTarget.currentTime;
                      const dur = e.currentTarget.duration || 1;
                      setProgress(Math.round((cur / dur) * 100));
                    }}
                    className="w-full h-full object-cover"
                  >
                    <source src={activeVideo.videoUrl} type="video/mp4" />
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-farmer-hands-checking-drip-irrigation-in-a-greenhouse-41551-large.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId || 'W98pXFwH760'}?autoplay=1&rel=0`}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Video Takeaways & Agronomist Notes Footer */}
              <div className="p-6 bg-slate-900 space-y-4 max-h-56 overflow-y-auto border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#15803D]/20 text-[#86E39A] text-xs font-bold border border-[#15803D]/40">
                    Category: {activeVideo.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> Verified Urvixa Agronomist Training
                  </span>
                </div>

                {activeVideo.takeaways && activeVideo.takeaways.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-300">
                      Key Practical Takeaways & Application Notes:
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5">
                      {activeVideo.takeaways.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
