import React from 'react';
import { motion } from 'framer-motion';
import {  
  Sun, 
  Moon,
  Code,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  darkMode,
  onToggleDarkMode,
}) => {
  const tabs = [
    { id: 'inicio', label: 'Início' },
    { id: 'domicilio', label: 'Domicílio' },
    { id: 'suporte', label: 'Suporte Social'},
    { id: 'tempo', label: 'Tempo Sozinho',},
    { id: 'timengine', label: 'Motor do Tempo'},
  ];

  return (
    <header className="sticky top-0 z-[1000] w-full transition-colors border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onTabChange('inicio')}
          >
            <div className="h-10 w-10 rounded-xl from-outline to-outline flex items-center group-hover:scale-5 transition-transform">           
           </div>
            <div>
             <span 
  className="block font-semibold text-lg tracking-tight bg-gradient-to-r from-green-400 via-orange-500 to-green-600 bg-clip-text text-transparent"
  style={{ fontFamily: "'Fira Code', monospace" }}>
  
  Breathe Time
</span>
  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-600 bg-clip-text text-transparent">
    333
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-orange-50 dark:bg-card border border-border/50">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full shadow-md bg-primary shadow-primary/25"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Theme Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com//4ndersonn"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border border-border/60 bg-card hover:bg-orange-50/60 dark:hover:bg-white/5 text-foreground"
            >
              <Code className="h-4 w-4" />
              <span>GitHub</span>
            </a>

            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ring border border-border/60 bg-card hover:bg-orange-50/60 dark:hover:bg-white/5 text-foreground"
              aria-label="Alternar Tema"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex md:hidden overflow-x-auto border-t border-border/40 px-2 py-2 gap-1 bg-card/50">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
