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
    emptyBags: string;
    copyBtn: string;
    copySuccess: string;
    downloadBtn: string;
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
      contact: "Contact Us",
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
      pavel: "Pavel Cut (2%)",
      fence: "Fence Fee (10%)",
      cutsHeader: "Estimated Cuts:",
      leader: "Leader",
      member: "Member",
      recommendation: "Bag Recommendations",
      emptyBags: "No data...",
      copyBtn: "Copy Image",
      copySuccess: "Copied to clipboard",
      downloadBtn: "Download Image",
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
      contact: "聯絡我們",
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
      pavel: "派沃分紅 (2%)",
      fence: "洗錢費用 (10%)",
      cutsHeader: "成員預估分紅:",
      leader: "隊長",
      member: "成員",
      recommendation: "建議拿取清單",
      emptyBags: "尚無資料...",
      copyBtn: "複製圖片",
      copySuccess: "已複製",
      downloadBtn: "下載圖片",
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
      contact: "联系我们",
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
      pavel: "派沃分红 (2%)",
      fence: "洗钱费用 (10%)",
      cutsHeader: "成员预估分红:",
      leader: "队长",
      member: "成员",
      recommendation: "建议拿取清单",
      emptyBags: "尚无资料...",
      copyBtn: "复制图片",
      copySuccess: "已复制",
      downloadBtn: "下载图片",
    }
  }
};
