// server/routes/shopRoutes.js
import { Router } from 'express'
import { fetchFamilyShops } from '../services/familyService.js'
import { getValid7iToken, fetchNearby711, fetchStoreDetail } from '../services/seven11.js'


const router = Router()

// POST /api/stores
router.post('/stores', async (req, res) => {
  //新增type (莫認為'all')，為了之後只選擇全家或711使用
  const { zip, latitude, longitude, type = 'all' } = req.body

  try {
    const result = {}

    // 查詢 FamilyMart
    if (type === 'family' || type === 'all') {
      const family = await fetchFamilyShops({ postInfo: zip, latitude, longitude })
      result.family = family
    }

    // 查詢 7-ELEVEN
    if (type === 'seven' || type === 'all') {
      const token = await getValid7iToken()
      const seven = await fetchNearby711(token, latitude, longitude)
      result.seven = seven
    }

    res.json({ success: true, ...result })
  } catch (e) {
    console.error('Error in /stores:', e)
    res.status(500).json({ success: false, message: e.message })
  }
})

// POST /api/store-detail
router.post('/store-detail', async (req, res) => {
  let { type, storeNo, latitude, longitude } = req.body

  // 若沒傳經緯度，預設0
  latitude = latitude || 0
  longitude = longitude || 0

  try {
    let result = {}

    if (type === 'seven' || type === 'all') {
      const token = await getValid7iToken()
      const sevenDetail = await fetchStoreDetail(token, latitude, longitude, storeNo)
      result.seven = sevenDetail
    }

    if (type === 'family' || type === 'all') {
      const familyDetailList = await fetchFamilyShops({
        postInfo: '',
        latitude,
        longitude,
        oldPKeys: [storeNo], // 只查單一門市
      })

      const familyDetail = familyDetailList.find(shop => shop.oldPKey === storeNo)
      if (!familyDetail) {
        return res.status(404).json({ success: false, message: 'FamilyMart store not found' })
      }

      result.family = familyDetail
    }

    res.json({ success: true, type, data: result })
  } catch (err) {
    console.error('Error in /store-detail:', err)
    res.status(500).json({ success: false, message: err.message })
  }
})



export default router
