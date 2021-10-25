const multer = require('@koa/multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/image')
  }
})

const upload = multer({storage})

module.exports = {upload}