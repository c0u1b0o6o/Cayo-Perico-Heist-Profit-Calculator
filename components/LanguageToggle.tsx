import React from 'react';
import { Language } from '@/lib/translations';
import { clsx } from 'clsx';
import { Languages } from 'lucide-react';

interface LanguageToggleProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ currentLang, onLanguageChange }) => {
  const options: { value: Language; label: string }[] = [
    { value: 'tw', label: '繁中' },
    { value: 'cn', label: '简中' },
    { value: 'en', label: 'EN' },
  ];

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center bg-gray-800/80 border-2 border-gray-600 rounded-lg p-1 shadow-2xl backdrop-blur-sm">
      <div className="px-2 text-gray-400">
        <Languages size={18} />
      </div>
      <div className="flex gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onLanguageChange(option.value)}
            className={clsx(
              "px-3 py-1 rounded text-sm font-bold transition-all font-mono tracking-tight",
              currentLang === option.value
                ? "bg-white text-gray-900 shadow-inner"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
