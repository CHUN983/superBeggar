// ✅ Node.js 原生 fetch，無需額外安裝
import { writeFile } from 'fs/promises';

const url = 'https://stamp.family.com.tw/api/maps/MapClassificationInfo?ProjectCode=202106302';

async function main() {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();

  console.log(data.data); // 顯示內容
  await writeFile('classification.json', JSON.stringify(data.data, null, 2));
  console.log('✔ 已寫入分類資料.json');
}

main().catch(console.error);
