import React from 'react';
import { Language, translations } from '@/lib/translations';
import { LOOT_SPECS } from '@/lib/types';
import { clsx } from 'clsx';

interface BasicDataProps {
  language: Language;
}

export const BasicDataPage: React.FC<BasicDataProps> = ({ language }) => {
  const t = translations[language];

  const secondaryLoot = [
    LOOT_SPECS.Gold,
    LOOT_SPECS.Coke,
    LOOT_SPECS.Weed,
    LOOT_SPECS.Painting,
    LOOT_SPECS.Cash,
  ];

  const primaryTargets = [
    { name: 'Sinsimito Tequila', normal: 900000, hard: 990000 },
    { name: 'Ruby Necklace', normal: 1000000, hard: 1100000 },
    { name: 'Bearer Bonds', normal: 1100000, hard: 1210000 },
    { name: 'Pink Diamond', normal: 1300000, hard: 1430000 },
    { name: 'Panther Statue', normal: 1900000, hard: 2090000 },
    { name: 'Madrazo Files', normal: 1100000, hard: 1100000 },
  ];

  const COLOR_MAP: Record<string, string> = {
    Gold: 'text-yellow-600',
    Coke: 'text-stone-500',
    Weed: 'text-green-600',
    Painting: 'text-red-600',
    Cash: 'text-green-800',
  };

  return (
    <div className="w-full max-w-4xl space-y-12 pb-12 pt-8">
      {/* Primary Target Table */}
      <div className="bg-white p-6 sm:p-8 rounded shadow-2xl transform rotate-1 relative paper-texture transition-transform hover:rotate-0 duration-300">
        <div className="absolute -top-2 left-1/4 transform -translate-x-1/2 w-32 h-6 bg-red-200 opacity-50 -rotate-2 tape"></div>
        <h2 className="font-hand text-heading-2 mb-6 border-b-2 border-red-100 pb-2 font-bold text-red-600">
          {t.data.primaryTitle}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-hand text-body-normal border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 text-gray-500 uppercase tracking-widest font-hand font-bold">
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">{t.data.lootName}</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-right text-xs sm:text-sm">{t.data.primaryNormal}</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-right text-xs sm:text-sm">{t.data.primaryHard}</th>
              </tr>
            </thead>
            <tbody>
              {primaryTargets.map((target) => (
                <tr key={target.name} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-4 font-bold text-gray-800">{t.loot[target.name as keyof typeof t.loot] || target.name}</td>
                  <td className="py-4 px-4 text-right font-hand text-gray-600">${target.normal.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right text-red-700 font-bold font-hand group-hover:scale-110 transition-transform origin-right">
                    ${target.hard.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secondary Loot Table */}
      <div className="bg-white p-6 sm:p-8 rounded shadow-2xl transform -rotate-1 relative paper-texture transition-transform hover:rotate-0 duration-300">
        <div className="absolute -top-2 left-3/4 transform -translate-x-1/2 w-32 h-6 bg-blue-200 opacity-50 rotate-1 tape"></div>
        <h2 className="font-hand text-heading-2 mb-6 border-b-2 border-blue-100 pb-2 font-bold text-gray-800">
          {t.data.lootTable}
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-hand text-body-normal border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 text-gray-500 uppercase tracking-widest font-hand font-bold">
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">{t.data.lootName}</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-right text-xs sm:text-sm">{t.data.valuePerPile}</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-right text-xs sm:text-sm">{t.data.weightPerPile}</th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-right text-xs sm:text-sm">{t.data.valuePerFullBag}</th>
              </tr>
            </thead>
            <tbody>
              {secondaryLoot.map((loot) => {
                const fullBagValue = Math.round(loot.value * (100 / loot.weight));
                const textColorClass = COLOR_MAP[loot.type] || 'text-gray-700';
                
                return (
                  <tr key={loot.type} className={clsx("border-b border-gray-100 hover:bg-gray-50/50 transition-colors", textColorClass)}>
                    <td className="py-4 px-4 font-bold">{t.loot[loot.type as keyof typeof t.loot] || loot.type}</td>
                    <td className="py-4 text-black px-4 text-right font-hand">${loot.value.toLocaleString()}</td>
                    <td className="py-4 text-black px-4 text-right font-hand">{loot.weight}%</td>
                    <td className="py-4 text-red-700 px-4 text-right font-black font-hand">
                      ${fullBagValue.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
