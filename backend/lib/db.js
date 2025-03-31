import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
  } catch (e) {
    console.log(e)
  }
}
