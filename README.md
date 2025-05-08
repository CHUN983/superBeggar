node js環境
npm init -y


# Vue 3 + Vite + Leaflet 地圖專案

這是一個使用 Vue 3 + Vite 建立的前端專案，整合 Leaflet 地圖，提供行政區篩選、地圖標記與全畫面響應式設計。

---

## 🧱 環境建置

### 安裝需求

- **Node.js 18 或以上版本**
- **npm 或其他套件管理工具（如 pnpm、yarn）**

### 安裝流程

1. 建立專案

```bash
cd vueProject
```

2. 安裝依賴套件

```bash
npm install
npm install leaflet
```

3. 啟動開發伺服器
```bash
npm run dev
```

---

## 📦 打包部署
執行下列指令來建立靜態檔案：
```
npm run build
```
產出的 /dist 可部署至 GitHub Pages、Netlify、Vercel 或其他靜態網頁伺服器。


---
## 📁 專案結構
```bash
my-map-app/
├─ public/
│   └─ data/
│       ├─ taiwan_districts.json   # 縣市與區域資料
│       └─ shops.json              # 商家地圖資料
├─ src/
│   ├─ assets/
│   │   └─ main.css                # 全域樣式檔案
│   ├─ components/
│   │   ├─ Sidebar.vue
│   │   ├─ ProductList.vue
│   │   ├─ HeaderBar.vue
│   │   └─ MapView.vue
│   ├─ App.vue
│   └─ main.js
├─ index.html
└─ README.md
```
---
