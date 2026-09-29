import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Domicilios } from './pages/Domicilios';
import { SuporteSocial } from './pages/SuporteSocial';
import { TempoSozinho } from './pages/TempoSozinho';
import { TimeEngine } from './pages/timengine';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(() => window.location.pathname === '/timengine' ? 'timengine' : 'inicio');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or stored theme
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    window.history.pushState({}, '', tab === 'timengine' ? '/timengine' : '/');
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'inicio':
        return <Home onNavigate={handleTabChange} />;
      case 'domicilio':
        return <Domicilios />;
      case 'suporte':
        return <SuporteSocial />;
      case 'tempo':
        return <TempoSozinho />;
      case 'timengine':
        return <TimeEngine />;
      default:
        return <Home onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar 
        currentTab={currentTab} 
        onTabChange={handleTabChange}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default App;
