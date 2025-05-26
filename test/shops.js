// load.js
import { readFile, writeFile } from 'fs/promises';      // fs/promises API:contentReference[oaicite:3]{index=3}

const API = 'https://stamp.family.com.tw/api/maps/MapProductInfo';

async function main() {

  // 正確產生「依 keys 查詢」的 payload
  const payload = {
    OldPKeys: ['013375'],              // 走郵遞區號分支
    PostInfo: '',           // 例如 814（高雄市鼓山區）
    Latitude: 10 ,
    Longitude: 10,
    ProjectCode: '202106302'
  };
  /*經緯度等電子地圖實現時使用
  payload.Latitude  = 22.627;   // 高雄緯度
  payload.Longitude = 120.301;  // 高雄經度
  */
    

  console.log('Request Payload:', payload);             // **印出 payload** 以驗證格式:contentReference[oaicite:4]{index=4}

  // 呼叫 API，Node18+ 全域 fetch:contentReference[oaicite:5]{index=5}
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)                       // JSON.stringify 將物件轉成字串:contentReference[oaicite:6]{index=6}
  });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();                        // 解析回應 JSON:contentReference[oaicite:7]{index=7}

  console.log('回傳原始結構：', json);
  console.log('回傳店鋪數：', json.data.length);

  // 將 shop 資料寫入 shops.json
  await writeFile('data/shops.json', JSON.stringify(json.data, null, 2));  // 寫入檔案:contentReference[oaicite:8]{index=8}
  console.log('✔ shops.json 已寫入');
}

main().catch(console.error);
