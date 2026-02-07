import React from 'react';
import { PlayerBag, LootType, LOOT_SPECS } from '@/lib/types';
import { translations, Language } from '@/lib/translations';
import { clsx } from 'clsx';

interface BagProgressBarProps {
  playerIndex: number;
  bag: PlayerBag;
  simpleMode?: boolean;
  language: Language;
}

const COLOR_MAP: Record<string, string> = {
  Gold: 'bg-yellow-400',
  Coke: 'bg-stone-300',
  Weed: 'bg-green-500',
  Painting: 'bg-red-500',
  Cash: 'bg-green-800',
};

export const BagProgressBar: React.FC<BagProgressBarProps> = ({ playerIndex, bag, simpleMode = false, language }) => {
  const t = translations[language];
  // Sort items for visual consistency
  const sortedItems = [...bag.items].sort((a, b) => {
     const order = ['Gold', 'Coke', 'Weed', 'Painting', 'Cash'];
     return order.indexOf(a.type) - order.indexOf(b.type);
  });

  return (
    <div className="space-y-1">
      {!simpleMode && (
        <div className="flex justify-between items-end mb-1">
            <span className="font-hand text-lg text-stone-300">{language === 'en' ? `Player ${playerIndex + 1}` : `玩家 ${playerIndex + 1}`}</span>
            <span className="font-mono text-sm text-yellow-500 font-bold">
            ${bag.totalValue.toLocaleString()} 
            <span className="text-stone-500 ml-2">({Math.min(100, Math.round(bag.totalWeight))}% Full)</span>
            </span>
        </div>
      )}
      
      <div className={clsx(
          "w-full rounded-sm overflow-hidden flex relative border border-black/10",
          simpleMode ? "h-4 bg-gray-200" : "h-8 bg-stone-900 border-stone-600 border-2"
      )}>
        {bag.items.length === 0 && (
          <div className="w-full h-full flex items-center justify-center text-stone-500 text-[10px] italic">
            Empty
          </div>
        )}
        
        {sortedItems.map((item, idx) => (
          <div 
            key={idx}
            className={clsx(COLOR_MAP[item.type] || 'bg-stone-500', "h-full relative group transition-all duration-500 cursor-help")}
            style={{ width: `${item.percentage}%` }}
          >
             {/* Tooltip */}
             <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs p-1 rounded whitespace-nowrap z-20 pointer-events-none">
                {t.loot[item.type as keyof typeof t.loot] || item.type}: {Math.round(item.percentage)}% (${item.value.toLocaleString()})
              </div>
             {/* Label if wide enough */}
             {item.percentage > 20 && !simpleMode && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-black/70 overflow-hidden">
                   {t.loot[item.type as keyof typeof t.loot] || item.type}
                </span>
             )}
          </div>
        ))}
      </div>
      
      {simpleMode && (
         <div className="space-y-1">
            <div className="flex justify-between text-xs font-hand text-gray-600">
                <span>${Math.round(bag.totalValue).toLocaleString()}</span>
                <span>{Math.round(bag.totalWeight)}% Full</span>
            </div>
            <div className="text-[10px] font-hand text-stone-500 leading-tight">
                {bag.items.length > 0 ? (
                    (() => {
                        // Group by type
                        const groups: Record<string, number> = {};
                        bag.items.forEach(item => {
                            groups[item.type] = (groups[item.type] || 0) + item.percentage;
                        });
                        
                        return Object.entries(groups).map(([type, totalWeight], i, arr) => {
                            return (
                                <span key={type}>
                                    {t.loot[type as keyof typeof t.loot] || type} {Math.round(totalWeight)}%
                                    {i < arr.length - 1 ? ', ' : ''}
                                </span>
                            );
                        });
                    })()
                ) : (language === 'en' ? 'None' : '無')}
            </div>
         </div>
      )}
    </div>
  );
};
