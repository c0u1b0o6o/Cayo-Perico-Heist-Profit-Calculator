import React, { useState } from 'react';
import { PlayerBag, LOOT_SPECS } from '@/lib/types';
import { BagProgressBar } from './BagProgressBar';
import { translations, Language } from '@/lib/translations';
import { clsx } from 'clsx';
import { Map, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface ZoneInstructionsProps {
  bags: PlayerBag[];
  language: Language;
}

export const ZoneInstructions: React.FC<ZoneInstructionsProps> = ({ bags, language }) => {
  const t = translations[language];
  const [startIndex, setStartIndex] = useState(0);

  // Predefined Zone Sorting Order
  const ZONE_ORDER = ['MainDockL', 'MainDockS', 'Office', 'Basement', 'SouthStorage', 'NorthStorage', 'WestStorage'];

  // Group loot BY zone to identify which players are active in each zone
  const getZoneActivity = () => {
    const zones: Record<string, number[]> = {};
    
    bags.forEach((bag, pIdx) => {
      bag.items.forEach(item => {
        if (!item.zone) return;
        const zoneKey = item.zone;
        if (!zones[zoneKey]) zones[zoneKey] = [];
        if (!zones[zoneKey].includes(pIdx)) zones[zoneKey].push(pIdx);
      });
    });
    
    // Convert to sorted array based on ZONE_ORDER
    return ZONE_ORDER
      .filter(key => !!zones[key])
      .map(key => ({
        id: key,
        name: t.zones[key as keyof typeof t.zones],
        activePlayers: zones[key]
      }));
  };

  const StickyNote: React.FC<{ 
    title: string; 
    children: React.ReactNode; 
    rotateClass: string;
  }> = ({ title, children, rotateClass }) => (
    <div className={clsx(
      "p-6 shadow-xl paper-texture relative min-h-[300px] flex flex-col transition-all hover:scale-[1.02] hover:z-10 cursor-default bg-yellow-100/95 border border-black/5 w-full",
      rotateClass
    )}>
      {/* Tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-[1px] rotate-1 shadow-sm border-x border-black/5 tape"></div>
      
      <div className="flex items-center gap-2 mb-4 border-b border-black/10 pb-2">
        <Map size={24} className="text-yellow-700" />
        <h4 className="font-hand text-2xl font-bold text-gray-800">{title}</h4>
      </div>
      <div className="font-hand space-y-4">
        {children}
      </div>
    </div>
  );

  const sortedZones = getZoneActivity();
  const totalZones = sortedZones.length;
  const currentZone = sortedZones[startIndex];

  const handleNext = () => {
    if (startIndex + 1 < totalZones) {
      setStartIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-20 px-4 group/carousel">
      <div className="relative">
        {/* Navigation Buttons */}
        {startIndex > 0 && (
          <button 
            onClick={handlePrev}
            className="absolute -left-4 sm:-left-16 top-1/2 -translate-y-1/2 p-2 bg-yellow-400/20 hover:bg-yellow-400/40 rounded-full transition-all text-yellow-800 z-20 backdrop-blur-sm shadow-sm"
          >
            <ChevronLeft size={32} />
          </button>
        )}
        
        {startIndex + 1 < totalZones && (
          <button 
            onClick={handleNext}
            className="absolute -right-4 sm:-right-16 top-1/2 -translate-y-1/2 p-2 bg-yellow-400/20 hover:bg-yellow-400/40 rounded-full transition-all text-yellow-800 z-20 backdrop-blur-sm shadow-sm"
          >
            <ChevronRight size={32} />
          </button>
        )}

      {/* Side-by-Side View */}
        {currentZone && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch transition-all duration-500">
            {/* Left Side: Image Placeholder */}
            <div className="bg-gray-800/20 rounded border-2 border-dashed border-gray-400/30 flex flex-col items-center justify-center p-8 min-h-[300px] relative overflow-hidden paper-texture shadow-inner hover:bg-gray-800/25 transition-colors">
                <div className="absolute inset-0 opacity-10 bg-[url('/paper-texture.png')] bg-repeat"></div>
                <ImageIcon size={64} className="text-gray-400 mb-4" />
                <p className="font-hand text-xl text-gray-500 italic uppercase">Intel Photo Incoming...</p>
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gray-400 opacity-20"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gray-400 opacity-20"></div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/20 rotate-1 tape"></div>
            </div>

            {/* Right Side: Sticky Note */}
            <div className="flex justify-center">
                <StickyNote 
                    title={currentZone.name}
                    rotateClass={startIndex % 2 === 0 ? 'rotate-1' : '-rotate-1'}
                >
                    <div className="space-y-3">
                        {bags.map((bag, pIdx) => {
                            // CUMULATIVE FILTER: Include items from ALL zones up to current index
                            const activeZoneIds = sortedZones.slice(0, startIndex + 1).map(z => z.id);
                            
                            const cumulativeItems = bag.items.filter(item => 
                                item.zone && activeZoneIds.includes(item.zone)
                            );
                            
                            const cumulativeValue = cumulativeItems.reduce((sum, item) => sum + item.value, 0);
                            const cumulativeWeight = cumulativeItems.reduce((sum, item) => sum + item.percentage, 0);
                            
                            const cumulativeBag = {
                                items: cumulativeItems,
                                totalValue: cumulativeValue,
                                totalWeight: cumulativeWeight
                            };

                            return (
                                <div key={pIdx} className="bg-white p-2 rounded border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                                    <div className="text-sm font-bold text-gray-500 mb-1 flex justify-between">
                                        <span>{language === 'en' ? `Player ${pIdx + 1}` : `玩家 ${pIdx + 1}`}</span>
                                        <span className="tabular-nums font-mono text-xs text-yellow-600">${Math.round(cumulativeValue).toLocaleString()}</span>
                                    </div>
                                    <BagProgressBar 
                                        bag={cumulativeBag} 
                                        playerIndex={pIdx} 
                                        simpleMode={true} 
                                        language={language} 
                                        flashingZone={currentZone.id}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </StickyNote>
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalZones === 0 && (
          <div className="text-center py-20 bg-gray-800/20 rounded-xl border-4 border-dashed border-gray-600/30">
            <p className="font-hand text-2xl text-gray-500 italic">{t.results.emptyBags}</p>
          </div>
        )}

        {/* Indicators */}
        {totalZones > 1 && (
            <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalZones }).map((_, i) => (
                    <div 
                        key={i} 
                        className={clsx(
                            "w-2 h-2 rounded-full transition-all",
                            startIndex === i ? "bg-yellow-400 w-4" : "bg-yellow-400/30"
                        )}
                    />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
