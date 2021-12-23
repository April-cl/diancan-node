const router = require('koa-router')()
const result = require('../../config/result')
const  {getToken, AddUrl, TripUrl, UpdateUrl} = require('../../config/databaseapi')
const {shopinfor, catecheck, unitcheck, putoncheck} = require('../../config/checking')
const {Auth} = require('../../token/auth')
const {upload, codfun} = require('../../cos/cos')
const moment = require('moment')
moment.locale('zh-cn')

router.get('/obtainorder', new Auth().m, async ctx => {
  let {page, transac_status} = ctx.query
  let sk = Number(page) * 10
  let param = {}
  if (transac_status !== '') {
    param['transac_status'] = transac_status
  } else {
    delete param.transac_status
  }
  let OBJ = JSON.stringify(param)
  const query = `db.collection('order-data').where(${OBJ}).orderBy('order_time', 'desc').field({menu: false}).limit(10).skip(${sk}).get()`
  try {
    const res = await new getToken().posteve(TripUrl, query)
    const data = res.data.map(item => JSON.parse(item))
    const total = {total: res.pager.Total}
    const array = {...{result: data}, ...total}
    new result(ctx, 'SUCCESS', 200., array).answer()
  } catch (e) {
    new result(ctx, '服务器发生错误', 500).answer()
  }
})

router.get('/vieworder', new Auth().m, async ctx => {
  let {id} = ctx.query
  const query = `db.collection('order-data').doc('${id}').field({menu: true}).get()`
  try {
    const res = await new getToken().posteve(TripUrl, query)
    const data = res.data.map(item => JSON.parse(item))
    new result(ctx, 'SUCCESS', 200, data[0].menu).answer()
  } catch (e) {
    new result(ctx, '服务器发生错误', 500).answer()
  }
})

module.exports = router.routes()