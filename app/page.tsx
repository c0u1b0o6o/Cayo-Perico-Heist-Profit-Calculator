'use client';

import React, { useState, useMemo } from 'react';
import { LootCounts, PlayerSettings, Zone, LootType } from '@/lib/types';
import { calculateOptimalLoot } from '@/lib/algorithm';
import { LootInput } from '@/components/LootInput';
import { ResultBoard } from '@/components/ResultBoard';
import { Check, Dices } from 'lucide-react';
import { clsx } from 'clsx';

const ZONES: Zone[] = ['Main Dock', 'North Storage', 'South Storage', 'West Storage', 'Basement', 'Office'];

const PRIMARY_TARGETS = [
  { name: 'Sinsimito Tequila', value: 900000, id: 'tequila' },
  { name: 'Ruby Necklace', value: 1000000, id: 'necklace' },
  { name: 'Bearer Bonds', value: 1100000, id: 'bonds' },
  { name: 'Pink Diamond', value: 1300000, id: 'diamond' },
  { name: 'Panther Statue', value: 1900000, id: 'panther' },
  { name: 'Madrazo Files', value: 1100000, id: 'files' },
];

export default function Home() {
  const [settings, setSettings] = useState<PlayerSettings>({
    players: 1,
    hardMode: false,
    eliteCommand: false,
    cuts: [100],
  });
  
  const [selectedPrimaryValue, setSelectedPrimaryValue] = useState(PRIMARY_TARGETS[0].value);

  const [lootCounts, setLootCounts] = useState<LootCounts>({});
  const [wallSafeValue, setWallSafeValue] = useState(0);

  const handlePlayerChange = (num: number) => {
    // Default cuts logic: Captain gets the most, others get 15% min
    let newCuts = [100];
    if (num === 2) newCuts = [85, 15];
    else if (num === 3) newCuts = [70, 15, 15];
    else if (num ===4) newCuts = [55, 15, 15, 15];
    
    setSettings(s => ({ ...s, players: num, cuts: newCuts }));
  };

  const handleCutChange = (playerIndex: number, delta: number) => {
    setSettings(s => {
      const newCuts = [...s.cuts];
      const newVal = Math.max(0, Math.min(100, newCuts[playerIndex] + delta));
      
      // If we change one, we must balance it with the Leader (index 0) 
      // OR just allow free editing as long as sum <= 100? 
      // GTA logic: You adjust individual cuts, and it must sum to 100.
      // Easiest UI: Changing a non-leader cut subtracts from the leader.
      if (playerIndex === 0) {
        // Leader manual adjustment (just shifts the remainder if we want to be fancy, 
        // but let's just let it be for now and show a warning if sum != 100)
        newCuts[0] = newVal;
      } else {
        const diff = newVal - newCuts[playerIndex];
        if (newCuts[0] - diff >= 0) {
          newCuts[playerIndex] = newVal;
          newCuts[0] -= diff;
        }
      }
      return { ...s, cuts: newCuts };
    });
  };

  const handleReset = () => {
    if (confirm('確定要清除所有偵察資料嗎？')) {
      setLootCounts({});
      setWallSafeValue(0);
    }
  };

  const handleLootChange = (zone: Zone, type: LootType, delta: number) => {
    setLootCounts(prev => {
      const currentZone = prev[zone] || {};
      const currentCount = currentZone[type] || 0;
      const newCount = Math.max(0, currentCount + delta);
      
      return {
        ...prev,
        [zone]: {
          ...currentZone,
          [type]: newCount
        }
      };
    });
  };

  const calculatedBags = useMemo(() => {
    return calculateOptimalLoot(lootCounts, settings.players);
  }, [lootCounts, settings.players]);

  const cutsSum = settings.cuts.reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <header className="text-center mb-8 relative z-10 flex flex-col items-center">
        <h1 className="font-hand text-4xl sm:text-6xl text-white transform -rotate-1 drop-shadow-lg inline-block border-b-2 border-white pb-2 bg-board-bg/50 backdrop-blur-sm px-4 rounded mb-2">
          佩里克島搶劫計畫
        </h1>
        <button 
          onClick={handleReset}
          className="font-hand text-stone-400 hover:text-red-400 text-sm underline transition-colors"
        >
          重置所有偵察資料
        </button>
      </header>

      {/* Main Planning Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Settings & Setup */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Settings Note */}
          <div className="bg-yellow-100 text-gray-800 p-6 rounded shadow-lg transform rotate-1 relative paper-texture transition-transform hover:scale-[1.02]">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-yellow-200 opacity-50 rotate-1 tape"></div>
            <h2 className="font-hand text-2xl mb-4 border-b-2 border-gray-400 pb-1 font-bold">任務設定</h2>

            <div className="space-y-4">
              {/* Players */}
              <div>
                <label className="block font-bold mb-1 font-hand text-lg">搶劫成員</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handlePlayerChange(num)}
                      className={clsx(
                        "flex-1 py-2 border-2 rounded transition font-hand font-bold text-xl activeable",
                        settings.players === num
                          ? "bg-gray-800 text-white border-white"
                          : "border-gray-800 hover:bg-gray-200"
                      )}
                    >
                      {num}人
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode & Challenges */}
              <div className="flex items-center justify-between">
                <label className="cursor-pointer flex items-center space-x-2 select-none">
                  <div 
                    className={clsx(
                      "w-6 h-6 border-2 border-gray-800 rounded flex items-center justify-center transition-colors",
                      settings.hardMode ? "bg-red-600 border-red-800" : "bg-transparent"
                    )}
                    onClick={() => setSettings(s => ({ ...s, hardMode: !s.hardMode }))}
                  >
                     {settings.hardMode && <Check size={16} className="text-white" />}
                  </div>
                  <span className="font-hand text-lg font-bold text-red-700">困難模式</span>
                </label>

                <label className="cursor-pointer flex items-center space-x-2 select-none">
                   <div 
                    className={clsx(
                      "w-6 h-6 border-2 border-gray-800 rounded flex items-center justify-center transition-colors",
                      settings.eliteCommand ? "bg-green-600 border-green-800" : "bg-transparent"
                    )}
                     onClick={() => setSettings(s => ({ ...s, eliteCommand: !s.eliteCommand }))}
                  >
                     {settings.eliteCommand && <Check size={16} className="text-white" />}
                  </div>
                  <span className="font-hand text-lg font-bold text-green-700">精英挑戰</span>
                </label>
              </div>
            </div>
          </div>

          {/* Primary Target Note */}
          <div className="bg-white text-gray-800 p-6 rounded shadow-lg transform -rotate-1 relative paper-texture transition-transform hover:scale-[1.02]">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-red-200 opacity-50 -rotate-2 tape"></div>
            <h2 className="font-hand text-2xl mb-4 text-red-600 border-b-2 border-red-200 pb-1 font-bold">主要目標</h2>
            <div className="space-y-4">
                <select 
                className="w-full p-2 border-2 border-gray-400 bg-transparent font-hand text-xl focus:border-gray-800 outline-none cursor-pointer"
                value={selectedPrimaryValue}
                onChange={(e) => setSelectedPrimaryValue(Number(e.target.value))}
                >
                {PRIMARY_TARGETS.map(t => (
                    <option key={t.id} value={t.value}>{t.name}</option>
                ))}
                </select>

                <div>
                    <label className="block font-bold mb-1 font-hand text-lg text-gray-600">辦公室保險箱</label>
                    <div className="flex items-center gap-2">
                        <span className="font-hand text-xl text-gray-400">$</span>
                        <input 
                            type="number" 
                            className="w-full bg-transparent border-b-2 border-gray-300 font-hand text-xl focus:border-gray-800 outline-none"
                            placeholder="0"
                            value={wallSafeValue || ''}
                            onChange={(e) => setWallSafeValue(Number(e.target.value))}
                        />
                        <button 
                            onClick={() => setWallSafeValue(Math.floor(Math.random() * (90000 - 50000 + 1)) + 50000)}
                            className="p-1.5 bg-gray-100 rounded border border-gray-300 hover:bg-gray-200 transition-colors text-gray-600"
                            title="隨機生成金額 (50k~90k)"
                        >
                            <Dices size={18} />
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 italic font-sans font-bold uppercase">Does not take bag space</p>
                </div>
            </div>
          </div>
          
           {/* Cuts Setting */}
           <div className="bg-blue-100 text-gray-800 p-6 rounded shadow-lg transform rotate-2 relative paper-texture transition-transform hover:scale-[1.02]">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-blue-200 opacity-50 rotate-1 tape"></div>
                <h2 className="font-hand text-2xl mb-4 text-blue-800 border-b-2 border-blue-400 pb-1 font-bold">分紅設定</h2>
                <div className="space-y-3 font-hand">
                    {settings.cuts.map((cut, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <span className="text-lg">{idx === 0 ? '隊長' : `成員 ${idx + 1}`}</span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleCutChange(idx, -5)}
                                    className="w-6 h-6 flex items-center justify-center bg-blue-200 rounded hover:bg-blue-300 transition-colors"
                                    disabled={cut <= 0}
                                >-</button>
                                <span className="w-10 text-center font-bold">{cut}%</span>
                                <button 
                                    onClick={() => handleCutChange(idx, 5)}
                                    className="w-6 h-6 flex items-center justify-center bg-blue-200 rounded hover:bg-blue-300 transition-colors"
                                    disabled={cutsSum >= 100 && idx !== 0}
                                >+</button>
                            </div>
                        </div>
                    ))}
                    {cutsSum !== 100 && (
                        <p className="text-red-500 text-xs mt-2 italic font-sans">總計必須為 100% (目前: {cutsSum}%)</p>
                    )}
                </div>
            </div>

        </div>

        {/* Middle Column: Loot Intel (The Map/Grid) */}
        <div className="lg:col-span-2">
            <div className="bg-gray-800/80 p-6 rounded-lg border-4 border-gray-600 relative backdrop-blur-sm shadow-2xl">
                <h2 className="font-hand text-3xl mb-6 text-center text-white border-b-2 border-gray-600 pb-2 inline-block w-full">偵察情報</h2>

                {/* Loot Input Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ZONES.map(zone => {
                        const isRestricted = settings.players === 1 && 
                            ['North Storage', 'South Storage', 'West Storage', 'Basement'].includes(zone) &&
                            zone !== 'Office' && zone !== 'Main Dock';

                        return (
                            <LootInput 
                                key={zone} 
                                zone={zone} 
                                lootCounts={lootCounts} 
                                onChange={handleLootChange}
                                disabled={isRestricted}
                            />
                        );
                    })}
                </div>
            </div>
        </div>

      </div>

      {/* Bottom Section: Results */}
      <div className="mt-8 flex justify-center">
        <ResultBoard 
            bags={calculatedBags} 
            settings={settings} 
            basePrimaryValue={selectedPrimaryValue} 
            wallSafeValue={wallSafeValue}
        />
      </div>

       <footer className="text-center mt-12 text-gray-500 text-sm font-hand">
            <p>Cayo Perico Heist Calculator &copy; 2026</p>
        </footer>
    </div>
  );
}
