const {shopinfor, catecheck, unitcheck} = require('../../config/checking.js')
const {Auth} = require('../../token/auth.js')
const result = require('../../config/result.js')
const {getToken, AddUrl, TripUrl, UpdateUrl} = require('../../config/databaseapi.js')
const router = require('koa-router')()
const {upload, codfun} = require('../../cos/cos.js')

router.get('/obtainunit', new Auth().m, async ctx => {
  const query = `db.collection('dishunit').get()`
  try {
    const res = await new getToken().posteve(TripUrl, query)
    const data = res.data.map(item => JSON.parse(item))
    new result(ctx, 'SUCCESS', 200, data).answer()
  } catch (e) {
    new result(ctx, '服务器发生错误', 500).answer()
  }
})

router.post('/dishunit', new Auth().m, async ctx => {
  const unid = new Date().getTime()
  const {unit} = ctx.request.body
  new unitcheck(ctx, unit).start()
  const query = `db.collection('dishunit').where({label:'${unit}'}).get()`
  const cate = `db.collection('dishunit').add({data:{value:'${unit}',label:'${unit}',unid:'${unid}'}})`
  try {
    const res = await new getToken().posteve(TripUrl, query)
    if (res.data.length > 0) {
      new result(ctx, '该菜品单位已存在', 202).answer()
    } else {
      await new getToken().posteve(AddUrl, cate)
      new result(ctx, '添加成功').answer()
    }
  } catch (e) {
    new result(ctx, '提交失败，服务器发生错误', 500).answer()
  }
})

module.exports = router.routes()