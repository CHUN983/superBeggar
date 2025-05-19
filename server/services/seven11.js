// server/services/seven11.js
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const storeDataPath = path.resolve('data/711_stores.json')
const storeMap = JSON.parse(fs.readFileSync(storeDataPath, 'utf-8'))

const API_BASE        = 'https://lovefood.openpoint.com.tw/LoveFood/api'
const MID_V           = 'W0_DiF4DlgU5OeQoRswrRcaaNHMWOL7K3ra3385ocZcv-bBOWySZvoUtH6j-7pjiccl0C5h30uRUNbJXsABCKMqiekSb7tdiBNdVq8Ro5jgk6sgvhZla5iV0H3-8dZfASc7AhEm85679LIK3hxN7Sam6D0LAnYK9Lb0DZhn7xeTeksB4IsBx4Msr_VI'
const USER_AGENT_7_11 = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'

/** 取得 7-Eleven API token */
export async function fetch7iToken() {
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
 * 查詢附近門市
 * @param {string} token     由 fetch7iToken 得到
 * @param {number} latitude  緯度
 * @param {number} longitude 經度
 * @returns {Promise<Array>} 回傳 StoreStockItemList 陣列
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

  // 補上經緯度與地址
  const enrichedStores = stores.map(store => {
    const storeNo = String(store.StoreNo)
    const extra = storeMap[storeNo]
    if (!extra) console.warn(`找不到門市資料：${storeNo}`)
    return {
      ...store,
      longitude: extra.X || null,
      latitude: extra.Y || null,
      address: extra.Address || '',
      tel: extra.Telno || ''
    }
  })
  
  return enrichedStores
}

/**
 * 取得單一門市的商品明細
 * @param {string} token     由 fetch7iToken 得到
 * @param {number} latitude  緯度
 * @param {number} longitude 經度
 * @param {string} storeNo   門市編號
 * @returns {Promise<Object>} 回傳 StoreStockItem 物件
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
