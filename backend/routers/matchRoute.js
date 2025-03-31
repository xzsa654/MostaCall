import e from 'express'
import User from '../models/user-model.js'
import { io, getOnlineSocketId } from '../socket/socket.js'
import { Socket } from 'socket.io'
const router = e.Router()

router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.user)

    // 构建查询条件
    const queryConditions = [
      { _id: { $ne: currentUser.id } }, // 不包括当前用户
      { gender: { $ne: currentUser.gender } }, // 查找与当前用户性别不同的用户
    ]

    // 只有当这些数组存在且不为空时才添加到查询条件中
    if (currentUser.likes && currentUser.likes.length > 0) {
      queryConditions.push({ _id: { $nin: currentUser.likes } })
    }

    if (currentUser.dislikes && currentUser.dislikes.length > 0) {
      queryConditions.push({ _id: { $nin: currentUser.dislikes } })
    }

    if (currentUser.matches && currentUser.matches.length > 0) {
      queryConditions.push({ _id: { $nin: currentUser.matches } })
    }

    const users = await User.find({ $and: queryConditions })

    return res.status(200).json({ success: true, users })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'server error' })
  }
})

router.get('/swiper-right/:likedUserId', async (req, res) => {
  try {
    const likedUserId = req.params.likedUserId
    const currentUser = await User.findById(req.user)
    const likedUser = await User.findById(likedUserId)
    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId)
      await currentUser.save()
    }

    if (likedUser.likes.includes(currentUser.id)) {
      currentUser.matches.push(likedUserId)
      likedUser.matches.push(currentUser.id)
      await Promise.all([currentUser.save(), likedUser.save()])

      const socketId = getOnlineSocketId(likedUserId)

      io.to(socketId).emit('newMatch', {
        _id: currentUser._id,
        nickname: currentUser.nickname,
        image: currentUser.profilePic[0],
      })

      return res
        .status(200)
        .json({ success: true, user: currentUser, message: 'good match' })
    }
    return res.status(200).json({ success: true, user: currentUser })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'sever error' })
  }
})

router.get('/swiperLeft/:dislikedId', async (req, res) => {
  try {
    const disLikedId = req.params.dislikedId
    const currentUser = await User.findById(req.user)
    if (!currentUser.dislikes.includes(disLikedId)) {
      currentUser.dislikes.push(disLikedId)
      await currentUser.save()
    }
    return res.status(200).json({ success: true, user: currentUser })
  } catch (ex) {
    console.log(ex)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})
export default router
