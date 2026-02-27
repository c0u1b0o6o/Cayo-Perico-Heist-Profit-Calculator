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

  // 1. Flatten all available loot into a summary based on access restrictions
  const availableLoot: { type: LootType; count: number }[] = [];
  const typeCounts: Record<LootType, number> = {
    Gold: 0,
    Coke: 0,
    Weed: 0,
    Painting: 0,
    Cash: 0,
  };

  Object.entries(lootCounts).forEach(([zone, counts]) => {
    // Solo Restriction Check
    if (players === 1 && RESTRICTED_ZONES.includes(zone as Zone)) {
      return; // Skip this zone
    }

    Object.entries(counts).forEach(([type, count]) => {
      const lootType = type as LootType;
      if (typeof count === 'number') {
        typeCounts[lootType] += count;
      }
    });
  });

  Object.entries(typeCounts).forEach(([type, count]) => {
    availableLoot.push({ type: type as LootType, count });
  });

  let maxPaintings = typeCounts['Painting'] || 0;

  // 流動物品池 (排除畫作)，並依照「單位體積價值 (Density)」由高到低排序
  const fluidLootPool = (Object.keys(LOOT_SPECS) as LootType[])
    .filter((type) => type !== 'Painting')
    .map((type) => ({
      ...LOOT_SPECS[type],
      count: typeCounts[type] || 0,
      density: (LOOT_SPECS[type].value * valueMultiplier) / LOOT_SPECS[type].weight,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.density - a.density); // 密度高的優先拿

  let bestGlobalValue = 0;
  let bestGlobalBags: PlayerBag[] = Array.from({ length: players }, () => ({
    items: [],
    totalWeight: 0,
    totalValue: 0,
  }));

  // 1. 生成所有可能的「畫作分配組合」
  // 每個玩家可以拿 0, 1, 或 2 幅畫。我們使用遞迴找出所有合法組合。
  const allPaintingDistributions: number[][] = [];
  function distributePaintings(playerIndex: number, currentDist: number[], paintingsLeft: number) {
    if (playerIndex === players) {
      allPaintingDistributions.push([...currentDist]);
      return;
    }
    // 該玩家拿 0, 1, 或 2 幅畫 (每幅佔 50%)
    for (let p = 0; p <= 2; p++) {
      if (p <= paintingsLeft) {
        currentDist.push(p);
        distributePaintings(playerIndex + 1, currentDist, paintingsLeft - p);
        currentDist.pop();
      }
    }
  }
  distributePaintings(0, [], maxPaintings);

  // 2. 測試每一種畫作分配組合，看哪種能配出最高總價值
  for (const distribution of allPaintingDistributions) {
    const currentBags: PlayerBag[] = Array.from({ length: players }, () => ({
      items: [],
      totalWeight: 0,
      totalValue: 0,
    }));

    // 先將畫作放入玩家背包
    let currentTotalValue = 0;
    distribution.forEach((paintings, i) => {
      if (paintings > 0) {
        const weight = paintings * LOOT_SPECS['Painting'].weight;
        const val = paintings * (LOOT_SPECS['Painting'].value * valueMultiplier);
        currentBags[i].items.push({
          type: 'Painting',
          percentage: weight,
          value: val,
        });
        currentBags[i].totalWeight += weight;
        currentBags[i].totalValue += val;
        currentTotalValue += val;
      }
    });

    // 計算所有玩家剩下的「總流體空間」
    let remainingCapacities = currentBags.map((b) => 100 - b.totalWeight);
    let totalFluidCapacity = remainingCapacities.reduce((a, b) => a + b, 0);

    // 複製一份流體物品池來進行模擬抓取
    const pool = fluidLootPool.map((item) => ({ ...item }));

    // 3. 貪婪地將流體物品填入剩餘的總空間中
    const fluidGrabs: { type: LootType; weightTaken: number; value: number }[] = [];

    for (const item of pool) {
      if (totalFluidCapacity <= 0.01) break; // 空間已滿
      if (item.count <= 0) continue;

      const totalItemWeight = item.weight * item.count;
      const weightToTake = Math.min(totalFluidCapacity, totalItemWeight);

      const tablesTaken = weightToTake / item.weight;
      const valTaken = tablesTaken * (item.value * valueMultiplier);

      fluidGrabs.push({ type: item.type, weightTaken: weightToTake, value: valTaken });

      totalFluidCapacity -= weightToTake;
      currentTotalValue += valTaken;
    }

    // 4. 將抓取到的流體物品「實體化」分配回各個玩家有空位的背包中 (用於 UI 顯示)
    let grabIndex = 0;
    for (let i = 0; i < players; i++) {
      while (remainingCapacities[i] > 0.01 && grabIndex < fluidGrabs.length) {
        const grab = fluidGrabs[grabIndex];
        if (grab.weightTaken <= 0.01) {
          grabIndex++;
          continue;
        }

        const space = remainingCapacities[i];
        const takeWeight = Math.min(space, grab.weightTaken);
        const ratio = takeWeight / grab.weightTaken;
        const valueToTake = grab.value * ratio;

        currentBags[i].items.push({
          type: grab.type,
          percentage: takeWeight,
          value: valueToTake,
        });

        currentBags[i].totalWeight += takeWeight;
        currentBags[i].totalValue += valueToTake;

        grab.weightTaken -= takeWeight;
        grab.value -= valueToTake;
        remainingCapacities[i] -= takeWeight;
      }
    }

    // 5. 比較是否為目前最佳解
    if (currentTotalValue > bestGlobalValue + 0.01) {
      bestGlobalValue = currentTotalValue;
      bestGlobalBags = JSON.parse(JSON.stringify(currentBags));
    }
  }

  return bestGlobalBags;
}


