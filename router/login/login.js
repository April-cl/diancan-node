const result = require('../../config/result.js')
const router = require('koa-router')()
const {getToken, AddUrl, Tripurl} = require('../../config/databaseapi.js')
const {regcheck} = require('../../config/checking')

router.post('/register', async ctx => {
  let {account, password} = ctx.request.body
  new regcheck(ctx, account, password).start()
  const query = `db.collection('business-acc').where({account:'${account}'}).get()`
  try {
    const user = await new getToken().posteve(Tripurl, query)
    if (user.data.length > 0) {
      new result(ctx, '已经注册过了', 202).answer()
    } else {
      const uid = new Date().getTime()
      const struid = JSON.stringify(uid)
      const OBJ = {account, password, uid: struid}
      const STR = JSON.stringify(OBJ)
      const addQuery = `db.collection('business-acc').add({data:${STR}})`
      await new getToken().posteve(AddUrl, addQuery)
      new result(ctx, '注册成功').answer()
    }
  } catch (e) {
    new result(ctx, '注册失败，服务器发生错误', 500)
  }
})

module.exports = router.routes()