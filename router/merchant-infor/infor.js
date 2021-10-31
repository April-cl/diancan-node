const {shopinfor, catecheck} = require('../../config/checking.js')
const {Auth} = require('../../token/auth.js')
const result = require('../../config/result.js')
const {getToken, AddUrl, TripUrl, UpdateUrl} = require('../../config/databaseapi.js')
const router = require('koa-router')()
const {upload, codfun} = require('../../cos/cos.js')

router.post('/uploadres', upload.single('file'), async ctx => {
  try {
    const res = await codfun(ctx.file.filename, ctx.file.path)
    new result(ctx, 'SUCCESS', 200, 'https://'+res).answer()
  } catch (e) {
    new result(ctx, '上传失败，服务器发生错误', 500).answer()
  }
})

router.post('/uploadshop', new Auth().m, async ctx => {
  const {id, name, address, logo} = ctx.request.body
  new shopinfor(ctx, name, address, logo).start()
  let query = `db.collection('shop-infor').add({data:{name:'${name}',address:'${address}',logo:${logo}}})`
  try {
    await new getToken().posteve(AddUrl, query)
    new result(ctx, '提交成功').answer()
  } catch (e) {
    new result(ctx, '提交失败，服务器发生错误', 500).answer()
  }
})

router.get('/obtainshop', new Auth().m, async ctx => {
  const query = `db.collection('shop-infor').get()`
  try {
    let res = await new getToken().posteve(TripUrl, query)
    const data = res.data.map(item => {return JSON.parse(item)})
    new result(ctx, 'SUCCESS', 200, data).answer()
  } catch (e) {
    new result(ctx, '提交失败，服务器发生错误', 500).answer()
  }
})

router.post('/modifyshop', new Auth().m, async ctx => {
  const {id, name, address, logo} = ctx.request.body
  new shopinfor(ctx, name, address, logo).start()
  let query = `db.collection('shop-infor').doc('${id}').update({data:{name:'${name}',address:'${address}',logo:${logo}}})`
  try {
    await new getToken().posteve(UpdateUrl, query)
    new result(ctx, '修改成功').answer()
  } catch (e) {
    new result(ctx, '修改失败，服务器发生错误', 500).answer()
  }
})

router.post('/addcategory', new Auth().m, async ctx => {
  const {category} = ctx.request.body
  new catecheck(ctx, category).start()
})

module.exports = router.routes()