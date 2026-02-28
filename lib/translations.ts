export type Language = 'en' | 'tw' | 'cn';

export interface Translation {
  title: string;
  settings: {
    title: string;
    players: string;
    target: string;
    elite: string;
    eliteDesc: string;
    cuts: string;
    cutsNote: string;
    targetValue: string;
    wallSafe: string;
  };
  nav: {
    prep: string;
    results: string;
    data: string;
    contact: string;
    reset: string;
  };
  zones: {
    MainDockL: string;
    MainDockS: string;
    NorthStorage: string;
    SouthStorage: string;
    WestStorage: string;
    Basement: string;
    Office: string;
  };
  loot: {
    Gold: string;
    Coke: string;
    Weed: string;
    Painting: string;
    Cash: string;
    'Madrazo Files': string;
    'Sinsimito Tequila': string;
    'Ruby Necklace': string;
    'Bearer Bonds': string;
    'Pink Diamond': string;
    'Panther Statue': string;
  } & Record<string, string>;
  intel: {
    title: string;
    restricted: string;
  };
  summary: {
    title: string;
    empty: string;
    footer: string;
  };
  results: {
    title: string;
    primary: string;
    secondary: string;
    wallSafe: string;
    elite: string;
    total: string;
    pavel: string;
    fence: string;
    cutsHeader: string;
    leader: string;
    member: string;
    recommendation: string;
    manualTitle: string;
    availablePool: string;
    capacityWarning: string;
    emptyBags: string;
    copyBtn: string;
    copySuccess: string;
    downloadBtn: string;
    manualFinancialBreakdown: string;
    finalManualTake: string;
    payouts: string;
    zoneStats: string;
    pTitle: string;
    playerSummary: string;
  };
  data: {
    primaryTitle: string;
    lootName: string;
    primaryNormal: string;
    primaryHard: string;
    lootTable: string;
    valuePerPile: string;
    weightPerPile: string;
    valuePerFullBag: string;
    notes: string;
    note1: string;
    note2: string;
    note3: string;
  };
  contact: {
    title: string;
    role: string;
    status: string;
    location: string;
    roleValue: string;
    statusValue: string;
    locationValue: string;
    authOnly: string;
    intelTitle: string;
    systemTitle: string;
    version: string;
    lastUpdated: string;
    serverStatus: string;
    secureConnection: string;
    stamp: string;
    bio: string;
    feedback: string;
    feedbackDesc: string;
  };
}

export const translations: Record<Language, Translation> = {
  en: {
    title: "Cayo Perico Heist Calculator",
    settings: {
      title: "Heist Settings",
      players: "Players",
      target: "Primary Target",
      elite: "Elite Challenge",
      eliteDesc: "+$100k (Solo) / +$50k (Multi)",
      cuts: "Cuts Percentage (%)",
      cutsNote: "Total must be 100%",
      targetValue: "Target Value",
      wallSafe: "Office Wall Safe",
    },
    nav: {
      prep: "Prep Data",
      results: "Final Results",
      data: "Basic Data",
      contact: "Contact Dev",
      reset: "Reset Data",
    },
    zones: {

      MainDockL: "Main Dock (L)",
      MainDockS: "Main Dock (S)",
      NorthStorage: "North Storage",
      SouthStorage: "South Storage",
      WestStorage: "West Storage",
      Basement: "Basement",
      Office: "Office",
    },
    loot: {
      Gold: "Gold",
      Coke: "Cocaine",
      Weed: "Weed",
      Painting: "Painting",
      Cash: "Cash",
      'Madrazo Files': "Madrazo Files",
      'Sinsimito Tequila': "Sinsimito Tequila",
      'Ruby Necklace': "Ruby Necklace",
      'Bearer Bonds': "Bearer Bonds",
      'Pink Diamond': "Pink Diamond",
      'Panther Statue': "Panther Statue",
    },
    intel: {
      title: "Scouted Intel",
      restricted: "Restricted (Multiplayer only)",
    },
    summary: {
      title: "Intelligence Summary",
      empty: "No data scouted yet",
      footer: "Total secondary loot scanned",
    },
    results: {
      title: "Final Profit Breakdown",
      primary: "Primary Target",
      secondary: "Secondary Loot",
      wallSafe: "Wall Safe",
      elite: "Elite Challenge",
      total: "Total Gross",
      pavel: "Pavel Cut",
      fence: "Fence Fee",
      cutsHeader: "Estimated Cuts:",
      leader: "Leader",
      member: "Member",
      recommendation: "System Recommended (Optimal)",
      manualTitle: "Manual Adjustment Calculator",
      availablePool: "Available Loot Pool",
      capacityWarning: "Bag Overweight!",
      emptyBags: "No data...",
      copyBtn: "Copy Image",
      copySuccess: "Copied to clipboard",
      downloadBtn: "Download Image",
      manualFinancialBreakdown: "Manual Financial Breakdown",
      finalManualTake: "Final Manual Take",
      payouts: "Player Payouts",
      zoneStats: "Zone Intel (Routes)",
      pTitle: "P",
      playerSummary: "Player Booty Summary",
    },
    data: {
      primaryTitle: "Primary Target Values",
      lootName: "Loot Name",
      primaryNormal: "Normal Mode",
      primaryHard: "Hard Mode",
      lootTable: "Secondary Loot Reference",
      valuePerPile: "Value / Pile",
      weightPerPile: "Weight / Pile",
      valuePerFullBag: "Value / Full Bag",
      notes: "Notes",
      note1: "Gold is the most valuable loot per weight.",
      note2: "Cocaine is the best solo loot if gold is unavailable.",
      note3: "Paintings take 50% bag space regardless of value.",
    },
    contact: {
      title: "Developer Dossier",
      role: "Role",
      status: "Status",
      location: "Location",
      roleValue: "Low Cortisol Student",
      statusValue: "Active",
      locationValue: "Taiwan",
      authOnly: "AUTHORIZED PERSONNEL ONLY",
      intelTitle: "Contact Me",
      systemTitle: "System Intelligence",
      version: "Version",
      lastUpdated: "Last Updated",
      serverStatus: "Server Status",
      secureConnection: "SECURE CONNECTION",
      stamp: "Sleepy",
      bio: "As the bottom-ranked student in computer science, I've mastered nothing but Vibe Coding. Please don't follow my example—it worries me. My goal is to learn how to play League of Legends, and I adore ahh brainrot memes. If you find any bugs, feel free to DM me on Discord. Honestly, no one will use my site anyway—just take it with a grain of salt.",
      feedback: "Feedback",
      feedbackDesc: "Found a bug or have a suggestion? Open an issue on GitHub. Maybe I'll fix it, maybe.:D",
    }
  },
  tw: {
    title: "Cayo Perico 搶劫分紅計算器",
    settings: {
      title: "分紅設定",
      players: "玩家人數",
      target: "主要目標",
      elite: "精英挑戰",
      eliteDesc: "+$10萬 (單人) / +$5萬 (多位)",
      cuts: "分紅百分比 (%)",
      cutsNote: "總計必須為 100%",
      targetValue: "目標價值",
      wallSafe: "辦公室小保險箱",
    },
    nav: {
      prep: "前置",
      results: "最終分紅",
      data: "基礎數據",
      contact: "聯絡開發者",
      reset: "重置資料",
    },
    zones: {
      MainDockL: "大倉",
      MainDockS: "小倉",
      NorthStorage: "北倉",
      SouthStorage: "南倉",
      WestStorage: "西倉",
      Basement: "地下室",
      Office: "辦公室",
    },
    loot: {
      Gold: "黃金",
      Coke: "古柯鹼",
      Weed: "大麻",
      Painting: "名畫",
      Cash: "現金",
      'Madrazo Files': "瑪德拉索文件",
      'Sinsimito Tequila': "西西里莫龍舌蘭",
      'Ruby Necklace': "紅寶石項鍊",
      'Bearer Bonds': "不記名債券",
      'Pink Diamond': "粉紅鑽石",
      'Panther Statue': "獵豹雕像",
    },
    intel: {
      title: "偵察情報",
      restricted: "本區僅限多人玩家進入",
    },
    summary: {
      title: "偵察財物統計",
      empty: "尚無偵察資料",
      footer: "偵察次要財物總額",
    },
    results: {
      title: "最終分紅計算",
      primary: "主要目標",
      secondary: "次要財物",
      wallSafe: "保險箱",
      elite: "精英挑戰",
      total: "總收入",
      pavel: "派沃分紅",
      fence: "洗錢費用",
      cutsHeader: "成員預估分紅:",
      leader: "隊長",
      member: "成員",
      recommendation: "系統建議",
      manualTitle: "手動分紅調節器",
      availablePool: "剩餘財物池",
      capacityWarning: "負重超出上限！",
      emptyBags: "尚無資料...",
      copyBtn: "複製圖片",
      copySuccess: "已複製",
      downloadBtn: "下載圖片",
      manualFinancialBreakdown: "手動分紅結算",
      finalManualTake: "最終手動利潤",
      payouts: "成員分成",
      zoneStats: "區域拿取統計",
      pTitle: "玩",
      playerSummary: "各玩家財物清單",
    },
    data: {
      primaryTitle: "主要目標價值表",
      lootName: "財物名稱",
      primaryNormal: "一般模式",
      primaryHard: "困難模式",
      lootTable: "次要財物參考表",
      valuePerPile: "單堆價值",
      weightPerPile: "佔用負重",
      valuePerFullBag: "滿包價值",
      notes: "注意事項",
      note1: "黃金是單位價值最高的財物。",
      note2: "古柯鹼是次優的選擇，且適合單人玩家。",
      note3: "名畫固定佔用 50% 空間，不論其價值。",
    },
    contact: {
      title: "開發者檔案",
      role: "職務",
      status: "狀態",
      location: "目前位置",
      roleValue: "低皮質醇大學生",
      statusValue: "線上",
      locationValue: "臺灣",
      authOnly: "僅限授權人員存取",
      intelTitle: "聯繫我",
      systemTitle: "系統情報",
      version: "版本",
      lastUpdated: "最後更新",
      serverStatus: "伺服器狀態",
      secureConnection: "安全連線中",
      stamp: "我想睡覺",
      bio: "資工墊底大學生，學而不精因此只會Vibe Coding，請不要向我學習，我會擔心。目標是學會打Lol，我喜歡抽象迷因。若有任何Bug可以到Discord私訊我，阿反正也沒人會用我的網站，聽聽就好。",
      feedback: "意見回饋",
      feedbackDesc: "什麼？有Bug？我不是很想改拉，但為了你們，還是到Github上開Issue給我，我盡量去改:D。",
    }
  },
  cn: {
    title: "Cayo Perico 抢劫分红计算器",
    settings: {
      title: "分红设定",
      players: "玩家人数",
      target: "主要目标",
      elite: "精英挑战",
      eliteDesc: "+$10万 (单人) / +$5万 (多位)",
      cuts: "分红百分比 (%)",
      cutsNote: "总计必须为 100%",
      targetValue: "目标价值",
      wallSafe: "办公室小保险箱",
    },
    nav: {
      prep: "前置",
      results: "最终分红",
      data: "基础数据",
      contact: "联系开发者",
      reset: "重置资料",
    },
    zones: {
      MainDockL: "大仓",
      MainDockS: "小仓",
      NorthStorage: "北仓",
      SouthStorage: "南仓",
      WestStorage: "西仓",
      Basement: "地下室",
      Office: "办公室",
    },
    loot: {
      Gold: "黄金",
      Coke: "古柯碱",
      Weed: "大麻",
      Painting: "名画",
      Cash: "现金",
      'Madrazo Files': "玛德拉索文件",
      'Sinsimito Tequila': "西西里莫龙舌兰",
      'Ruby Necklace': "红宝石项链",
      'Bearer Bonds': "不记名债券",
      'Pink Diamond': "粉红钻石",
      'Panther Statue': "猎豹雕像",
    },
    intel: {
      title: "侦察情报",
      restricted: "本区仅限多人玩家进入",
    },
    summary: {
      title: "侦察财物统计",
      empty: "尚无侦察资料",
      footer: "侦察次要财物总额",
    },
    results: {
      title: "最终分红计算",
      primary: "主要目标",
      secondary: "次要财物",
      wallSafe: "保险箱",
      elite: "精英挑战",
      total: "总收入",
      pavel: "派沃分红",
      fence: "洗钱费用",
      cutsHeader: "成员预估分红:",
      leader: "队长",
      member: "成员",
      recommendation: "系統建議",
      manualTitle: "手动分红调节器",
      availablePool: "剩余财物池",
      capacityWarning: "负重超出上限！",
      emptyBags: "尚无资料...",
      copyBtn: "复制图片",
      copySuccess: "已复制",
      downloadBtn: "下载图片",
      manualFinancialBreakdown: "手动分红结算",
      finalManualTake: "最终手动利润",
      payouts: "成员分成",
      zoneStats: "区域拿取统计",
      pTitle: "玩",
      playerSummary: "各玩家财物清单",
    },
    data: {
      primaryTitle: "主要目标价值表",
      lootName: "财物名称",
      primaryNormal: "一般模式",
      primaryHard: "困难模式",
      lootTable: "次要财物参考表",
      valuePerPile: "单堆价值",
      weightPerPile: "占用负重",
      valuePerFullBag: "满包价值",
      notes: "注意事项",
      note1: "黄金是单位价值最高的财物。",
      note2: "古柯碱是次优的选择，且适合单人玩家。",
      note3: "名画固定占用 50% 空间，不论其价值。",
    },
    contact: {
      title: "開發者檔案",
      role: "職務",
      status: "狀態",
      location: "目前位置",
      roleValue: "低皮质醇大学生",
      statusValue: "在线",
      locationValue: "台湾",
      authOnly: "仅限授权人员存取",
      intelTitle: "联系我",
      systemTitle: "系统情报",
      version: "版本",
      lastUpdated: "最后更新",
      serverStatus: "服务器状态",
      secureConnection: "安全连接中",
      stamp: "我想睡觉",
      bio: "资工垫底大学生，学而不精因此只会Vibe Coding，請不要向我學習，我会担心。目标是学会打Lol，我喜欢抽象迷因。若有任何Bug可以到Discord私信我，阿反正也没人会用我的网站，听听就好。",
      feedback: "意见反馈",
      feedbackDesc: "什麽？有Bug？我不是很想改拉，但为了你们，还是到Github上开Issue给我，我尽量去改:D。",
    }
  }
};
