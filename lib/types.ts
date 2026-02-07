export type LootType = "Gold" | "Coke" | "Weed" | "Painting" | "Cash";

export type Zone =
  | "MainDockL"
  | "MainDockS"
  | "NorthStorage"
  | "SouthStorage"
  | "WestStorage"
  | "Basement"
  | "Office";

export interface LootItem {
  type: LootType;
  value: number;
  weight: number; // Percentage 0-100
}

export const LOOT_SPECS: Record<LootType, LootItem> = {
  Gold: { type: "Gold", value: 330000, weight: 66.67 },
  Coke: { type: "Coke", value: 223000, weight: 50 },
  Weed: { type: "Weed", value: 148000, weight: 37.5 },
  Painting: { type: "Painting", value: 185000, weight: 50 },
  Cash: { type: "Cash", value: 90000, weight: 25 }, // Average of ~88k-92k
};

export interface LootCounts {
  [zone: string]: {
    [type in LootType]?: number;
  };
}

export interface PlayerSettings {
  players: number;
  hardMode: boolean;
  eliteCommand: boolean;
  cuts: number[];
}

export interface BagItem {
  type: LootType;
  percentage: number; // Amount of this item taken (e.g., 66.67 for full pile, or partial)
  value: number;
}

export interface PlayerBag {
  items: BagItem[];
  totalValue: number;
  totalWeight: number;
}
