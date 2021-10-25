const multer = require('@koa/multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/image')
  },
  filename: (req, file, cb) => {
    console.log(file)
    let fileFormat = (file.originalname).split('.')
    console.log(fileFormat)
    let num = `${Date.now()}-${Math.floor(Math.random()*10000000)}${'.'}${fileFormat[fileFormat.length-1]}`
    console.log(num)
  }
})

const upload = multer({storage})

module.exports = {upload}