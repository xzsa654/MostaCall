import express from 'express'
import authRoutes from './routers/authRoutes.js'
import messageRoute from './routers/messageRoute.js'
import { connectDB } from './lib/db.js'
import path from 'path'
import dotenv from 'dotenv'
import matchRoute from './routers/matchRoute.js'
import { protectRoute } from './middlewares/protectRoute.js'
import cors from 'cors'
import { app, server } from './socket/socket.js'
dotenv.config()
// 正確設置 __dirname 在 ES 模塊中
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const corsOption = {
  credentials: true,
  origin: (orign, callback) => {
    callback(null, true)
  },
}
app.use(cors(corsOption))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', authRoutes)
app.use('/uploads', express.static('uploads'))
app.use(protectRoute)
app.use('/api/match', matchRoute)
app.use('/api/message', messageRoute)
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode')
  console.log('Serving static files from:', path.join(__dirname, '../frontend'))

  // 先提供 Next.js 的靜態文件
  app.use(express.static(path.join(__dirname, '../frontend')))

  // 確保 .next/static 文件可以被訪問
  app.use('/_next', express.static(path.join(__dirname, '../frontend/.next')))

  // 所有其他請求轉發到 Next.js
  app.get('*', (req, res) => {
    const indexPath = path.join(
      __dirname,
      '../frontend/.next/server/pages/index.html'
    )
    console.log('Attempting to serve:', indexPath)

    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error sending file:', err)
        res.status(500).send('Error loading page')
      }
    })
  })
}
const port = process.env.PORT
server.listen(port, () => {
  connectDB()
  console.log(`伺服器已啟動 port:${port}`)
})
