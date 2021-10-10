const result = require('../../config/result.js')
const router = require('koa-router')()

router.get('/register', async ctx => {
  console.log('login.js')
  new result(ctx, '请求成功').answer()
})

module.exports = router.routes()