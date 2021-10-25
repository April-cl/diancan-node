const router = require('koa-router')()
const {upload} = require('../../cos/cos.js')

router.post('/uploadres', upload.single('file'), async ctx => {
  console.log('infor.js')
})

module.exports = router.routes()