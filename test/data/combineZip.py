import xml.etree.ElementTree as ET
import json
import os

# 讀取 XML
os.chdir('C:\\sunthing\\web\\superBeggar\\test\\data')


tree = ET.parse('place.xml')
root = tree.getroot()

# 解析 XML，建立 {zip: {latitude, longitude}} 對照表
zip_to_latlng = {}

for area in root.findall('.//_x0031_050429_行政區經緯度_x0028_toPost_x0029_'):
    zip_code = area.find('./_x0033_碼郵遞區號').text.strip()
    latitude = float(area.find('./中心點緯度').text.strip())
    longitude = float(area.find('./中心點經度').text.strip())
    zip_to_latlng[zip_code] = {
        'latitude': latitude,
        'longitude': longitude
    }

# 讀取 JSON
with open('taiwan_districts.json', 'r', encoding='utf-8') as f:
    districts_data = json.load(f)

# 合併
for city in districts_data:
    for district in city['districts']:
        zip_code = district['zip']
        if zip_code in zip_to_latlng:
            district.update(zip_to_latlng[zip_code])
        else:
            print(f"[警告] 找不到經緯度: {city['name']} {district['name']} ({zip_code})")

# 輸出新的 JSON
with open('taiwan_districts_with_latlng.json', 'w', encoding='utf-8') as f:
    json.dump(districts_data, f, ensure_ascii=False, indent=4)
