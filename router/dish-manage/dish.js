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
    console.log(res)
  } catch (e) {
    console.log(e)
  }
})

module.exports = router.routes()