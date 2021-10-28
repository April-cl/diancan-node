const result = require('../../config/result')
const router = require('koa-router')()
const {upload, codfun} = require('../../cos/cos.js')

router.post('/uploadres', upload.single('file'), async ctx => {
  try {
    const res = await codfun(ctx.file.filename, ctx.file.path)
    new result(ctx, 'SUCCESS', 200, 'https://'+res).answer()
  } catch (e) {
    new result(ctx, '上传失败，服务器发生错误', 500).answer()
  }
})

module.exports = router.routes()