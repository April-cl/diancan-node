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
  let time = moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
  try {
    const query = `db.collection('table_qr_code').where({table:'${table}'}).get()`

    const res = await new getToken().posteve(TripUrl, query)
    console.log(res)
    if (res.data.length > 0) {
      new result(ctx, '该桌号已存在', 202).answer()
    } else {
      let res_code = await new getToken().qrcode(table)
      const res_img = await buffer(Code(), res_code.data)
      let code_image = 'https://' + res_img
      let table_data = `db.collection('table_qr_code').add({data:{time:'${time}',table:'${table}',code:'${code_image}'}})`
      await new getToken().posteve(AddUrl, table_data)
      new result(ctx, '添加成功').answer()
    }
  } catch (e) {}
})

module.exports = router.routes()