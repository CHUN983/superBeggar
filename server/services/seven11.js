// server/services/seven11.js
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

// 讀取 7-11 門市靜態資料（含經緯度、地址、電話）
const storeDataPath = path.resolve('data/711_stores.json')
const storeMap = JSON.parse(fs.readFileSync(storeDataPath, 'utf-8'))

// API 設定常數
const API_BASE        = 'https://lovefood.openpoint.com.tw/LoveFood/api'
const MID_V           = 'W0_DiF4DlgU5OeQoRswrRcaaNHMWOL7K3ra3385ocZcv-bBOWySZvoUtH6j-7pjiccl0C5h30uRUNbJXsABCKMqiekSb7tdiBNdVq8Ro5jgk6sgvhZla5iV0H3-8dZfASc7AhEm85679LIK3hxN7Sam6D0LAnYK9Lb0DZhn7xeTeksB4IsBx4Msr_VI'
const USER_AGENT_7_11 = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'

// 快取 token 與過期時間（記憶體中的簡單快取機制）
let cachedToken = null
let tokenExpireTime = 0 // UNIX timestamp (ms)

/**
 * 實際向 7-11 API 請求 Token
 */
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

/**
 * 取得有效的 7-11 Token，若快取有效就重用，否則重新取得
 */
export async function getValid7iToken() {
  const now = Date.now()
  const BUFFER = 5 * 60 * 1000 // 提前 5 分鐘更新 token

  if (cachedToken && now < tokenExpireTime - BUFFER) {
    return cachedToken
  }

  const newToken = await fetch7iToken()
  cachedToken = newToken

  // 預估 token 有效時間約為 30 分鐘
  tokenExpireTime = now + 30 * 60 * 1000
  return newToken
}

/**
 * 查詢附近門市（需要提供有效 token）
 */
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

  const detailedStores = await Promise.all(
    filteredStores.map(async (store) => {
      const storeNo = String(store.StoreNo)
      const extra = storeMap[storeNo] || {}

      try {
        const detail = await fetchStoreDetail(token, latitude, longitude, storeNo)
        return {
          ...detail,
          StoreNo: storeNo,
          StoreName: store.StoreName,
          Distance: store.Distance,
          longitude: extra.X || null,
          latitude: extra.Y || null,
          address: extra.Address || '',
          tel: extra.Telno || '',
          type: 'seven'
        }
      } catch (e) {
        console.warn(`無法取得 ${storeNo} 詳細資料：`, e.message)
        return null
      }
    })
  )

  return detailedStores.filter(store => store !== null)
}


/**
 * 查詢單一門市商品明細（需要提供有效 token）
 */
export async function fetchStoreDetail(token, latitude, longitude, storeNo) {
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
