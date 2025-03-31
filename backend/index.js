import express from 'express'
import authRoutes from './routers/authRoutes.js'
import messageRoute from './routers/messageRoute.js'
import { connectDB } from './lib/db.js'
import dotenv from 'dotenv'
import matchRoute from './routers/matchRoute.js'
import { protectRoute } from './middlewares/protectRoute.js'
import cors from 'cors'
import { app, server } from './socket/socket.js'
dotenv.config()

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

const port = process.env.PORT
server.listen(port, () => {
  connectDB()
  console.log(`伺服器已啟動 port:${port}`)
})
