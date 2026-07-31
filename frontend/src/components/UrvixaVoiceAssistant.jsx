import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Bot,
  Send,
  Globe,
  Sprout,
  Compass,
  Zap,
  TrendingUp,
  CloudSun,
  Tractor,
  ScanLine,
  Radio,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { navigate } from '../lib/router.js';

const AVAILABLE_LANGUAGES = [
  { code: 'en-IN', name: 'English', flag: '🇬🇧', label: 'English' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳', label: 'हिंदी (Hindi)' },
  { code: 'te-IN', name: 'Telugu', flag: '🇮🇳', label: 'తెలుగు (Telugu)' },
  { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳', label: 'தமிழ் (Tamil)' },
  { code: 'kn-IN', name: 'Kannada', flag: '🇮🇳', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳', label: 'मराठी (Marathi)' },
  { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳', label: 'ગુજરાતી (Gujarati)' },
  { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳', label: 'বাংলা (Bengali)' }
];

// Advanced Language Detector based on Unicode Scripts & Agricultural Lexicon
function detectLanguageAdvanced(text) {
  if (!text) return AVAILABLE_LANGUAGES[0];

  // Telugu range: \u0C00-\u0C7F
  if (/[\u0C00-\u0C7F]/.test(text) || /\b(నమస్కారం|వాతావరణం|ధర|పంట|ట్రాక్టర్|మందు|నేల|ఎలా|ఉంది|పత్తి|బియ్యం)\b/i.test(text)) {
    return AVAILABLE_LANGUAGES.find((l) => l.code === 'te-IN') || AVAILABLE_LANGUAGES[2];
  }
  // Devanagari range (Hindi/Marathi): \u0900-\u097F
  if (/[\u0900-\u097F]/.test(text) || /\b(नमस्ते|मौसम|भाव|फसल|ट्रैक्टर|खाद|बीमारी|कैसा|पानी|कपास)\b/i.test(text)) {
    return AVAILABLE_LANGUAGES.find((l) => l.code === 'hi-IN') || AVAILABLE_LANGUAGES[1];
  }
  // Tamil range: \u0B80-\u0BFF
  if (/[\u0B80-\u0BFF]/.test(text) || /\b(வணக்கம்|வானிலை|விலை|பயிர்|டிராக்டர்)\b/i.test(text)) {
    return AVAILABLE_LANGUAGES.find((l) => l.code === 'ta-IN') || AVAILABLE_LANGUAGES[3];
  }
  // Kannada range: \u0C80-\u0CFF
  if (/[\u0C80-\u0CFF]/.test(text) || /\b(ನಮಸ್ಕಾರ|ಹವಾಮಾನ|ಬೆಲೆ|ಬೆಳೆ|ಟ್ರಾಕ್ಟರ್)\b/i.test(text)) {
    return AVAILABLE_LANGUAGES.find((l) => l.code === 'kn-IN') || AVAILABLE_LANGUAGES[4];
  }
  // Gujarati range: \u0A80-\u0AFF
  if (/[\u0A80-\u0AFF]/.test(text)) {
    return AVAILABLE_LANGUAGES.find((l) => l.code === 'gu-IN') || AVAILABLE_LANGUAGES[6];
  }
  // Bengali range: \u0980-\u09FF
  if (/[\u0980-\u09FF]/.test(text)) {
    return AVAILABLE_LANGUAGES.find((l) => l.code === 'bn-IN') || AVAILABLE_LANGUAGES[7];
  }

  return AVAILABLE_LANGUAGES[0];
}

export function UrvixaVoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLang, setSelectedLang] = useState(AVAILABLE_LANGUAGES[0]);
  const [detectedLang, setDetectedLang] = useState(AVAILABLE_LANGUAGES[0]);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [textInput, setTextInput] = useState('');

  // Visible Real-time Action Pipeline States
  // 'idle' | 'listening' | 'detecting' | 'processing' | 'executing' | 'speaking'
  const [actionState, setActionState] = useState({
    status: 'idle',
    label: 'Ready for Voice Commands',
    detail: 'Tap mic or say "Hey Urvixa"',
    icon: Bot
  });

  const [chatLog, setChatLog] = useState([
    {
      sender: 'urvixa',
      text: 'Namaste! I am Urvixa AI Voice Assistant. Speak or type in English, Hindi, Telugu, Tamil, Marathi, or Gujarati. I will auto-detect your language and talk back to you!',
      lang: 'English'
    }
  ]);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isOpen]);

  // Multilingual Speech Vocalizer (Talk-Back in Detected Language)
  const speakResponse = (text, langCode) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode || detectedLang.code || selectedLang.code;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setActionState({
        status: 'speaking',
        label: `Speaking Back in ${detectedLang.name} (${detectedLang.flag})`,
        detail: text,
        icon: Volume2
      });
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setActionState({
        status: 'idle',
        label: 'Action Completed',
        detail: 'Ready for next voice command',
        icon: CheckCircle2
      });
    };

    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Start Voice Recognition Engine
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser mode. Please type your query in the input box below!');
      return;
    }

    try {
      if (recognitionRef.current) recognitionRef.current.stop();

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = selectedLang.code;

      rec.onstart = () => {
        setIsListening(true);
        setLiveTranscript('Listening... Speak now...');
        setActionState({
          status: 'listening',
          label: `Capturing Audio Waveform (${selectedLang.name})`,
          detail: 'Listening to your voice input...',
          icon: Mic
        });
      };

      rec.onresult = (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setLiveTranscript(text);

        // Auto Detect Spoken Language Live
        const lang = detectLanguageAdvanced(text);
        setDetectedLang(lang);

        setActionState({
          status: 'detecting',
          label: `Auto-Detected Language: ${lang.name} ${lang.flag}`,
          detail: `Transcript: "${text}"`,
          icon: Globe
        });
      };

      rec.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
    if (liveTranscript && liveTranscript !== 'Listening... Speak now...') {
      handleUserQuery(liveTranscript);
    }
  };

  // Advanced Voice Intelligence Processing & Talk-Back Model
  const handleUserQuery = (queryText) => {
    if (!queryText || !queryText.trim() || queryText === 'Listening... Speak now...') return;

    const userText = queryText.trim();
    const lang = detectLanguageAdvanced(userText);
    setDetectedLang(lang);
    setSelectedLang(lang);

    setIsOpen(true);
    setChatLog((prev) => [...prev, { sender: 'user', text: userText, lang: lang.name }]);
    setLiveTranscript('');
    setTextInput('');

    // Step 1: Processing Visual State
    setActionState({
      status: 'processing',
      label: `Processing AI Intent in ${lang.name} ${lang.flag}`,
      detail: `Query: "${userText}"`,
      icon: Sparkles
    });

    setTimeout(() => {
      let responseText = '';
      let targetPath = null;
      let actionTitle = '';
      const lower = userText.toLowerCase();

      // WEATHER INTENT
      if (lower.includes('weather') || lower.includes('rain') || lower.includes('temperature') || lower.includes('मौसम') || lower.includes('వాతావరణం') || lower.includes('வானிலை')) {
        targetPath = '/weather';
        actionTitle = 'Navigating to Weather Intelligence (/weather)';
        if (lang.code === 'te-IN') {
          responseText = 'మేదక్ లో నేడు ఉష్ణోగ్రత 29°C, స్పష్టమైన ఆకాశం ఉంది. వర్షపాతం సూచన 15%. వాతావరణ స్క్రీన్ తెరుస్తున్నాను.';
        } else if (lang.code === 'hi-IN') {
          responseText = 'आज मेदक में तापमान 29°C है और आसमान साफ रहेगा। बारिश की संभावना 15% है। वेदर स्क्रीन खोल रही हूँ।';
        } else if (lang.code === 'ta-IN') {
          responseText = 'இன்று மேதக்கில் வெப்பநிலை 29°C ஆகும். வானிலை பக்கத்தை திறக்கிறேன்.';
        } else if (lang.code === 'kn-IN') {
          responseText = 'ಇಂದು ಮೇದಕ್‌ನಲ್ಲಿ ತಾಪಮಾನ 29°C ಆಗಿದೆ. ಹವಾಮಾನ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.';
        } else if (lang.code === 'mr-IN') {
          responseText = 'आज मेदक मध्ये तापमान 29°C आहे. हवामान स्क्रीन उघडत आहे.';
        } else {
          responseText = 'Today in Medak, current temperature is 29°C with clear skies and 15% precipitation. Opening Weather Forecast.';
        }
      }
      // MARKET Mandi PRICES INTENT
      else if (lower.includes('market') || lower.includes('price') || lower.includes('mandi') || lower.includes('cotton') || lower.includes('rice') || lower.includes('भाव') || lower.includes('कपास') || lower.includes('ధర') || lower.includes('పత్తి') || lower.includes('விலை')) {
        targetPath = '/market';
        actionTitle = 'Navigating to Live APMC Market Prices (/market)';
        if (lang.code === 'te-IN') {
          responseText = 'వరంగల్ మార్కెట్లో పత్తి ధర నేడు క్వింటాల్‌కు ₹7,120 వద్ద ఉంది. ప్యాడీ వరి ధర ₹2,450. లైవ్ మార్కెట్ ధరలను చూపిస్తున్నాను.';
        } else if (lang.code === 'hi-IN') {
          responseText = 'वारंगल मंडी में आज कपास का भाव ₹7,120 प्रति क्विंटल है। धान का भाव ₹2,450 है। लाइव मंडी भाव स्क्रीन खोल रही हूँ।';
        } else if (lang.code === 'ta-IN') {
          responseText = 'இன்று பருத்தி விலை குவிண்டாலுக்கு ₹7,120 ஆகும். சந்தை விலை பக்கத்தை திறக்கிறேன்.';
        } else if (lang.code === 'kn-IN') {
          responseText = 'ಇಂದು ಹತ್ತಿ ದರ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹7,120 ಆಗಿದೆ. ಮಾರುಕಟ್ಟೆ ದರಗಳ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.';
        } else if (lang.code === 'mr-IN') {
          responseText = 'आज कापसाचा दर ₹7,120 प्रति क्विंटल आहे. बाजार भाव स्क्रीन उघडत आहे.';
        } else {
          responseText = 'Today Cotton is trading at ₹7,120 per Quintal in Warangal Mandi, and Paddy Rice is at ₹2,450 per Quintal. Opening Live APMC Mandi Prices.';
        }
      }
      // EQUIPMENT RENTAL INTENT
      else if (lower.includes('equipment') || lower.includes('rent') || lower.includes('tractor') || lower.includes('harvester') || lower.includes('drone') || lower.includes('ट्रैक्टर') || lower.includes('किराया') || lower.includes('ట్రాక్టర్') || lower.includes('కిరాయి')) {
        targetPath = '/equipment';
        actionTitle = 'Opening Equipment Rental Marketplace (/equipment)';
        if (lang.code === 'te-IN') {
          responseText = 'జాన్ డియర్ ట్రాక్టర్లు మరియు వ్యవసాయ యంత్రాలు కిరాయికి సిద్ధంగా ఉన్నాయి. మార్కెట్‌ప్లేస్ చూపిస్తున్నాను.';
        } else if (lang.code === 'hi-IN') {
          responseText = 'जॉन डियर ट्रैक्टर और महिंद्रा हार्वेस्टर किराए के लिए उपलब्ध हैं। उपकरण किराया मार्केटप्लेस खोल रही हूँ।';
        } else if (lang.code === 'ta-IN') {
          responseText = 'டிராக்டர்கள் மற்றும் அறுவடை இயந்திரங்கள் வாடகைக்கு தயார். வாடகை பக்கத்தை திறக்கிறேன்.';
        } else if (lang.code === 'kn-IN') {
          responseText = 'ಟ್ರಾಕ್ಟರ್‌ಗಳು ಬಾಡಿಗೆಗೆ ಲಭ್ಯವಿದೆ. ಉಪಕರಣ ಬಾಡಿಗೆ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.';
        } else if (lang.code === 'mr-IN') {
          responseText = 'जॉन डियर ट्रॅक्टर भाड्याने उपलब्ध आहेत. उपकरणे भाडे स्क्रीन उघडत आहे.';
        } else {
          responseText = 'John Deere tractors, Mahindra Novo, and drones are ready for rental. Opening Farm Equipment Rental Marketplace.';
        }
      }
      // CROP DISEASE SCANNER INTENT
      else if (lower.includes('disease') || lower.includes('pest') || lower.includes('leaf') || lower.includes('scan') || lower.includes('बीमारी') || lower.includes('कीड़ा') || lower.includes('తెగులు')) {
        targetPath = '/disease';
        actionTitle = 'Opening AI Crop Disease Scanner (/disease)';
        if (lang.code === 'te-IN') {
          responseText = 'మీ పంట ఆకుల ఫోటో అప్‌లోడ్ చేయండి. Urvixa AI ఫంగల్ మరియు కీటకాల వ్యాధులను నిర్ధారిస్తుంది. వ్యాధి నిర్ధారణ స్క్రీన్ చూపిస్తున్నాను.';
        } else if (lang.code === 'hi-IN') {
          responseText = 'अपनी फसल की फोटो अपलोड करें। उर्विक्षा AI 99% सटीकता से बीमारी पहचान कर दवा बताएगा। बीमारी स्कैनर खोल रही हूँ।';
        } else {
          responseText = 'Upload your crop photo now. Urvixa AI will instantly diagnose fungal and pest damage. Opening AI Crop Disease Scanner.';
        }
      }
      // SOIL PASSPORT INTENT
      else if (lower.includes('soil') || lower.includes('npk') || lower.includes('ph') || lower.includes('fertilizer') || lower.includes('मिट्टी') || lower.includes('खाद') || lower.includes('నేల')) {
        targetPath = '/soil';
        actionTitle = 'Opening Soil Health Passport (/soil)';
        if (lang.code === 'te-IN') {
          responseText = 'మీ నేల pH 6.8 వద్ద ఆరోగ్యంగా ఉంది. నైట్రోజన్ 240 kg/ha. సోయిల్ పాస్‌పోర్ట్ నివేదిక చూపిస్తున్నాను.';
        } else if (lang.code === 'hi-IN') {
          responseText = 'आपकी मिट्टी का pH 6.8 उत्तम स्तर पर है। नाइट्रोजन 240 kg/ha है। सॉइल पासपोर्ट रिपोर्ट खोल रही हूँ।';
        } else {
          responseText = 'Your soil pH is 6.8 (Optimal). Nitrogen is at 240 kg/ha. Opening your Urvixa Soil Health Passport.';
        }
      }
      // CROP RECOMMENDATION INTENT
      else if (lower.includes('crop') || lower.includes('rabi') || lower.includes('kharif') || lower.includes('recommend') || lower.includes('फसल') || lower.includes('बुवाई') || lower.includes('పంటలు')) {
        targetPath = '/crop';
        actionTitle = 'Opening Crop Recommendation Advisor (/crop)';
        if (lang.code === 'te-IN') {
          responseText = 'ఈ సీజన్‌కు వేరుశనగ మరియు శనగ పంటలు గరిష్ట దిగుబడిని అందిస్తాయి. క్రాప్ రికమండేషన్ స్క్రీన్ చూపిస్తున్నాను.';
        } else if (lang.code === 'hi-IN') {
          responseText = 'इस मौसम के लिए मूंगफली और गेहूं सबसे अधिक उपज देंगे। क्रॉप रिकमेंडेशन पेज खोल रही हूँ।';
        } else {
          responseText = 'Groundnut and Wheat yield highest ROI for current soil conditions. Opening Crop Recommendation Advisor.';
        }
      }
      // TUTORIALS INTENT
      else if (lower.includes('video') || lower.includes('tutorial') || lower.includes('irrigation') || lower.includes('drip') || lower.includes('वीडियो')) {
        targetPath = '/tutorials';
        actionTitle = 'Opening Video Training Library (/tutorials)';
        if (lang.code === 'te-IN') {
          responseText = 'బిందు సేద్యం మరియు ఆర్గానిక్ ఎరువుల వీడియాలు సిద్ధంగా ఉన్నాయి. వీడియో లైబ్రరీ చూపిస్తున్నాను.';
        } else if (lang.code === 'hi-IN') {
          responseText = 'ड्रिप सिंचाई और जैविक खाद की वीडियो ट्रेनिंग उपलब्ध है। वीडियो लाइब्रेरी खोल रही हूँ।';
        } else {
          responseText = 'Opening Video Training Library for masterclasses on organic farming and drip irrigation.';
        }
      }
      // GENERAL GREETING / IDENTITY
      else {
        actionTitle = `Talking Back Aloud in ${lang.name} (${lang.flag})`;
        if (lang.code === 'te-IN') {
          responseText = 'నేను उर्विक्షా (Urvixa) AI డిజిటల్ వ్యవసాయ సహాయకురాలిని. నాతో ఇంగ్లీష్, తెలుగు, హిందీలో మాట్లాడవచ్చు.';
        } else if (lang.code === 'hi-IN') {
          responseText = 'मैं उर्विक्षा (Urvixa) AI कृषि वॉयस अस्सिस्टेंट हूँ। आप मुझसे हिंदी, अंग्रेजी या तेलुगु में सवाल पूछ सकते हैं।';
        } else {
          responseText = `I am Urvixa AI Voice Assistant. I detected your spoken language as ${lang.name}. How can I assist your farm today?`;
        }
      }

      // Step 2: Executing Visual Action
      setActionState({
        status: 'executing',
        label: actionTitle || `Executing Action in ${lang.name}`,
        detail: `Target Route: ${targetPath || 'App Screen'}`,
        icon: Navigation
      });

      // Append assistant response to chat log
      setChatLog((prev) => [...prev, { sender: 'urvixa', text: responseText, lang: lang.name }]);

      // Speak response aloud in detected language
      speakResponse(responseText, lang.code);

      // Execute navigation route
      if (targetPath) {
        navigate(targetPath);
      }
    }, 400);
  };

  return (
    <>
      {/* Top Floating Real-Time Visual Action Execution Feed Banner */}
      <AnimatePresence>
        {actionState.status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl text-white flex items-center gap-3.5 font-sans"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#15803D] to-[#0284C7] flex items-center justify-center text-white shrink-0 shadow-md">
              <actionState.icon className="w-5 h-5 animate-pulse text-white" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white flex items-center gap-1">
                  {actionState.label}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#86E39A] text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  {actionState.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 max-w-sm truncate">{actionState.detail}</p>
            </div>

            {/* Audio Waveform Animation when Speaking or Listening */}
            {(actionState.status === 'listening' || actionState.status === 'speaking') && (
              <div className="flex items-center gap-1 ml-2">
                <span className="w-1 h-5 bg-[#86E39A] rounded-full animate-pulse" />
                <span className="w-1 h-7 bg-sky-400 rounded-full animate-pulse delay-75" />
                <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse delay-150" />
                <span className="w-1 h-6 bg-[#86E39A] rounded-full animate-pulse delay-100" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Mic Button at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsOpen(true)}
              className="relative group p-4 rounded-full bg-gradient-to-tr from-[#15803D] via-[#0284C7] to-[#86E39A] text-white shadow-2xl hover:shadow-emerald-500/40 cursor-pointer flex items-center gap-3 border-2 border-white/40"
            >
              <div className="relative z-10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="text-left hidden sm:block pr-1">
                  <span className="block text-xs font-extrabold text-white">
                    Urvixa AI Voice
                  </span>
                  <span className="block text-[10px] text-emerald-200 font-medium">
                    Auto-Detects {detectedLang.flag} {detectedLang.name}
                  </span>
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Main Floating Voice Assistant Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[610px] rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl text-white flex flex-col justify-between overflow-hidden font-sans"
          >
            {/* Header Bar & Multilingual Language Selector */}
            <div className="p-4 bg-slate-950/90 border-b border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#15803D] to-[#0284C7] flex items-center justify-center shadow-md">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      Urvixa AI Multilingual Voice <Sparkles className="w-4 h-4 text-[#86E39A]" />
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Talk-Back Language: <strong className="text-emerald-400">{detectedLang.flag} {detectedLang.name}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                  }}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Switcher Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang);
                      setDetectedLang(lang);
                      if (isListening) startListening();
                    }}
                    className={`px-3 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 text-[11px] ${
                      selectedLang.code === lang.code
                        ? 'bg-[#15803D] text-white shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Log Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-[#15803D] text-white rounded-br-xs'
                        : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-70 mb-0.5">
                      <span>{msg.sender === 'user' ? 'Voice Input' : 'Urvixa AI (Talk-Back)'}</span>
                      <span className="font-bold">{msg.lang}</span>
                    </div>
                    <p className="leading-relaxed font-medium text-xs sm:text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Action State Bar & Voice Controls */}
            <div className="p-4 bg-slate-950/90 border-t border-slate-800 space-y-3">
              {/* Quick Preset Voice Commands */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                <button
                  onClick={() => handleUserQuery('What is today weather in Medak?')}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <CloudSun className="w-3 h-3 text-sky-400" /> Weather
                </button>
                <button
                  onClick={() => handleUserQuery('What is cotton market price today?')}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <TrendingUp className="w-3 h-3 text-emerald-400" /> Market Price
                </button>
                <button
                  onClick={() => handleUserQuery('Rent a tractor for farming')}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Tractor className="w-3 h-3 text-amber-400" /> Equipment
                </button>
                <button
                  onClick={() => handleUserQuery('Scan my plant disease')}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <ScanLine className="w-3 h-3 text-rose-400" /> Crop Disease
                </button>
              </div>

              {/* Live Voice Input Preview Box */}
              {isListening && (
                <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span className="truncate">{liveTranscript || 'Listening to your voice... Speak now...'}</span>
                  </div>
                  <button
                    onClick={stopListening}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shrink-0 cursor-pointer"
                  >
                    Done Speaking ➔
                  </button>
                </div>
              )}

              {/* Main Microphone Button & Text Input Form */}
              <div className="flex items-center gap-2">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`h-12 px-4 rounded-2xl font-bold text-xs flex items-center gap-2 shrink-0 transition-all cursor-pointer shadow-lg ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-4 ring-rose-500/30'
                      : 'bg-[#15803D] hover:bg-[#166534] text-white ring-2 ring-[#86E39A]/30'
                  }`}
                  title={isListening ? 'Tap to Finish Speaking' : `Start Voice Input in ${selectedLang.name}`}
                >
                  <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
                  <span>{isListening ? 'Stop Mic' : `Speak in ${selectedLang.name}`}</span>
                </button>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUserQuery(textInput);
                  }}
                  className="flex-1 flex items-center gap-2"
                >
                  <input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={`Type or speak in ${selectedLang.name}...`}
                    className="w-full h-12 px-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-medium text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                  />
                  <button
                    type="submit"
                    className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
