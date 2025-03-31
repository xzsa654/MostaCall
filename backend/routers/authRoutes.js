import e from 'express'
import upload from '../lib/upload.js'
import User from '../models/user-model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { protectRoute } from '../middlewares/protectRoute.js'
const router = e.Router()

router.post('/signup', upload.none(), async (req, res) => {
  const { email, password, nickname, birthday, gender } = req.body

  if (password.length < 6) res.status(400).json({ message: '密碼長度不足' })
  try {
    const user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: 'email 已被註冊' })
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
      nickname,
      email,
      password: hashedPassword,
      birthday,
      gender,
    })
    if (newUser) {
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
      await newUser.save()
      res.status(201).json({
        user_id: newUser._id,
        nickname: newUser.nickname,
        token: token,
      })
    } else {
      res.status(401).json({ message: 'error' })
    }
  } catch (err) {
    console.log(err)
  }
})
router.post('/login', upload.none(), async (req, res) => {
  const output = {
    ok: false,
    data: {},
    message: '',
  }
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status('400').json({ message: '帳號或密碼錯誤' })
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status('401').json({ message: '帳號或密碼錯誤' })
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  output.ok = true
  output.data = {
    user_id: user._id,
    profilePic: user.profilePic,
    token: token,
    nickname: user.nickname,
  }
  return res.json(output)
})
// 非必填欄位
router.post(
  '/optional',
  protectRoute,
  upload.array('profilePic[]', 9),
  async (req, res) => {
    try {
      const uploadedFiles = req.files
      const { about } = req.body
      const userId = req.user
      const photoData = []
      // 假設檔案已上傳到伺服器或雲端，並獲得了URL
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        // 或 const fileUrl = await uploadToCloudStorage(file); // 雲存儲

        photoData.push({
          url: file.filename,
          position: i,
          isMain: i === 0, // 第一張設為主圖
          uploadedAt: new Date(),
          fileType: file.mimetype,
          fileSize: file.size,
        })
      }
      // 建立更新對象
      const updateObj = {}
      if (photoData.length > 0) {
        updateObj.$push = { profilePic: { $each: photoData } }
      }

      // 如果提供了 about，添加到更新對象
      if (about !== undefined) {
        updateObj.$set = { about: about }
      }
      // 更新用戶文檔，添加新圖片
      const user = await User.findByIdAndUpdate({ _id: userId }, updateObj, {
        new: true,
        select: '-password -updateAt -createdAt',
      })
      const mainPic = user.profilePic.find((v) => v.isMain)

      const newUser = { ...user._doc, profilePic: mainPic }

      res.status(200).json({ success: true, newUser })
    } catch (error) {
      console.error('Upload error:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

router.put(
  '/update',
  protectRoute,
  upload.single('updateImg'),
  async (req, res) => {
    const output = {
      ok: false,
      data: {},
      message: '',
    }

    const { filename } = req.file

    const id = req.user
    const user = await User.findByIdAndUpdate(
      id,
      {
        profilePic: filename,
      },
      {
        new: true,
        select: '-password -updateAt -createdAt',
      }
    )
    output.data = user
    output.ok = true
    return res.json(output)
  }
)

export default router
