import React, { useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';
import { clsx } from 'clsx';
import { LanguageToggle } from './LanguageToggle';
import { RotateCcw } from 'lucide-react';

interface NavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onReset: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ 
  activeTab, 
  onTabChange, 
  language, 
  onLanguageChange,
  onReset
}) => {
  const t = translations[language];
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at the very top
      if (currentScrollY < 50) {
        setIsVisible(true);
      } 
      // Hide when scrolling down past 50px
      else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } 
      // Show when scrolling up
      else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobile]);

  const navItems = [
    { id: 'prep', label: t.nav.prep },
    { id: 'results', label: t.nav.results },
    { id: 'data', label: t.nav.data },
    { id: 'faq', label: t.nav.faq },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <nav className={clsx(
      "fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] backdrop-blur-sm border-b-4 border-gray-800 shadow-lg transition-transform duration-300",
      isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
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
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-900/40 hover:bg-red-700/60 text-red-200 border border-red-800/50 transition-all font-hand text-sm group"
              title={t.nav.reset}
            >
              <RotateCcw size={14} className="group-hover:-rotate-45 transition-transform" />
              <span className="font-bold">{t.nav.reset}</span>
            </button>
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
              {isMobile ? 'CPHC' : 'Cayo Perico Calculator'}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onReset}
                className="p-1.5 rounded bg-red-900/40 text-red-200 border border-red-800/50"
                aria-label={t.nav.reset}
              >
                <RotateCcw size={16} />
              </button>
              <LanguageToggle currentLang={language} onLanguageChange={onLanguageChange} />
            </div>
          </div>

          {/* Bottom Row: Nav Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar snap-x snap-mandatory">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={clsx(
                  "px-6 py-2 text-sm font-hand transition-all rounded whitespace-nowrap snap-center shrink-0 tape-hover",
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
