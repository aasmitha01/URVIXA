import React from 'react';
import { AuthProvider, useAuth } from './lib/auth.jsx';
import { ThemeProvider } from './lib/theme.jsx';
import { useRoute } from './lib/router.js';
import { Layout } from './components/Layout.jsx';
import { Login, Register } from './screens/Auth.jsx';
import { Dashboard } from './screens/Dashboard.jsx';
import { SoilPassport } from './screens/SoilPassport.jsx';
import { PrecisionFarming } from './screens/PrecisionFarming.jsx';
import { DiseaseAnalysis } from './screens/DiseaseAnalysis.jsx';
import { CropRecommendation } from './screens/CropRecommendation.jsx';
import { Weather } from './screens/Weather.jsx';
import { MarketPrices } from './screens/MarketPrices.jsx';
import { EquipmentRental } from './screens/EquipmentRental.jsx';
import { Community } from './screens/Community.jsx';
import { VideoTutorials } from './screens/VideoTutorials.jsx';
import { Notifications } from './screens/Notifications.jsx';
import { Profile } from './screens/Profile.jsx';
import { Sprout } from 'lucide-react';

const screens = {
  '/': Dashboard,
  '/dashboard': Dashboard,
  '/soil': SoilPassport,
  '/precision': PrecisionFarming,
  '/disease': DiseaseAnalysis,
  '/crop': CropRecommendation,
  '/weather': Weather,
  '/market': MarketPrices,
  '/equipment': EquipmentRental,
  '/community': Community,
  '/tutorials': VideoTutorials,
  '/notifications': Notifications,
  '/profile': Profile,
};

function Shell() {
  const { session, loading } = useAuth();
  const route = useRoute();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#090D16] text-white font-normal">
        <div className="flex flex-col items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-[#15803D] to-[#86E39A] text-white shadow-lg">
            <Sprout className="h-6 w-6" />
          </div>
          <div className="h-8 w-8 animate-spin-slow rounded-full border-4 border-[#86E39A]/20 border-t-[#86E39A]" />
          <p className="text-base font-semibold text-[#86E39A]">Loading Urvixa Glass AI Platform…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return route === '/register' ? <Register /> : <Login />;
  }

  const Screen = screens[route] ?? Dashboard;
  const current = screens[route] ? route : '/dashboard';

  return (
    <Layout current={current}>
      <Screen />
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </ThemeProvider>
  );
}
