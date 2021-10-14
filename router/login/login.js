const result = require('../../config/result.js')
const router = require('koa-router')()
const {getToken, AddUrl} = require('../../config/databaseapi.js')
const {regcheck} = require('../../config/checking')

router.post('/register', async ctx => {
  let {account, password} = ctx.request.body
  new regcheck(ctx, account, password).start()
})

module.exports = router.routes()