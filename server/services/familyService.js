// server/services/familyService.js
import fetch from 'node-fetch'    // Node18+ 也可直接用全域 fetch

const FAMILY_BASE = 'https://stamp.family.com.tw/api/maps'
const PROJECT_CODE = '202106302'

/**
 * 根據郵遞區號或座標查詢全家即期品門市
 * @param {Object} opts
 * @param {string[]} opts.oldPKeys 舊分類 keys，這裡通常空陣列
 * @param {string}   opts.postInfo  郵遞區號，或空字串
 * @param {number}   opts.latitude  緯度（郵遞區時可傳 0）
 * @param {number}   opts.longitude 經度（郵遞區時可傳 0）
 * @returns {Promise<Array>} 回傳門市資料陣列
 */
export async function fetchFamilyShops({ oldPKeys = [], postInfo = '', latitude = 0, longitude = 0 }) {
  const url = `${FAMILY_BASE}/MapProductInfo`
  const payload = {
    OldPKeys: oldPKeys,
    PostInfo: postInfo,
    Latitude: latitude,
    Longitude: longitude,
    ProjectCode: PROJECT_CODE
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error(`FamilyMart API error: ${res.status}`)
  const json = await res.json()
  if (json.code !== 1) throw new Error(`FamilyMart API returned code ${json.code}`)
  return (json.data || []).map(store => ({
    ...store,
    type: 'family'
  }))
}
