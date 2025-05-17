import express from 'express'
import cors from 'cors'
import shopRoutes from './routes/shopRoutes.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', shopRoutes)   // 所有 /api/maps/* 交給 route 處理

app.listen(3001, ()=> console.log('API server @ http://localhost:3001'))  
