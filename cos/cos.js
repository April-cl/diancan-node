const multer = require('@koa/multer')
const COS = require('cos-nodejs-sdk-v5')

var cos = new COS({
  SecretId: '需要修改',
  SecretKey: '需要修改',
  Protocol: 'https:'
})

let Bucket = '需要修改'
let Region = '需要修改'
let codfun = function (filename, path) {
  return new Promise((resolve, reject) => {
    cos.uploadFile({
      Bucket,
      Region,
      Key: filename,
      FilePath: path
    }).then(res => {
      resolve(res.Location)
    }).catch(err => {
      reject(err)
    })
  })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/image')
  },
  filename: (req, file, cb) => {
    let fileFormat = (file.originalname).split('.')
    let num = `${Date.now()}-${Math.floor(Math.random()*10000000)}${'.'}${fileFormat[fileFormat.length-1]}`
    cb(null, num)
  }
})

const upload = multer({storage})

module.exports = {upload, codfun}