import React from 'react';
import { PlayerBag, PlayerSettings } from '@/lib/types';
import { BagProgressBar } from './BagProgressBar';

interface ResultBoardProps {
  bags: PlayerBag[];
  settings: PlayerSettings;
  basePrimaryValue?: number;
  wallSafeValue?: number;
}

export const ResultBoard: React.FC<ResultBoardProps> = ({ bags, settings, basePrimaryValue = 0, wallSafeValue = 0 }) => {
  // Aggregate
  const secondaryTotal = bags.reduce((sum, bag) => sum + bag.totalValue, 0);
  
  // Calculate Primary with Hard Mode bonus
  const primaryValue = basePrimaryValue * (settings.hardMode ? 1.1 : 1.0);
  
  // Elite Bonus
  const elitePerPlayer = settings.hardMode ? 100000 : 50000;
  const eliteTotal = settings.eliteCommand ? elitePerPlayer * settings.players : 0;
  
  const grossTake = secondaryTotal + primaryValue + wallSafeValue;
  
  // Fees
  const fenceFee = (secondaryTotal + primaryValue) * 0.10; // Wall safe usually not fenced? 
  // Actually, fence fee is 10% of TOTAL secondary + primary. Wall safe is clean cash?
  // Let's assume wall safe is NOT subject to fence fee (it's personal office money).
  const pavelFee = (secondaryTotal + primaryValue) * 0.02; // Pavel cut also usually on heist take.
  
  const totalDeductions = fenceFee + pavelFee;
  
  const splitPot = grossTake - totalDeductions;
  
  // Final calculation
  const totalWithElite = splitPot + eliteTotal;
  const perPlayer = totalWithElite / settings.players;

  return (
    <div className="bg-green-100 text-gray-900 p-8 rounded shadow-2xl transform rotate-1 max-w-5xl w-full paper-texture relative border-2 border-green-200 transition-transform hover:scale-[1.01]">
        {/* Tape */}
        <div className="absolute -top-4 w-64 h-12 bg-gray-300 opacity-40 rotate-1 left-1/2 transform -translate-x-1/2 tape"></div>

        <h2 className="font-hand text-4xl text-center mb-6 text-green-800 font-bold">最終分紅計算</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-900">
            {/* Breakdown */}
            <div className="space-y-2 font-hand text-xl md:col-span-1">
                <div className="flex justify-between border-b border-green-300 pb-1">
                    <span>主要目標:</span>
                    <span className="font-bold">${Math.round(primaryValue).toLocaleString()}</span>
                </div>
                {wallSafeValue > 0 && (
                    <div className="flex justify-between border-b border-green-300 pb-1">
                        <span>保險箱:</span>
                        <span className="font-bold">${wallSafeValue.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between border-b border-green-300 pb-1">
                    <span>次要財物:</span>
                    <span className="font-bold">${Math.round(secondaryTotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-green-300 pb-1 text-green-700">
                    <span>精英挑戰:</span>
                    <span>{eliteTotal > 0 ? `+$${eliteTotal.toLocaleString()}` : '$0'}</span>
                </div>
                <div className="flex justify-between border-t-2 border-green-600 pt-2 font-bold text-2xl">
                    <span>總收入:</span>
                    <span>${Math.round(grossTake).toLocaleString()}</span>
                </div>
                
                <div className="pt-4 text-red-600 text-base space-y-1">
                    <div className="flex justify-between">
                        <span>洗錢費用 (10%):</span>
                        <span>-${Math.round(fenceFee).toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>派沃分紅 (2%):</span>
                        <span>-${Math.round(pavelFee).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Final & Cuts */}
            <div className="md:col-span-1 bg-green-50 p-4 rounded border border-green-200 font-hand flex flex-col justify-center">
                <div className="text-center mb-6">
                    <div className="text-sm text-gray-600 font-sans mb-1 uppercase tracking-widest">Potential Take</div>
                    <span className="text-4xl font-bold text-green-900 drop-shadow-sm">
                        ${Math.round(totalWithElite).toLocaleString()}
                    </span>
                </div>
                
                <h3 className="font-bold mb-2 text-green-800 border-b border-green-200 pb-1">成員預估分紅:</h3>
                <div className="space-y-2 text-lg">
                    {settings.cuts.map((cut, idx) => {
                        const playerCutValue = splitPot * (cut / 100);
                        const playerTotal = playerCutValue + (settings.eliteCommand ? elitePerPlayer : 0);
                        return (
                            <div key={idx} className="flex justify-between">
                                <span>{idx === 0 ? '隊長' : `成員 ${idx + 1}`} ({cut}%):</span>
                                <span className="font-bold">${Math.round(playerTotal).toLocaleString()}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bag Recommendation */}
            <div className="md:col-span-1 p-4 bg-yellow-50 border-2 border-yellow-200 rounded dashed-border relative">
                 <h3 className="font-hand text-xl font-bold mb-3 text-yellow-800">💰 建議拿取清單</h3>
                 <div className="space-y-3 font-hand overflow-y-auto max-h-[250px] pr-2 scrollbar-thin">
                    {bags.map((bag, i) => (
                        <div key={i} className="bg-white p-2 rounded border border-gray-100 shadow-sm">
                            <div className="text-sm font-bold text-gray-500 mb-1">玩家 {i + 1}</div>
                            <BagProgressBar bag={bag} playerIndex={i} simpleMode={true} />
                        </div>
                    ))}
                    {bags.length === 0 && <p className="text-gray-400 italic">尚無資料...</p>}
                 </div>
            </div>
        </div>

    </div>
  );
};
