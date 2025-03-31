import multer from 'multer'
import { v4 } from 'uuid'

const extMap = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

const fileFilter = (req, file, cb) => {
  cb(null, !!extMap[file.mimetype])
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    const f = v4() + extMap[file.mimetype]
    cb(null, f)
  },
})
export default multer({ fileFilter, storage })
