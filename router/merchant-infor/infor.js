const {shopinfor} = require('../../config/checking')

const {Auth} = require('../../token/auth.js')

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

router.post('/uploadshop', new Auth().m, async ctx => {
  const {id, name, address, logo} = ctx.request.body
  console.log(id)
  new shopinfor(ctx, name, address, logo).start()
})

module.exports = router.routes()