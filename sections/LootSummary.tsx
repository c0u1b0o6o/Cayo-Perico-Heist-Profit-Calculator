import React, { useState } from 'react';
import { LootCounts, LootType } from '@/lib/types';
import { ChevronDown, ChevronUp, ClipboardList } from 'lucide-react';
import { translations, Language } from '@/lib/translations';
import { clsx } from 'clsx';

interface LootSummaryProps {
  lootCounts: LootCounts;
  language: Language;
}

export const LootSummary: React.FC<LootSummaryProps> = ({ lootCounts, language }) => {
  const t = translations[language];
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calculate loot totals
  const lootTotals: Record<LootType, number> = {
    Gold: 0,
    Coke: 0,
    Weed: 0,
    Painting: 0,
    Cash: 0,
  };

  Object.values(lootCounts).forEach(zoneCounts => {
    Object.entries(zoneCounts).forEach(([type, count]) => {
      if (count) lootTotals[type as LootType] += count;
    });
  });

  const hasAnyLoot = Object.values(lootTotals).some(count => count > 0);

  // For the progress bar: assume a max of 6 piles for visualization
  const MAX_VISUAL_COUNT = 6;

  return (
    <div className="bg-stone-100 text-gray-800 p-6 rounded shadow-lg transform -rotate-1 relative paper-texture transition-transform hover:scale-[1.02] mt-8">
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-indigo-200 opacity-50 rotate-1 tape"></div>
      
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full text-left group"
      >
        <div className="flex items-center justify-between border-b-2 border-gray-300 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-gray-600" />
            <h2 className="font-hand text-2xl font-bold tracking-tight">{t.summary.title}</h2>
          </div>
          <div className="text-gray-400 group-hover:text-gray-800 transition-colors">
            {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </div>
        </div>
      </button>

      <div className={clsx(
        "transition-all duration-300 ease-in-out overflow-hidden",
        isCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
      )}>
        {hasAnyLoot ? (
          <div className="flex items-end justify-around h-40 pt-4 pb-12 gap-3 mt-2">
            {Object.entries(lootTotals).map(([type, count]) => {
              if (count === 0) return null;
              
              const percentage = Math.min((count / MAX_VISUAL_COUNT) * 100, 100);
              const colorClass = 
                type === 'Gold' ? 'bg-yellow-500' :
                type === 'Coke' ? 'bg-stone-300' :
                type === 'Weed' ? 'bg-green-500' :
                type === 'Painting' ? 'bg-red-500' :
                'bg-green-800'; // Cash

              return (
                <div key={type} className="flex-1 flex flex-col items-center h-full relative group">
                  {/* Vertical Bar Container (Base removed) */}
                  <div className="w-full h-full relative">
                    <div 
                      className={clsx("absolute bottom-0 w-full transition-all duration-700 rounded-t-sm shadow-sm", colorClass)}
                      style={{ height: `${percentage}%` }}
                    />
                  </div>
                  
                  {/* Label below the bar */}
                  <div className="absolute top-full mt-1 flex flex-col items-center w-full">
                    <span className="font-mono text-xs font-bold leading-none mb-0.5">x{count}</span>
                    <span className="font-hand text-[10px] sm:text-xs font-bold leading-tight text-center wrap-break-word w-full">
                      {t.loot[type as keyof typeof t.loot] || type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 italic font-hand text-lg text-center py-4">{t.summary.empty}</p>
        )}
      </div>
    </div>
  );
};
