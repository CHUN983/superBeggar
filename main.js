// main.js
async function loadHTML(selector, url) {
    const res  = await fetch(url);
    const txt  = await res.text();
    const doc  = new DOMParser().parseFromString(txt,'text/html');
    document.querySelector(selector).innerHTML = doc.body.innerHTML;
  }
  
  window.addEventListener('DOMContentLoaded', async () => {
    // 1. 動態注入三個區塊（content、setting、main-map）
    await loadHTML('#content',    './index/index.htm');
    await loadHTML('#setting',    './setting/setting.htm');
    await loadHTML('#main-map',   './map/map.htm');
  
    // 2. 載入台灣區域 JSON（絕對路徑）
    const citySelect     = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    const result         = document.getElementById('result');
  
    const r1 = await fetch('/data/taiwan_districts.json');
    const data = await r1.json();
  
    data.forEach(c=>{
      const o = document.createElement('option');
      o.value = c.name; o.textContent = c.name;
      citySelect.appendChild(o);
    });
    citySelect.addEventListener('change', ()=>{
      const sel = data.find(c=>c.name===citySelect.value);
      districtSelect.innerHTML = '<option value="">請選擇區域</option>';
      districtSelect.disabled = !sel;
      sel?.districts.forEach(d=>{
        const o = document.createElement('option');
        o.value=d.zip; o.textContent=d.name;
        districtSelect.appendChild(o);
      });
    });
    districtSelect.addEventListener('change', ()=>{
      const zip = districtSelect.value;
      const nm  = districtSelect.selectedOptions[0].text;
      result.textContent = `📮 郵遞區號：${zip}（${nm}）`;
    });
  
    // 3. 初始化 Leaflet 地圖（確保 map.html 已注入且容器可見）
    const map=L.map('map').setView([22.627,120.301],14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution:'© OpenStreetMap contributors'
    }).addTo(map);

  });
  