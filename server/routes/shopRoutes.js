// server/routes/shopRoutes.js
import { Router } from 'express'
import { fetchFamilyShops } from '../services/familyService.js'
import { getValid7iToken, fetchNearby711 } from '../services/seven11.js'

const router = Router()

// POST /api/stores
router.post('/stores', async (req, res) => {
  const { zip, latitude, longitude } = req.body
  try {
    // 1. 先取得 7-11 的 token
    const token = await getValid7iToken()

    // 2. 同步呼叫兩家 API
    const [family, seven] = await Promise.all([
      fetchFamilyShops({ postInfo: zip, latitude, longitude }),
      fetchNearby711(token, latitude, longitude)
    ])

    res.json({ success: true, family, seven })
  } catch (e) {
    console.error('Error in /stores:', e)
    res.status(500).json({ success: false, message: e.message })
  }
})

export default router
