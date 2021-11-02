const {shopinfor, catecheck} = require('../../config/checking.js')
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
    console.log(data)
    new result(ctx, 'SUCCESS', 200, data).answer()
  } catch (e) {
    new result(ctx, '服务器发生错误', 500).answer()
  }
})

module.exports = router.routes()