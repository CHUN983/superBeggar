import fetch from 'node-fetch'

// API 設定
const API_BASE        = 'https://lovefood.openpoint.com.tw/LoveFood/api'
const MID_V           = 'W0_DiF4DlgU5OeQoRswrRcaaNHMWOL7K3ra3385ocZcv-bBOWySZvoUtH6j-7pjiccl0C5h30uRUNbJXsABCKMqiekSb7tdiBNdVq8Ro5jgk6sgvhZla5iV0H3-8dZfASc7AhEm85679LIK3hxN7Sam6D0LAnYK9Lb0DZhn7xeTeksB4IsBx4Msr_VI'
const USER_AGENT_7_11 = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'

// 取得 Token
async function fetch7iToken() {
  const url = `${API_BASE}/Auth/FrontendAuth/AccessToken?mid_v=${MID_V}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'User-Agent': USER_AGENT_7_11 }
  })
  if (!res.ok) throw new Error(`7-11 Token error: ${res.status}`)
  const js = await res.json()
  if (!js.isSuccess) throw new Error(`7-11 API failed: ${JSON.stringify(js)}`)
  return js.element
}

// 查詢單一門市商品明細
async function fetchStoreDetail(token, latitude, longitude, storeNo) {
  const url = `${API_BASE}/Search/FrontendStoreItemStock/GetStoreDetail?token=${token}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'User-Agent': USER_AGENT_7_11,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      CurrentLocation: { Latitude: latitude, Longitude: longitude },
      StoreNo: storeNo
    })
  })
  if (!res.ok) throw new Error(`7-11 StoreDetail error: ${res.status}`)
  const js = await res.json()
  if (!js.isSuccess) throw new Error(`7-11 API failed: ${JSON.stringify(js)}`)
  return js.element.StoreStockItem || {}
}

export async function fetchNearby711(token, latitude, longitude) {
  const url = `${API_BASE}/Search/FrontendStoreItemStock/GetNearbyStoreList?token=${token}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'User-Agent': USER_AGENT_7_11,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      CurrentLocation: { Latitude: latitude, Longitude: longitude },
      SearchLocation:  { Latitude: latitude, Longitude: longitude }
    })
  })

  if (!res.ok) throw new Error(`7-11 NearbyStores error: ${res.status}`)
  const js = await res.json()
  if (!js.isSuccess) throw new Error(`7-11 API failed: ${JSON.stringify(js)}`)

  const stores = js.element.StoreStockItemList || []

  const filteredStores = stores.filter(store => (store.CategoryStockItems?.length ?? 0) > 0)

  return filteredStores.map((store) => {
    const storeNo = String(store.StoreNo)
    const extra = storeMap[storeNo] || {}

    return {
      StoreNo: storeNo,
      StoreName: store.StoreName,
      Distance: store.Distance,
      longitude: extra.X || null,
      latitude: extra.Y || null,
      address: extra.Address || '',
      tel: extra.Telno || '',
      type: 'seven'
    }
  })
}




// 主程式
async function main() {
  try {
    const token = await fetch7iToken()
    const latitude = 22.646074
    const longitude = 120.32308

    const nearbyStores = await fetchNearby711(token, latitude, longitude)
    console.log('附近有庫存的 7-11 門市:', nearbyStores)
  } catch (err) {
    console.error('錯誤:', err)
  }
}

main()
