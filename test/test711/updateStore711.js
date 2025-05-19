const axios = require('axios');
const fs = require('fs');
const { parseStringPromise } = require('xml2js');

const cityIds = {
  '01': '台北市', '02': '基隆市', '03': '新北市', '04': '桃園市',
  '05': '新竹市', '06': '新竹縣', '07': '苗栗縣', '08': '台中市',
  '10': '彰化縣', '11': '南投縣', '12': '雲林縣', '13': '嘉義市',
  '14': '嘉義縣', '15': '台南市', '17': '高雄市', '19': '屏東縣',
  '20': '宜蘭縣', '21': '花蓮縣', '22': '台東縣', '23': '澎湖縣',
  '24': '連江縣', '25': '金門縣',
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function formatCoords(type, value) {
  if (type === 'X') return parseFloat(value.slice(0, 3) + '.' + value.slice(3));
  if (type === 'Y') return parseFloat(value.slice(0, 2) + '.' + value.slice(2));
  return value;
}

(async () => {
  const poiidMap = {}; // 改為 POIID map
  const seenIds = new Set();

  for (const [cityId, cityName] of Object.entries(cityIds)) {
    console.log(`處理：${cityName}`);
    const townParams = new URLSearchParams({
      commandid: 'GetTown',
      cityid: cityId,
    });

    const townRes = await axios.post('http://emap.pcsc.com.tw/EMapSDK.aspx', townParams);
    const townXml = await parseStringPromise(townRes.data, { explicitArray: false });
    const towns = townXml.iMapSDKOutput.GeoPosition;

    for (const town of Array.isArray(towns) ? towns : [towns]) {
      const townName = town.TownName;
      const storeParams = new URLSearchParams({
        commandid: 'SearchStore',
        city: cityName,
        town: townName,
      });

      await delay(200);
      const storeRes = await axios.post('http://emap.pcsc.com.tw/EMapSDK.aspx', storeParams);
      const storeXml = await parseStringPromise(storeRes.data, { explicitArray: false });

      const positions = storeXml.iMapSDKOutput.GeoPosition;
      if (!positions) continue;

      const stores = Array.isArray(positions) ? positions : [positions];

      for (const s of stores) {
        const id = parseInt(s.POIID);
        if (seenIds.has(id)) continue;

        seenIds.add(id);
        poiidMap[id] = {
          city_id: cityId,
          city_name: cityName,
          X: formatCoords('X', s.X),
          Y: formatCoords('Y', s.Y),
          Address: s.Address,
          Telno: s.Telno,
        };
      }
    }
  }

  fs.writeFileSync('711_stores_by_poiid.json', JSON.stringify(poiidMap, null, 2), 'utf8');
  console.log(`完成！總筆數：${Object.keys(poiidMap).length}`);
})();
