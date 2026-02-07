import React, { useRef, useState } from 'react';
import { PlayerBag, PlayerSettings } from '@/lib/types';
import { BagProgressBar } from './BagProgressBar';
import { toPng, toBlob } from 'html-to-image';
import { Download, Copy, Check, Loader2 } from 'lucide-react';
import { translations, Language } from '@/lib/translations';
import { clsx } from 'clsx';

interface ResultBoardProps {
  bags: PlayerBag[];
  settings: PlayerSettings;
  basePrimaryValue?: number;
  wallSafeValue?: number;
  language: Language;
}

export const ResultBoard: React.FC<ResultBoardProps> = ({ bags, settings, basePrimaryValue = 0, wallSafeValue = 0, language }) => {
  const t = translations[language];
  const boardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Aggregate
  const secondaryTotal = bags.reduce((sum, bag) => sum + bag.totalValue, 0);
  
  // Calculate Primary with Hard Mode bonus
  const primaryValue = basePrimaryValue * (settings.hardMode ? 1.1 : 1.0);
  
  // Elite Bonus
  const elitePerPlayer = settings.hardMode ? 100000 : 50000;
  const eliteTotal = settings.eliteCommand ? elitePerPlayer * settings.players : 0;
  
  const grossTake = secondaryTotal + primaryValue + wallSafeValue;
  
  // Fees
  const fenceFee = (secondaryTotal + primaryValue) * 0.10;
  const pavelFee = (secondaryTotal + primaryValue) * 0.02;
  
  const totalDeductions = fenceFee + pavelFee;
  const splitPot = grossTake - totalDeductions;
  
  // Final calculation
  const totalWithElite = splitPot + eliteTotal;

  const handleDownloadImage = async () => {
    if (!boardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(boardRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        filter: (node) => !(node instanceof HTMLElement && node.classList.contains('export-ignore'))
      });
      const link = document.createElement('a');
      link.download = `Cayo-Perico-Total-${Math.round(totalWithElite)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
      alert(language === 'en' ? 'Export failed' : '圖片匯出失敗');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    if (!boardRef.current) return;
    setIsExporting(true);
    try {
      const blob = await toBlob(boardRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        filter: (node) => !(node instanceof HTMLElement && node.classList.contains('export-ignore'))
      });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy image:', err);
      alert(language === 'en' ? 'Copy failed' : '圖片複製失敗');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-green-100 text-gray-900 p-8 rounded shadow-2xl transform rotate-1 max-w-5xl w-full paper-texture relative border-2 border-green-200 transition-transform hover:scale-[1.01]" ref={boardRef}>
        {/* Export Buttons */}
        <div className="absolute top-4 right-4 flex gap-3 export-ignore z-20">
            <button 
                onClick={handleCopyImage}
                disabled={isExporting}
                title={copySuccess ? t.results.copySuccess : t.results.copyBtn}
                className={clsx(
                    "flex items-center justify-center transition-all disabled:opacity-50",
                    copySuccess ? "text-blue-600 scale-110" : "text-stone-400 hover:text-blue-600 hover:scale-110"
                )}
            >
                {isExporting ? <Loader2 className="animate-spin" size={18} /> : (copySuccess ? <Check size={20} /> : <Copy size={20} />)}
            </button>
            <button 
                onClick={handleDownloadImage}
                disabled={isExporting}
                title={t.results.downloadBtn}
                className="flex items-center justify-center text-stone-400 hover:text-green-600 hover:scale-110 transition-all disabled:opacity-50"
            >
                {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={20} />}
            </button>
        </div>

        {/* Tape */}
        <div className="absolute -top-4 w-64 h-12 bg-gray-300 opacity-40 rotate-1 left-1/2 transform -translate-x-1/2 tape"></div>

        <h2 className="font-hand text-4xl text-center mb-6 text-green-800 font-bold">{t.results.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-900">
            {/* Breakdown */}
            <div className="space-y-2 font-hand text-xl md:col-span-1">
                <div className="flex justify-between border-b border-green-300 pb-1">
                    <span>{t.results.primary}:</span>
                    <span className="font-bold">${Math.round(primaryValue).toLocaleString()}</span>
                </div>
                {wallSafeValue > 0 && (
                    <div className="flex justify-between border-b border-green-300 pb-1">
                        <span>{t.results.wallSafe}:</span>
                        <span className="font-bold">${wallSafeValue.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between border-b border-green-300 pb-1">
                    <span>{t.results.secondary}:</span>
                    <span className="font-bold">${Math.round(secondaryTotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-green-300 pb-1 text-green-700">
                    <span>{t.results.elite}:</span>
                    <span>{eliteTotal > 0 ? `+$${eliteTotal.toLocaleString()}` : '$0'}</span>
                </div>
                <div className="flex justify-between border-t-2 border-green-600 pt-2 font-bold text-2xl">
                    <span>{t.results.total}:</span>
                    <span>${Math.round(grossTake).toLocaleString()}</span>
                </div>
                
                <div className="pt-4 text-red-600 text-base space-y-1">
                    <div className="flex justify-between">
                        <span>{t.results.fence} (10%):</span>
                        <span>-${Math.round(fenceFee).toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>{t.results.pavel} (2%):</span>
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
                
                <h3 className="font-bold mb-2 text-green-800 border-b border-green-200 pb-1">{t.results.cutsHeader}</h3>
                <div className="space-y-2 text-lg">
                    {settings.cuts.map((cut, idx) => {
                        const playerCutValue = splitPot * (cut / 100);
                        const playerTotal = playerCutValue + (settings.eliteCommand ? elitePerPlayer : 0);
                        return (
                            <div key={idx} className="flex justify-between">
                                <span>{idx === 0 ? t.results.leader : `${t.results.member} ${idx + 1}`} ({cut}%):</span>
                                <span className="font-bold">${Math.round(playerTotal).toLocaleString()}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bag Recommendation */}
            <div className="md:col-span-1 p-4 bg-yellow-50 border-2 border-yellow-200 rounded dashed-border relative">
                 <h3 className="font-hand text-xl font-bold mb-3 text-yellow-800">💰 {t.results.recommendation}</h3>
                 <div className="space-y-3 font-hand pr-2">
                    {bags.map((bag, i) => (
                        <div key={i} className="bg-white p-2 rounded border border-gray-100 shadow-sm">
                            <div className="text-sm font-bold text-gray-500 mb-1">{language === 'en' ? `Player ${i + 1}` : `玩家 ${i + 1}`}</div>
                            <BagProgressBar bag={bag} playerIndex={i} simpleMode={true} language={language} />
                        </div>
                    ))}
                    {bags.length === 0 && <p className="text-gray-400 italic">{t.results.emptyBags}</p>}
                 </div>
            </div>
        </div>
    </div>
  );
};
