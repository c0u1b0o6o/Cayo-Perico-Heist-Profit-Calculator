import React from 'react';
import { Zone, LootType, LootCounts } from '@/lib/types';
import { Plus, Minus, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import { translations, Language } from '@/lib/translations';

interface LootInputProps {
  zone: Zone;
  lootCounts: LootCounts;
  onChange: (zone: Zone, type: LootType, delta: number) => void;
  disabled?: boolean;
  language: Language;
}

const ZONE_CONFIG: Record<Zone, LootType[]> = {
  MainDockL: ['Coke', 'Weed', 'Cash'],
  MainDockS: ['Coke', 'Weed', 'Cash'],
  NorthStorage: ['Gold', 'Cash', 'Painting'],
  SouthStorage: ['Gold', 'Cash', 'Painting'],
  WestStorage: ['Gold', 'Cash', 'Painting'],
  Basement: ['Gold', 'Cash', 'Painting'],
  Office: ['Painting'],
};

export const LootInput: React.FC<LootInputProps> = ({ zone, lootCounts, onChange, disabled, language }) => {
  const allowedLoot = ZONE_CONFIG[zone] || [];
  const t = translations[language];

  return (
    <div className={clsx(
      "relative p-4 rounded bg-stone-700/50 border border-stone-600 transition-all",
      disabled ? "opacity-50 cursor-not-allowed" : "hover:border-yellow-500/50 hover:bg-stone-700"
    )}>
      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 rounded">
          <Lock className="w-8 h-8 text-stone-500" />
        </div>
      )}
      
      {/* Tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-yellow-100/20 rotate-1 tape" />
      
      <h3 className="font-hand text-xl mb-4 text-yellow-500 tracking-wider text-center">
        {t.zones[zone] || zone}
      </h3>
      
      <div className="space-y-3">
        {allowedLoot.map((type) => {
          const count = lootCounts[zone]?.[type] || 0;
          
          return (
            <div key={type} className="flex items-center justify-between group">
              <span className="text-stone-300 font-hand text-lg">{t.loot[type] || type}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onChange(zone, type, -1)}
                  disabled={disabled || count <= 0}
                  className="w-8 h-8 flex items-center justify-center bg-stone-800 rounded text-stone-400 hover:text-red-400 hover:bg-stone-900 disabled:opacity-30 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold font-mono text-lg text-white">{count}</span>
                <button 
                  onClick={() => onChange(zone, type, 1)}
                  disabled={disabled}
                  className="w-8 h-8 flex items-center justify-center bg-stone-800 rounded text-stone-400 hover:text-green-400 hover:bg-stone-900 disabled:opacity-30 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
