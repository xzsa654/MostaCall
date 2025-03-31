import { Server } from 'socket.io'
import http from 'http'
import e from 'express'

const app = e()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST'],
  },
})

const socketMap = {}

io.on('connection', (socket) => {
  console.log('用戶以連接', socket.id)
  const user_id = socket.handshake.query.user_id
  if (user_id) socketMap[user_id] = socket.id
  io.emit('getOnlineUser', Object.keys(socketMap))

  socket.on('disconnect', () => {
    console.log('用戶已斷開連接', socket.id)
    delete socketMap[user_id]
    io.emit('getOnlineUser', Object.keys(socketMap))
  })
})
export function getOnlineSocketId(user_id) {
  return socketMap[user_id]
}

export { io, app, server }
