import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: [
        {
          // 明確定義為數組類型
          url: String,
          position: Number,
          isMain: Boolean,
          uploadedAt: Date,
          fileType: String,
          fileSize: Number,
        },
      ],
      default: [], // 預設為空數組
    },
    birthday: {
      type: Date,
      required: true,
    },
    about: {
      type: String,
    },
    gender: {
      // 0: 男, 1: 女
      type: Number,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
)
const User = mongoose.model('User', userSchema)

export default User
