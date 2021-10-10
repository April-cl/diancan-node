const result = require('../../config/result.js')
const router = require('koa-router')()
const {getToken} = require('../../config/databaseapi.js')

router.get('/register', async ctx => {
  console.log('login.js')
  new getToken().gettoken()
  new result(ctx, '请求成功').answer()
})

module.exports = router.routes()