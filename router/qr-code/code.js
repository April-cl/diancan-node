const router = require('koa-router')()
const result = require('../../config/result')
const  {getToken, AddUrl, TripUrl, UpdateUrl} = require('../../config/databaseapi')
const {postcode} = require('../../config/checking')
const {Auth} = require('../../token/auth')
const {buffer} = require('../../cos/cos')
const moment = require('moment')
moment.locale('zh-cn')
const {Code} = require('../../config/code-img')

router.post('/qrcode', new Auth().m, async ctx => {
  let {table} = ctx.request.body
  new postcode(ctx, table).start()
  try {
    let res_code = await new getToken().qrcode(table)
    const res_img = await buffer(Code(), res_code.data)
  } catch (e) {}
})

module.exports = router.routes()