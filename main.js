const citySelect = document.getElementById('city');
const districtSelect = document.getElementById('district');
const result = document.getElementById('result');

// 讀取 JSON 資料
fetch('./taiwan_districts.json')
  .then(res => res.json())
  .then(data => {
    // 初始化縣市選單
    data.forEach(city => {
      const option = document.createElement('option');
      option.value = city.name;
      option.textContent = city.name;
      citySelect.appendChild(option);
    });

    // 監聽縣市變更
    citySelect.addEventListener('change', () => {
      const selectedCity = data.find(city => city.name === citySelect.value);
      districtSelect.innerHTML = '';
      if (!selectedCity) {
        districtSelect.disabled = true;
        result.textContent = '請選擇地區';
        return;
      }

      districtSelect.disabled = false;
      selectedCity.districts.forEach(d => {
        const option = document.createElement('option');
        option.value = d.zip;
        option.textContent = d.name;
        districtSelect.appendChild(option);
      });
    });

    // 監聽區域變更
    districtSelect.addEventListener('change', () => {
      const zip = districtSelect.value;
      const districtName = districtSelect.options[districtSelect.selectedIndex].text;
      result.textContent = `📮 郵遞區號：${zip}（${districtName}）`;
    });
  })
  .catch(err => {
    console.error('載入 taiwan_districts.json 失敗', err);
    result.textContent = '無法載入地區資料';
  });
