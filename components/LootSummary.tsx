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
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-yellow-200 opacity-50 -rotate-2 tape shadow-sm"></div>
      
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
          <div className="space-y-4 pt-2">
            {Object.entries(lootTotals).map(([type, count]) => {
              if (count === 0) return null;
              
              const percentage = Math.min((count / MAX_VISUAL_COUNT) * 100, 100);
              const colorClass = 
                type === 'Gold' ? 'bg-yellow-500' :
                type === 'Coke' ? 'bg-blue-400' :
                type === 'Weed' ? 'bg-green-500' :
                type === 'Painting' ? 'bg-purple-500' :
                'bg-stone-500';

              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between font-hand text-lg px-1">
                    <span className="font-bold">{t.loot[type as keyof typeof t.loot] || type}</span>
                    <span className="font-mono text-sm font-bold">x{count}</span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-sm overflow-hidden border border-gray-300 relative shadow-inner">
                    <div 
                      className={clsx("h-full transition-all duration-700 rounded-sm", colorClass)}
                      style={{ width: `${percentage}%` }}
                    />
                    {/* Sketchy segments indicator */}
                    <div className="absolute inset-0 flex justify-between px-0 pointer-events-none opacity-10">
                      {[...Array(MAX_VISUAL_COUNT)].map((_, i) => (
                        <div key={i} className="w-px h-full bg-black" />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 italic font-hand text-lg text-center py-4">{t.summary.empty}</p>
        )}
        
        <div className="flex items-center justify-center gap-2 mt-6">
            <div className="h-px bg-gray-300 flex-1"></div>
            <p className="text-[10px] text-gray-400 font-sans font-bold uppercase tracking-widest whitespace-nowrap">
              {t.summary.footer}
            </p>
            <div className="h-px bg-gray-300 flex-1"></div>
        </div>
      </div>
    </div>
  );
};
