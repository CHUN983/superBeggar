const fs = require('fs');

// 讀取原始 JSON 檔案
const rawData = fs.readFileSync('711_stores.json', 'utf8');
const originalData = JSON.parse(rawData);

const poiidMap = {};

originalData.forEach(city => {
  const { city_id, city_name, stores } = city;
  stores.forEach(store => {
    poiidMap[store.POIID] = {
      city_id,
      city_name,
      X: store.X,
      Y: store.Y,
      Address: store.Address,
      Telno: store.Telno
    };
  });
});

// 將結果寫入新的 JSON 檔案
fs.writeFileSync('711_stores_by_poiid.json', JSON.stringify(poiidMap, null, 2), 'utf8');

console.log('轉換完成，結果已儲存為 711_stores_by_poiid.json');
