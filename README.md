# Cayo Perico Heist Profit Calculator v2

![Cayo Perico](https://img.shields.io/badge/GTA_V-Heist-yellow?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css)

這是一個專為《俠盜獵車手 5》（GTA 5）佩里克島搶劫（Cayo Perico Heist）設計的高級收益計算器。透過智慧演算法，幫助玩家在有限的背包空間中實現**收益最大化**。

[**🚀 立即使用 (Live Demo)**] https://cayo-perico.cuboouo.com

---

## ✨ 核心特色

### 🚀 智慧優化演算法

- **收益最大化**：基於次要目標物的「價值密度」進行自動分配。
- **多玩家支援**：支援 1 至 4 名玩家，自動根據玩家人數調整策略。
- **單人限制邏輯**：單人模式下自動排除需要雙人磁卡的儲藏室（北美儲藏室、西側儲藏室等）。
- **畫作分配模擬**：採用多路徑模擬，確保在處理畫作（佔用 50% 空間）時能與其他高價值物品達到完美平衡。

### 🎨 極致視覺設計

- **特工檔案風格**：採用資料夾、報表、標籤貼紙與膠帶等擬物化設計。
- **紙張質感 UI**：全局使用 Paper Texture 紋理，營造真實的搶劫計畫感。
- **動態互動**：組件具有旋轉、縮放與平滑轉場效果，使用者體驗流暢。

### 🛠️ 強大交互功能

- **分區操作指引**：將搶劫路徑拆解為各個區域（大門、碼頭、辦公室等），並顯示每個階段背包的佔用狀況。
- **手動微調模式**：除了自動最優化，玩家還能透過垂直拖拽或點擊按鈕手動調整物資百分比。
- **一鍵同步優化**：手動調整後，可隨時一鍵回復至系統建議的最優狀態。
- **多語言支援**：完整支援 繁體中文、簡體中文 與 英文。

---

## 💻 技術棧

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI 庫**: [React 19](https://react.dev/)
- **樣式**: [Tailwind CSS 4](https://tailwindcss.com/) (搭配 PostCSS)
- **圖標**: [Lucide React](https://lucide.dev/)
- **動畫**: CSS Transitions & Lucide Dynamic Icons
- **開發語言**: TypeScript

---

## 🛠️ 環境準備與安裝

在開始之前，請確保你的電腦已安裝 [Node.js](https://nextjs.org/)。

### 1. 安裝套件

> [!TIP]
> 如果你在安裝過程中遇到權限問題，可以嘗試使用 `sudo npm install`（僅限 Mac/Linux）。

```bash
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

啟動成功後，在瀏覽器打開 `http://localhost:3000` 即可看到網頁。

---

## 📖 使用指南

1.  **設定條件**：選擇玩家人數（1-4）與難度模式（一般/困難）。
2.  **輸入物資**：在各個區域填入偵查到的次要目標數量。
3.  **查看結果**：系統會立即產出每位玩家應拿取的物品清單與預估總價值。
4.  **跟隨指引**：在「搶劫路徑」分頁中，依照分佈區域順序領取物資，確保效率。

---

## ⚠️ 聲明

本專案僅為愛好者開發的輔助工具，與 Rockstar Games 無任何關聯。所有遊戲內容版權歸原公司所有。

---

## 📜 授權

[MIT License](LICENSE)

---

## 悄悄話

以上都是AI寫的README，我不想管那麼多了:D
