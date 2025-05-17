// 需要先把 MID_V 與 USER_AGENT_7_11 填入
const MID_V = "W0_DiF4DlgU5OeQoRswrRcaaNHMWOL7K3ra3385ocZcv-bBOWySZvoUtH6j-7pjiccl0C5h30uRUNbJXsABCKMqiekSb7tdiBNdVq8Ro5jgk6sgvhZla5iV0H3-8dZfASc7AhEm85679LIK3hxN7Sam6D0LAnYK9Lb0DZhn7xeTeksB4IsBx4Msr_VI";  
const USER_AGENT_7_11 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36";  
const API_BASE = "https://lovefood.openpoint.com.tw/LoveFood/api";

async function fetch7iToken() {
  const url = `${API_BASE}/Auth/FrontendAuth/AccessToken?mid_v=${MID_V}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "User-Agent": USER_AGENT_7_11 },
  });
  if (!resp.ok) throw new Error(`Token 取得失敗：${resp.status}`);
  const js = await resp.json();
  if (!js.isSuccess) throw new Error(`API 回傳失敗：${JSON.stringify(js)}`);
  return js.element;
}

async function fetchNearbyStores(token, lat, lon) {
  const url = `${API_BASE}/Search/FrontendStoreItemStock/GetNearbyStoreList?token=${token}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "User-Agent": USER_AGENT_7_11,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      CurrentLocation: { Latitude: lat, Longitude: lon },
      SearchLocation:  { Latitude: lat, Longitude: lon },
    }),
  });
  if (!resp.ok) throw new Error(`附近門市查詢失敗：${resp.status}`);
  const js = await resp.json();
  if (!js.isSuccess) throw new Error(`API 回傳失敗：${JSON.stringify(js)}`);
  return js.element.StoreStockItemList || [];
}

async function fetchStoreDetail(token, lat, lon, storeNo) {
  const url = `${API_BASE}/Search/FrontendStoreItemStock/GetStoreDetail?token=${token}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "User-Agent": USER_AGENT_7_11,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      CurrentLocation: { Latitude: lat, Longitude: lon },
      StoreNo: storeNo,
    }),
  });
  if (!resp.ok) throw new Error(`門市 ${storeNo} 明細查詢失敗：${resp.status}`);
  const js = await resp.json();
  if (!js.isSuccess) throw new Error(`API 回傳失敗：${JSON.stringify(js)}`);
  return js.element.StoreStockItem || {};
}

// 假設你已經用 fetch7iToken, fetchNearbyStores, fetchStoreDetail 拿到資料
(async () => {
    try {
      const lat = 25.0340, lon = 121.5645;  // 範例座標
      const token = await fetch7iToken();
      const stores = await fetchNearbyStores(token, lat, lon);
  
      // 假設你只想存整個 stores 陣列
      const dataToSave = stores;
  
      // 引入 Node.js 內建的 fs 模組
      const fs = require('fs');
      // 將 dataToSave 轉成美化過的 JSON 字串
      const jsonString = JSON.stringify(dataToSave, null, 2);
  
      // 同步寫入檔案（也可以改成非同步 writeFile）
      fs.writeFileSync('data.json', jsonString, 'utf8');
      console.log('✅ 資料已儲存到 data.json');
    } catch (err) {
      console.error('❌ 儲存資料時發生錯誤：', err);
    }
  })();
  
