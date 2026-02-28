import { LOOT_SPECS, LootCounts, PlayerBag, BagItem, LootType, Zone } from './types';

// Zones accessible only by 2+ players (Dual Keycards)
// Note: '大倉' and '小倉' are accessible solo and thus NOT in this list.
const RESTRICTED_ZONES: Zone[] = ['NorthStorage', 'SouthStorage', 'WestStorage', 'Basement'];
// Note: Basement also contains Primary Target, but here we refer to Secondary Loot piles in Basement Storage. 
// However, the input UI separates them. We need to be careful. 
// Usually 'Basement' input refers to the storage locker. Primary is separate.

export function calculateOptimalLoot(
  lootCounts: LootCounts,
  players: number,
  isHardMode: boolean = false
): PlayerBag[] {
  const valueMultiplier = isHardMode ? 1.1 : 1.0;

  // 1. Organize loot by type and zone
  const pilesByType: Record<LootType, { zone: Zone; count: number }[]> = {
    Gold: [],
    Coke: [],
    Weed: [],
    Painting: [],
    Cash: [],
  };

  const typeTotalCounts: Record<LootType, number> = {
    Gold: 0,
    Coke: 0,
    Weed: 0,
    Painting: 0,
    Cash: 0,
  };

  // Deterministically sort zones to ensure consistent results
  const sortedZones = (Object.keys(lootCounts) as Zone[]).sort();

  sortedZones.forEach((zone) => {
    // Solo Restriction Check
    if (players === 1 && RESTRICTED_ZONES.includes(zone)) {
      return;
    }

    const counts = lootCounts[zone];
    Object.entries(counts).forEach(([type, count]) => {
      const lootType = type as LootType;
      if (typeof count === 'number' && count > 0) {
        pilesByType[lootType].push({ zone, count });
        typeTotalCounts[lootType] += count;
      }
    });
  });

  let maxPaintings = typeTotalCounts['Painting'] || 0;

  // 流動物品池 (排除畫作)，並依照「單位體積價值 (Density)」由高到低排序
  const fluidLootPool = (Object.keys(LOOT_SPECS) as LootType[])
    .filter((type) => type !== 'Painting')
    .map((type) => ({
      ...LOOT_SPECS[type],
      count: typeTotalCounts[type] || 0,
      density: (LOOT_SPECS[type].value * valueMultiplier) / LOOT_SPECS[type].weight,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.density - a.density);

  let bestGlobalValue = 0;
  let bestGlobalBags: PlayerBag[] = Array.from({ length: players }, () => ({
    items: [],
    totalWeight: 0,
    totalValue: 0,
  }));

  // 1. 生成所有可能的「畫作分配組合」
  const allPaintingDistributions: number[][] = [];
  function distributePaintings(playerIndex: number, currentDist: number[], paintingsLeft: number) {
    if (playerIndex === players) {
      allPaintingDistributions.push([...currentDist]);
      return;
    }
    for (let p = 0; p <= 2; p++) {
      if (p <= paintingsLeft) {
        currentDist.push(p);
        distributePaintings(playerIndex + 1, currentDist, paintingsLeft - p);
        currentDist.pop();
      }
    }
  }
  distributePaintings(0, [], maxPaintings);

  // 2. 測試每一種畫作分配組合
  for (const distribution of allPaintingDistributions) {
    const currentBags: PlayerBag[] = Array.from({ length: players }, () => ({
      items: [],
      totalWeight: 0,
      totalValue: 0,
    }));

    // Deep copy available piles for this simulation
    const availablePiles = JSON.parse(JSON.stringify(pilesByType));

    // 先將畫作放入玩家背包
    let currentTotalValue = 0;
    distribution.forEach((paintings, i) => {
      let paintingsToTake = paintings;
      while (paintingsToTake > 0 && availablePiles['Painting'].length > 0) {
        const pile = availablePiles['Painting'][0];
        const count = Math.min(paintingsToTake, pile.count);
        
        const weight = count * LOOT_SPECS['Painting'].weight;
        const val = count * (LOOT_SPECS['Painting'].value * valueMultiplier);
        
        currentBags[i].items.push({
          type: 'Painting',
          percentage: weight,
          value: val,
          zone: pile.zone,
        });
        currentBags[i].totalWeight += weight;
        currentBags[i].totalValue += val;
        currentTotalValue += val;

        pile.count -= count;
        paintingsToTake -= count;
        if (pile.count <= 0) availablePiles['Painting'].shift();
      }
    });

    let remainingCapacities = currentBags.map((b) => 100 - b.totalWeight);
    let totalFluidCapacity = remainingCapacities.reduce((a, b) => a + b, 0);

    // 3. 貪婪地模擬流體物品抓取量
    const fluidGrabs: { type: LootType; weightTaken: number; value: number }[] = [];
    const pool = fluidLootPool.map((item) => ({ ...item }));

    for (const item of pool) {
      if (totalFluidCapacity <= 0.01) break;
      if (item.count <= 0) continue;

      const totalItemWeight = item.weight * item.count;
      const weightToTake = Math.min(totalFluidCapacity, totalItemWeight);
      const tablesTaken = weightToTake / item.weight;
      const valTaken = tablesTaken * (item.value * valueMultiplier);

      fluidGrabs.push({ type: item.type, weightTaken: weightToTake, value: valTaken });
      totalFluidCapacity -= weightToTake;
      currentTotalValue += valTaken;
    }

    // 4. 將抓取到的流體物品分配回玩家背包，並關聯區域
    let grabIndex = 0;
    for (let i = 0; i < players; i++) {
      while (remainingCapacities[i] > 0.01 && grabIndex < fluidGrabs.length) {
        const grab = fluidGrabs[grabIndex];
        if (grab.weightTaken <= 0.01) {
          grabIndex++;
          continue;
        }

        const space = remainingCapacities[i];
        let takeWeight = Math.min(space, grab.weightTaken);
        
        // Consume from availablePiles for this type and assign zones
        let weightToDistribute = takeWeight;
        while (weightToDistribute > 0.01 && availablePiles[grab.type].length > 0) {
          const pile = availablePiles[grab.type][0];
          const pileWeight = pile.count * LOOT_SPECS[grab.type].weight;
          const currentTake = Math.min(weightToDistribute, pileWeight);
          
          const ratio = currentTake / pileWeight;
          const valueToTake = (pile.count * LOOT_SPECS[grab.type].value * valueMultiplier) * ratio;

          currentBags[i].items.push({
            type: grab.type,
            percentage: currentTake,
            value: valueToTake,
            zone: pile.zone,
          });

          currentBags[i].totalWeight += currentTake;
          currentBags[i].totalValue += valueToTake;

          pile.count -= (currentTake / LOOT_SPECS[grab.type].weight);
          weightToDistribute -= currentTake;
          grab.weightTaken -= currentTake;
          grab.value -= valueToTake;
          remainingCapacities[i] -= currentTake;

          if (pile.count <= 0.01) availablePiles[grab.type].shift();
        }
        
        if (weightToDistribute > 0.01) {
          // This should ideally not happen if logic is correct
          grabIndex++;
        }
      }
    }

    if (currentTotalValue > bestGlobalValue + 0.01) {
      bestGlobalValue = currentTotalValue;
      bestGlobalBags = JSON.parse(JSON.stringify(currentBags));
    }
  }

  return bestGlobalBags;
}


