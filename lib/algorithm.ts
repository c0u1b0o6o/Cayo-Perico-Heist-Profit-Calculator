import { LOOT_SPECS, LootCounts, PlayerBag, BagItem, LootType, Zone } from './types';

// Zones accessible only by 2+ players (Dual Keycards)
// Note: '大倉' and '小倉' are accessible solo and thus NOT in this list.
const RESTRICTED_ZONES: Zone[] = ['NorthStorage', 'SouthStorage', 'WestStorage', 'Basement'];
// Note: Basement also contains Primary Target, but here we refer to Secondary Loot piles in Basement Storage. 
// However, the input UI separates them. We need to be careful. 
// Usually 'Basement' input refers to the storage locker. Primary is separate.

export function calculateOptimalLoot(
  lootCounts: LootCounts,
  players: number
): PlayerBag[] {
  // 1. Flatten all available loot into a single pool based on access restrictions
  let lootPool: { type: LootType; value: number; weight: number; id: string }[] = [];
  
  Object.entries(lootCounts).forEach(([zone, counts]) => {
    // Solo Restriction Check
    if (players === 1 && RESTRICTED_ZONES.includes(zone as Zone)) {
      return; // Skip this zone
    }

    Object.entries(counts).forEach(([type, count]) => {
      const lootType = type as LootType;
      const spec = LOOT_SPECS[lootType];
      if (typeof count === 'number') {
          for (let i = 0; i < count; i++) {
            lootPool.push({ ...spec, id: `${zone}-${type}-${i}` });
          }
      }
    });
  });

  // 2. Initialize Bags
  const bags: PlayerBag[] = Array.from({ length: players }, () => ({
    items: [],
    totalValue: 0,
    totalWeight: 0,
  }));

  // 3. User Algorithm Priority: Gold > Coke > Weed > Painting (Conditional) > Cash
  // We will distribute loot to players cyclically or fill one by one?
  // Usually optimal is to fill all bags. Order doesn't matter for total value, 
  // but for "fairness" or simplicity, we can just fill sequentially or round-robin logic.
  // Since capacity is identical, pooling all capacity is easier, but we need individual bag compositions.
  
  // Strategy: Treat all players as one big container for high value items first?
  // No, discrete packing problem. But loot piles are splittable? 
  // In Cayo Perico, you can take partial piles. So it's a fractional knapsack problem (mostly).
  // If fractional, we just sort by Value/Weight Density.
  // Densities:
  // Gold: 332k / 66.6 = ~4985/1%
  // Coke: 222k / 50   = ~4453/1%
  // Weed: 146k / 37.5 = ~3901/1%
  // Paint:189k / 50   = ~3790/1%
  // Cash: 90k / 25    = ~3600/1%
  
  // The user's priority order (Gold > Coke > Weed > Paint > Cash) matches the density order!
  // EXCEPT Painting vs Weed. 
  // Weed Density: 3901
  // Painting Density: 3790
  // So Weed is actually better density. The user put Weed > Painting, which is correct mathematically.
  // But Painting has a weird chunk size (50%).
  
  // Implemenation: Fill bags using the User's Prioritized Steps.
  
  // Helper to find available items of type
  const takeItem = (type: LootType): { type: LootType; value: number; weight: number; id: string } | null => {
    const index = lootPool.findIndex((i) => i.type === type);
    if (index !== -1) {
      return lootPool.splice(index, 1)[0];
    }
    return null;
  };

  // We process each bag fully to mimic a player filling up.
  bags.forEach((bag) => {
    fillBag(bag, lootPool);
  });

  return bags;
}

function fillBag(bag: PlayerBag, pool: { type: LootType; value: number; weight: number; id: string }[]) {
  const CAP = 100;
  
  // Step 1: Gold
  while (bag.totalWeight < 99.9) {
    const gold = pool.find(i => i.type === 'Gold');
    if (!gold) break;
    addItem(bag, gold, pool);
  }

  // Step 2: Cocaine
  while (bag.totalWeight < 99.9) {
    const coke = pool.find(i => i.type === 'Coke');
    if (!coke) break;
    addItem(bag, coke, pool);
  }

  // At this point, Gold and Coke are done.
  // We simulate two routes for the remaining space.
  
  // Create deep clones for simulation
  const cloneBag = (b: PlayerBag): PlayerBag => ({
    items: b.items.map(item => ({ ...item })),
    totalValue: b.totalValue,
    totalWeight: b.totalWeight
  });
  const clonePool = (p: any[]) => p.map(i => ({ ...i }));

  // Route 1 Simulation
  const route1Bag = cloneBag(bag);
  const route1Pool = clonePool(pool);
  
  // 1. Fill all Weed
  while (route1Bag.totalWeight < 99.9) {
    const weed = route1Pool.find((i: any) => i.type === 'Weed');
    if (!weed) break;
    addItem(route1Bag, weed, route1Pool);
  }
  
  // 1a, 1b, 1c logic
  const spaceLeft = CAP - route1Bag.totalWeight;
  const paintingForR1 = route1Pool.find((i: any) => i.type === 'Painting');
  
  if (paintingForR1) {
    if (spaceLeft >= 51) {
      // 1a: Take painting + remaining loot (Gold/Coke already gone, so just Cash left)
      addItem(route1Bag, paintingForR1, route1Pool);
      // Fill gaps with Cash
      while (route1Bag.totalWeight < 99.9) {
        const cash = route1Pool.find((i: any) => i.type === 'Cash');
        if (!cash) break;
        addItem(route1Bag, cash, route1Pool);
      }
    } else if (Math.abs(spaceLeft - 50) < 0.1) {
      // 1b: Take painting
      addItem(route1Bag, paintingForR1, route1Pool);
    } else if (spaceLeft <= 49.9) {
      // 1c: Skip painting, just fill with Cash
      while (route1Bag.totalWeight < 99.9) {
        const cash = route1Pool.find((i: any) => i.type === 'Cash');
        if (!cash) break;
        addItem(route1Bag, cash, route1Pool);
      }
    }
  } else {
    // No painting, just fill with Cash anyway
    while (route1Bag.totalWeight < 99.9) {
      const cash = route1Pool.find((i: any) => i.type === 'Cash');
      if (!cash) break;
      addItem(route1Bag, cash, route1Pool);
    }
  }

  // Route 2 Simulation
  const route2Bag = cloneBag(bag);
  const route2Pool = clonePool(pool);
  
  // 1. Take Painting first (if available)
  const paintingForR2 = route2Pool.find((i: any) => i.type === 'Painting');
  if (paintingForR2) {
    addItem(route2Bag, paintingForR2, route2Pool);
  }
  
  // 2. Fill with remaining Weed
  while (route2Bag.totalWeight < 99.9) {
    const weed = route2Pool.find((i: any) => i.type === 'Weed');
    if (!weed) break;
    addItem(route2Bag, weed, route2Pool);
  }
  
  // 3. Fill gaps with Cash
  while (route2Bag.totalWeight < 99.9) {
    const cash = route2Pool.find((i: any) => i.type === 'Cash');
    if (!cash) break;
    addItem(route2Bag, cash, route2Pool);
  }

  // Compare and pick the best
  if (route2Bag.totalValue > route1Bag.totalValue) {
    // Route 2 is better
    bag.items = route2Bag.items;
    bag.totalValue = route2Bag.totalValue;
    bag.totalWeight = route2Bag.totalWeight;
    // Update the real pool (replace entirely since we removed items)
    pool.length = 0;
    route2Pool.forEach((i: any) => pool.push(i));
  } else {
    // Route 1 is better (or equal)
    bag.items = route1Bag.items;
    bag.totalValue = route1Bag.totalValue;
    bag.totalWeight = route1Bag.totalWeight;
    pool.length = 0;
    route1Pool.forEach((i: any) => pool.push(i));
  }

  // Final cleanup: Fill any micro-gaps if possible (should be empty by now)
  fillGapsWithPartials(bag, pool);
}

function addItem(bag: PlayerBag, item: { type: LootType; value: number; weight: number; id: string }, pool: any[]) {
    const space = 100 - bag.totalWeight;
    if (space <= 0.01) return;

    const idx = pool.findIndex((i:any) => i.id === item.id);
    if (idx > -1) pool.splice(idx, 1);

    if (item.weight <= space + 0.01) {
        bag.items.push({
            type: item.type,
            percentage: item.weight,
            value: item.value
        });
        bag.totalWeight += item.weight;
        bag.totalValue += item.value;
    } else {
        const ratio = space / item.weight;
        bag.items.push({
            type: item.type,
            percentage: space,
            value: item.value * ratio
        });
        bag.totalWeight += space;
        bag.totalValue += item.value * ratio;
        
        pool.push({
            ...item,
            id: item.id + "_rem",
            weight: item.weight - space,
            value: item.value * (1 - ratio)
        });
    }
}

function fillGapsWithPartials(bag: PlayerBag, pool: any[]) {
    pool.sort((a, b) => (b.value/b.weight) - (a.value/a.weight));
    while (bag.totalWeight < 99.9 && pool.length > 0) {
        const item = pool[0];
        addItem(bag, item, pool);
    }
}

