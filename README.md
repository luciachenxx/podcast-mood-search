# SoulCast 🎧

> AI 驅動的 Podcast 智慧推薦平台

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

## 專案簡介

基於使用者心情狀態的智慧 Podcast 推薦平台。運用 AI 語義分析技術，理解用戶情感狀態並推薦符合當下心情的音頻內容。

## 核心功能

- **AI 智能推薦**：整合 OpenAI API 進行語義分析和內容匹配
- **安全防護**：Rate Limiting、IP 追蹤等多層防護
- **模組化組件**：易維護的 React 組件設計
- **響應式設計**：支援桌面端和行動裝置
- **優質使用體驗**：防抖搜尋、圖片懶載入、無限滾動優化

## 技術架構

```
前端：React 18 + TypeScript + Next.js 14 + Tailwind CSS
AI整合：OpenAI GPT-3.5-turbo 語義分析
API：Podcast Index API 內容整合
部署：Vercel
```

## 系統特色

### 智能推薦引擎

- 多層次匹配：本地關鍵字 + AI 語義分析 + 內容評分
- 動態查詢擴展：AI 驅動的相關詞彙生成
- 中文內容優先：針對繁體中文用戶優化

### 效能優化

- 快取策略減少 API 調用
- 虛擬化無限滾動支援大量資料
- 圖片懶加載
