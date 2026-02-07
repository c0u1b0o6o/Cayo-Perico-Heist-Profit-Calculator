import React, { useRef, useState, useMemo, useEffect } from 'react';
import { PlayerBag, PlayerSettings, LootCounts, LOOT_SPECS, LootType } from '@/lib/types';
import { BagProgressBar } from './BagProgressBar';
import { toPng, toBlob } from 'html-to-image';
import { Download, Copy, Check, Loader2, Plus, Minus, AlertCircle, Info } from 'lucide-react';
import { translations, Language } from '@/lib/translations';
import { clsx } from 'clsx';

interface ManualResultBoardProps {
  bags: PlayerBag[];
  settings: PlayerSettings;
  basePrimaryValue?: number;
  wallSafeValue?: number;
  language: Language;
  lootCounts: LootCounts;
}

export const ManualResultBoard: React.FC<ManualResultBoardProps> = ({ 
    bags, 
    settings, 
    basePrimaryValue = 0, 
    wallSafeValue = 0, 
    language, 
    lootCounts 
}) => {
  const t = translations[language];
  const boardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Initialize manual bags from system bags
  const [manualBags, setManualBags] = useState<PlayerBag[]>(() => JSON.parse(JSON.stringify(bags)));

  // Sync manual bags if input bags change (e.g., player count or settings change)
  useEffect(() => {
    setManualBags(JSON.parse(JSON.stringify(bags)));
  }, [bags]);

  // --- CALCULATIONS ---
  const primaryValue = basePrimaryValue * (settings.hardMode ? 1.1 : 1.0);
  const elitePerPlayer = settings.hardMode ? 100000 : 50000;
  const eliteTotal = settings.eliteCommand ? elitePerPlayer * settings.players : 0;

  const secondaryTotal = manualBags.reduce((sum, bag) => sum + bag.totalValue, 0);
  const grossTake = secondaryTotal + primaryValue + wallSafeValue;
  const fenceFee = (secondaryTotal + primaryValue) * 0.10;
  const pavelFee = (secondaryTotal + primaryValue) * 0.02;
  const totalDeductions = fenceFee + pavelFee;
  const splitPot = grossTake - totalDeductions;
  const totalWithElite = splitPot + eliteTotal;

  // Available Pool
  const availablePool = useMemo(() => {
    const pool: Record<string, number> = {};
    Object.values(lootCounts).forEach(zone => {
      Object.entries(zone).forEach(([type, count]) => {
        pool[type] = (pool[type] || 0) + (count || 0);
      });
    });
    manualBags.forEach(bag => {
      bag.items.forEach(item => {
        const spec = LOOT_SPECS[item.type];
        const quantity = item.percentage / spec.weight;
        pool[item.type] = (pool[item.type] || 0) - quantity;
      });
    });
    Object.keys(pool).forEach(key => {
      if (pool[key] < 0.001) pool[key] = 0;
    });
    return pool;
  }, [lootCounts, manualBags]);

  const handleManualAdjust = (playerIdx: number, type: LootType, delta: number) => {
    const newBags = JSON.parse(JSON.stringify(manualBags));
    const bag = newBags[playerIdx];
    const spec = LOOT_SPECS[type];

    if (delta > 0) {
      const available = availablePool[type] || 0;
      if (available <= 0) return;
      const amountToAdd = Math.min(1, available);
      const weightToAdd = amountToAdd * spec.weight;
      const existingItem = bag.items.find((i: any) => i.type === type);
      if (existingItem) {
        existingItem.percentage += weightToAdd;
        existingItem.value += spec.value * amountToAdd;
      } else {
        bag.items.push({ type, percentage: weightToAdd, value: spec.value * amountToAdd });
      }
      bag.totalWeight += weightToAdd;
      bag.totalValue += spec.value * amountToAdd;
    } else {
      const itemIdx = bag.items.findIndex((i: any) => i.type === type);
      if (itemIdx === -1) return;
      const item = bag.items[itemIdx];
      const amountToRemove = Math.min(1, item.percentage / spec.weight);
      const weightToRemove = amountToRemove * spec.weight;
      item.percentage -= weightToRemove;
      item.value -= spec.value * amountToRemove;
      bag.totalValue -= spec.value * amountToRemove;
      bag.totalWeight -= weightToRemove;
      if (item.percentage <= 0.001) {
        bag.items.splice(itemIdx, 1);
      }
    }
    setManualBags(newBags);
  };

  const handleDownloadImage = async () => {
    if (!boardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(boardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `Manual-Pot-${Math.round(totalWithElite)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    if (!boardRef.current) return;
    setIsExporting(true);
    try {
      const blob = await toBlob(boardRef.current, { cacheBust: true, pixelRatio: 2 });
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-blue-100 text-gray-900 p-6 sm:p-8 rounded shadow-2xl transform rotate-[-0.5deg] max-w-6xl w-full paper-texture relative border-2 border-blue-200 transition-all hover:rotate-0" ref={boardRef}>
        <div className="absolute top-4 right-4 flex gap-3 export-ignore z-20">
            <button onClick={handleCopyImage} className={clsx("text-stone-400 hover:text-blue-600 transition-all", copySuccess && "text-blue-600")}><Copy size={18} /></button>
            <button onClick={handleDownloadImage} className="text-stone-400 hover:text-green-600 transition-all"><Download size={18} /></button>
        </div>

        <div className="absolute -top-4 w-64 h-12 bg-blue-300 opacity-40 rotate-[-1deg] left-1/2 transform -translate-x-1/2 tape"></div>
        <h2 className="font-hand text-4xl text-center mb-8 text-blue-800 font-bold underline decoration-blue-300/50 underline-offset-8 decoration-wavy">{t.results.manualTitle}</h2>

        <div className="flex flex-col gap-8">
            {/* TOP SECTION: Manual Loot Adjuster (Orange/Yellow theme) */}
            <div className="p-6 bg-orange-50/50 border-2 border-orange-200 rounded-xl dashed-border shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="font-hand text-2xl font-bold text-orange-800 flex items-center gap-3">
                        <span className="bg-orange-200 p-2 rounded-xl shadow-inner">🔧</span> {t.results.manualTitle}
                    </h3>
                    
                    {/* Pool Status (Inline for top layout) */}
                    <div className="bg-white/90 p-3 rounded-xl border border-orange-100 shadow-sm flex-grow md:max-w-md">
                        <div className="text-[10px] text-orange-700 font-black uppercase mb-2 flex items-center gap-1">
                             <span className="opacity-50">#</span> {t.results.availablePool}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {(Object.keys(LOOT_SPECS) as LootType[]).map(type => {
                                const avail = availablePool[type] || 0;
                                if (avail <= 0.01) return null;
                                return (
                                    <div key={type} className="flex items-center bg-orange-100/50 px-2 py-1 rounded-lg text-[10px] border border-orange-200 hover:scale-105 transition-transform">
                                        <span className="font-bold mr-1 text-orange-900">{t.loot[type]}</span>
                                        <span className="bg-orange-800 text-white px-1.5 rounded-md font-black">x{avail.toFixed(1)}</span>
                                    </div>
                                );
                            })}
                            {Object.values(availablePool).every(v => v <= 0.01) && <span className="text-[10px] text-stone-400 italic">No items left</span>}
                        </div>
                    </div>
                </div>

                {/* Player Bags Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-hand">
                    {manualBags.map((bag, i) => (
                        <div key={i} className={clsx(
                            "p-4 rounded-2xl border transition-all shadow-sm flex flex-col", 
                            bag.totalWeight > 100.1 ? "border-red-400 bg-red-50/50 ring-2 ring-red-100" : "bg-white/95 border-orange-100 hover:border-orange-200"
                        )}>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{language === 'en' ? `PLAYER ${i+1}` : `玩家 ${i+1}`}</span>
                                {bag.totalWeight > 100.1 && <AlertCircle size={14} className="text-red-500 animate-bounce" />}
                            </div>
                            
                            <div className="mb-4">
                                <BagProgressBar bag={bag} playerIndex={i} simpleMode={true} language={language} />
                                {bag.totalWeight > 100.1 && <div className="text-[10px] text-red-500 font-black mt-2 text-center uppercase">{t.results.capacityWarning}</div>}
                            </div>

                            <div className="mt-auto grid grid-cols-5 gap-1.5 border-t border-dotted border-gray-200 pt-4">
                                {(Object.keys(LOOT_SPECS) as LootType[]).map(type => (
                                    <div key={type} className="flex flex-col items-center">
                                        <div className="text-[9px] text-stone-400 font-black mb-1.5">{t.loot[type].slice(0, 2)}</div>
                                        <div className="flex flex-col gap-1.5">
                                            <button 
                                                onClick={() => handleManualAdjust(i, type, 1)} 
                                                disabled={(availablePool[type] || 0) <= 0} 
                                                className="p-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg border border-green-100 disabled:opacity-10 active:scale-90 transition-all"
                                            >
                                                <Plus size={10} />
                                            </button>
                                            <button 
                                                onClick={() => handleManualAdjust(i, type, -1)} 
                                                disabled={!bag.items.find(item => item.type === type)} 
                                                className="p-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-100 disabled:opacity-10 active:scale-90 transition-all"
                                            >
                                                <Minus size={10} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* BOTTOM SECTION: Calculations (Blue theme) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Financial Breakdown */}
                <div className="space-y-3 font-hand text-xl bg-white/30 p-6 rounded-2xl border-2 border-blue-200/50">
                    <h3 className="text-xs font-sans font-black uppercase text-blue-700 tracking-widest mb-4 flex items-center gap-2">
                        <Info size={16} /> Manuel Calc
                    </h3>
                    <div className="flex justify-between border-b border-blue-200 pb-1 pt-2"><span>{t.results.primary}:</span><span className="font-bold">${Math.round(primaryValue).toLocaleString()}</span></div>
                    {wallSafeValue > 0 && <div className="flex justify-between border-b border-blue-200 pb-1 pt-1"><span>{t.results.wallSafe}:</span><span className="font-bold">${wallSafeValue.toLocaleString()}</span></div>}
                    <div className="flex justify-between border-b border-blue-200 pb-1 pt-1"><span>{t.results.secondary}:</span><span className="font-bold">${Math.round(secondaryTotal).toLocaleString()}</span></div>
                    <div className="flex justify-between border-b border-blue-200 pb-1 pt-1 text-blue-600 italic"><span>{t.results.elite}:</span><span>+{eliteTotal.toLocaleString()}</span></div>
                    
                    <div className="pt-4 text-red-600 text-[11px] space-y-1 opacity-80 font-sans font-bold">
                        <div className="flex justify-between"><span>Fence Fee (10%):</span><span>-${Math.round(fenceFee).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Pavel Cut (2%):</span><span>-${Math.round(pavelFee).toLocaleString()}</span></div>
                    </div>

                    <div className="flex justify-between border-t-2 border-blue-600 pt-4 mt-2 font-bold text-3xl text-blue-900">
                        <span>Total:</span>
                        <span>${Math.round(grossTake).toLocaleString()}</span>
                    </div>
                </div>

                {/* Final Take & Cuts */}
                <div className="bg-white/60 p-8 rounded-2xl border-2 border-blue-200 font-hand flex flex-col items-center justify-center shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rotate-45 transform translate-x-12 -translate-y-12"></div>
                    <div className="text-center mb-8 relative z-10 w-full">
                        <div className="text-[12px] text-blue-600 font-sans font-black uppercase tracking-[0.3em] mb-2 opacity-60">Final Manuel Take</div>
                        <div className="text-5xl font-bold text-blue-900 drop-shadow-sm tabular-nums transition-transform group-hover:scale-105">
                            ${Math.round(totalWithElite).toLocaleString()}
                        </div>
                    </div>
                    
                    <div className="w-full space-y-3 relative z-10 bg-white/40 p-5 rounded-xl border border-blue-50">
                        <h4 className="text-[10px] font-sans font-black text-blue-800 uppercase tracking-widest border-b border-blue-100 pb-2 mb-3">Player Payouts</h4>
                        {settings.cuts.map((cut, idx) => {
                            const playerCutValue = splitPot * (cut / 100);
                            const playerTotal = playerCutValue + (settings.eliteCommand ? elitePerPlayer : 0);
                            return (
                                <div key={idx} className="flex justify-between items-center text-lg">
                                    <span className="text-stone-500 font-bold">{idx === 0 ? "LEADER" : `MEMBER ${idx + 1}`} ({cut}%):</span>
                                    <span className="font-bold tabular-nums text-blue-900 drop-shadow-sm">${Math.round(playerTotal).toLocaleString()}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
