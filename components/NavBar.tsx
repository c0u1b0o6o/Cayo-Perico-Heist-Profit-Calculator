import React from 'react';
import { Language, translations } from '@/lib/translations';
import { clsx } from 'clsx';
import { LanguageToggle } from './LanguageToggle';

interface NavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ 
  activeTab, 
  onTabChange, 
  language, 
  onLanguageChange 
}) => {
  const t = translations[language];

  const navItems = [
    { id: 'prep', label: t.nav.prep },
    { id: 'results', label: t.nav.results },
    { id: 'data', label: t.nav.data },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] backdrop-blur-sm border-b-4 border-gray-800 shadow-lg">
      <div className="w-full px-4 sm:px-8 py-3">
        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-3 items-center gap-4">
          {/* Logo - Left */}
          <div className="flex items-center">
            <button 
              className="text-white font-hand text-3xl font-black tracking-tight hover:scale-105 transition-transform drop-shadow-md"
              onClick={() => onTabChange('prep')}
            >
              Cayo Perico Calculator
            </button>
          </div>

          {/* Nav Links - Center */}
          <div className="flex items-center justify-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={clsx(
                  "px-4 py-2 rounded font-hand text-lg transition-all whitespace-nowrap tape-hover",
                  activeTab === item.id 
                    ? "bg-white text-gray-900 font-bold shadow-md active" 
                    : "text-white hover:bg-white hover:text-gray-900 hover:shadow-md"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Language Toggle - Right */}
          <div className="flex items-center justify-end">
            <LanguageToggle currentLang={language} onLanguageChange={onLanguageChange} />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Top Row: Logo + Language */}
          <div className="flex items-center justify-between mb-3">
            <button 
              className="text-white font-hand text-2xl font-black tracking-tight"
              onClick={() => onTabChange('prep')}
            >
              Cayo Perico Calculator
            </button>
            <LanguageToggle currentLang={language} onLanguageChange={onLanguageChange} />
          </div>

          {/* Bottom Row: Nav Tabs */}
          <div className="flex items-center justify-around gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={clsx(
                  "flex-1 px-2 py-1.5 text-sm font-hand transition-all rounded whitespace-nowrap tape-hover",
                  activeTab === item.id 
                    ? "bg-white text-gray-900 font-bold shadow-md active" 
                    : "text-white hover:bg-white hover:text-gray-900"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
