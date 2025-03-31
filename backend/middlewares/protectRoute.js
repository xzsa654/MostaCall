import jwt from 'jsonwebtoken'
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.header('authorization').split('Bearer ')[1]
    if (!token) return res.status(400).json({ message: 'no access token' })
    const { id } = await jwt.decode(token, process.env.JWT_SECRET)
    req.user = id
    next()
  } catch (error) {}
}
