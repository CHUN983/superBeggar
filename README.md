# Vue 3 + Vite + Leaflet 地圖專案

這是一個使用 Vue 3 + Vite 建立的前端專案，整合 Leaflet 地圖，提供行政區篩選、地圖標記與全畫面響應式設計。

---

## 🧱 環境建置

## 安裝需求

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
## 後端Server
此專案搭配一個 Node.js + Express 的後端伺服器，用來串接即期品 API（如 7-11、全家等）。
### 安裝與啟動流程
1. 進入後端資料夾（server）：
```bash
cd server
```

2. 安裝依賴套件：
```bash
npm install
```

3. 啟動伺服器（預設 port: 3001）：
```bash
node index.js
```
後端啟動後會提供 API，例如：
```bash
POST http://localhost:3001/api/stores
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
├─vueProject
│   ├─ public/
│   │   └─ data/
│   │       ├─ taiwan_districts.json     # 縣市與區域資料
│   │       └─ shops.json                # 商家地圖資料
│   └─ src/
│       ├─ assets/
│       │   └─ main.css                  # 全域樣式檔案
│       ├─ components/
│       │   ├─ Sidebar.vue
│       │   ├─ ProductList.vue
│       │   ├─ HeaderBar.vue
│       │   ├─ Menu.vue
│       │   ├─ StoreDetail.vue
│       │   ├─ Favorite.vue
│       │   └─ MapView.vue
│       ├─ App.vue
│       └─ main.js
├─ server/
│       ├─ data/
│       │   └─ 711_stores.json     # 7-11 門市補充資料
│       ├─ routes/
│       │   └─ shopRoutes.js             # 定義 /api/stores 路
│       ├─ services/
│       │   ├─ seven11.js                # 7-11 API 串接邏輯
│       │   └─ familyService.js          # 全家 API 串接邏輯
│       └─ index.js                      # Express server 進入點
├─ test/
└─ README.md
```
---
## 流程圖與架構

1. 收藏店家流程圖（Flowchart）
```mermaid
flowchart TD
    Start(使用者開啟網頁或搜尋區域) --> Sidebar[Sidebar.vue：選擇地區]
    Sidebar -->|觸發查詢事件| App[App.vue：主控邏輯]
    App -->|傳送 API 請求| APIReq[API 請求處理器]
    APIReq --> Server[後端伺服器]
    Server -->|向超商發送請求| Family[全家 API]
    Server -->|向超商發送請求| Seven[7-11 API]
    Family --> Server
    Seven --> Server
    Server -->|統整資料回傳| APIReq
    APIReq --> App
    App --> MapView[MapView.vue：顯示地圖]
    App --> ProductList[ProductList.vue：顯示即期品列表]
    ProductList --> End(使用者查看即期品)

```

2. 序列圖（Sequence Diagram）
```mermaid
sequenceDiagram
    participant User
    participant Sidebar.vue
    participant App.vue
    participant Backend
    participant FamilyMartAPI
    participant SevenAPI
    participant MapView.vue
    participant ProductList.vue

    User->>Sidebar.vue: 選擇地區
    Sidebar.vue->>App.vue: 通知需查詢資料
    App.vue->>Backend: GET /api/stores?lat=...&lng=...
    Backend->>FamilyMartAPI: 查詢全家即期品
    Backend->>SevenAPI: 查詢 7-11 即期品
    FamilyMartAPI-->>Backend: 回傳 JSON
    SevenAPI-->>Backend: 回傳 JSON
    Backend-->>App.vue: 回傳合併資料
    App.vue->>MapView.vue: 顯示地圖上的門市
    App.vue->>ProductList.vue: 顯示即期品列表
```


3. UML Component Diagram（元件圖）
```mermaid
flowchart LR
    subgraph 前端系統
        Header[<<component>> HeaderBar.vue]
        Sidebar[<<component>> Sidebar.vue]
        ProductList[<<component>> ProductList.vue]
        StoreDetail[<<component>> StoreDetail.vue]
        Favorite[<<component>> Favorite.vue]
        App[<<component>> App.vue]
        LocalStorage[LocalStorage]
    end

    subgraph 後端系統
        API[<<component>> /api/store-detail]
        Server[<<component>> Express Server]
    end

    ProductList -->|點擊愛心 icon| App
    App -->|更新收藏| LocalStorage
    Favorite -->|讀取收藏清單| LocalStorage
    Favorite -->|向 API 請求店家資訊| API
    API --> Server

    Sidebar --> App
    Header --> App
    StoreDetail --> App

```


