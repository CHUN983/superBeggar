// main.js
async function loadHTML(selector, url) {
    const res = await fetch(url);                             // 以 Fetch 取回 HTML :contentReference[oaicite:3]{index=3}
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');    // 轉成 document :contentReference[oaicite:4]{index=4}
    // 將 body 內容搬進目標節點
    document.querySelector(selector).innerHTML = doc.body.innerHTML;
}
  
// 當 DOMReady 後
window.addEventListener('DOMContentLoaded', async () => {
    await loadHTML('#content', './index/index.htm');
    // JSON 載入一定放在 main.js 裡
    const citySelect    = document.getElementById('city');
    const districtSelect= document.getElementById('district');
    const result        = document.getElementById('result');
  
    const res = await fetch('/data/taiwan_districts.json');
    const data = await res.json();
  
    // 初始化縣市
    data.forEach(c=>{
      const o=document.createElement('option');
      o.value=c.name; o.textContent=c.name;
      citySelect.appendChild(o);
    });
    citySelect.addEventListener('change',()=>{
      const sel = data.find(c=>c.name===citySelect.value);
      districtSelect.innerHTML='<option>請選擇區域</option>';
      districtSelect.disabled=!sel;
      sel?.districts.forEach(d=>{
        const o=document.createElement('option');
        o.value=d.zip; o.textContent=d.name;
        districtSelect.appendChild(o);
      });
    });
    districtSelect.addEventListener('change',()=>{
      const zip=districtSelect.value;
      const nm=districtSelect.selectedOptions[0].text;
      result.textContent=`📮 郵遞區號：${zip}（${nm}）`;
    });
  });