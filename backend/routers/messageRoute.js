import e from 'express'
import User from '../models/user-model.js'
import Message from '../models/message.model.js'
import upload from '../lib/upload.js'
import moment from 'moment'
import mongoose from 'mongoose'
import { io, getOnlineSocketId } from '../socket/socket.js'
const router = e.Router()

// 取得所有配對成員
router.get('/', async (req, res) => {
  try {
    const id = req.user

    const filteredUsers = await User.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(id) }, // 确保 ID 格式正确
          matches: { $exists: true, $ne: [] },
          matches: new mongoose.Types.ObjectId(id), // 确保 matches 数组中包含当前用户 ID
        },
      },
      {
        $lookup: {
          from: 'messages',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ['$sender', '$$userId'] },
                        { $eq: ['$receiver', new mongoose.Types.ObjectId(id)] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ['$receiver', '$$userId'] },
                        { $eq: ['$sender', new mongoose.Types.ObjectId(id)] },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $sort: { createdAt: -1 },
            },
            {
              $limit: 1,
            },
          ],
          as: 'recentMessages',
        },
      },
      {
        $project: {
          nickname: 1,
          profilePic: {
            $filter: {
              input: '$profilePic',
              as: 'pic',
              cond: { $eq: ['$$pic.isMain', true] },
            },
          },
          recentMessages: 1,
        },
      },
    ])

    return res.status(200).json(filteredUsers)
  } catch (error) {
    console.log(error)
  }
})

router.get('/:id', async (req, res) => {
  const output = {
    ok: false,
    data: {},
    message: '',
  }
  try {
    const { id: userToChatId } = req.params

    const myId = req.user
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    })
    const formattedMessages = messages.map((message) => {
      const messageObj = message.toObject()
      messageObj.createdAt = moment(message.createdAt).format('h:mm')
      return messageObj
    })

    output.ok = true
    output.data = formattedMessages
    res.json(output)
  } catch (error) {
    console.log(error)
    output.message = 'Server Error'
    res.status(500).json(output)
  }
})

router.post('/send/:id', upload.single('image'), async (req, res) => {
  const output = {
    ok: false,
    data: {},
    message: '',
  }
  try {
    const { text } = req.body
    let filename = null
    if (req.file) {
      filename = req.file.filename
    }
    const receiverId = req.user
    const senderId = req.params.id
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: filename,
    })
    await newMessage.save()
    // socket.io 實時更新
    const socketId = getOnlineSocketId(senderId)
    io.to(socketId).emit('newMessage', {
      _id: newMessage._id,
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      text: newMessage.text,
      createdAt: moment(newMessage.createdAt).format('h:mm'),
    })

    output.ok = true
    output.data = newMessage
    res.json(output)
  } catch (error) {
    console.log(error)
  }
})
export default router
