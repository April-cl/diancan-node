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
  const {name, address, logo} = ctx.request.body
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
  const cid = 'a' + new Date().getTime()
  const query = `db.collection('dishes-category').where({label:'${category}'}).get()`
  const cate = `db.collection('dishes-category').add({data:{value:'${category}',label:'${category}',cid:'${cid}',count:0,sale_quantity:0}})`
  try {
    const res = await new getToken().posteve(TripUrl, query)
    if (res.data.length > 0) {
      new result(ctx, '该类目已存在', 202).answer()
    } else {
      await new getToken().posteve(AddUrl, cate)
      new result(ctx, '添加成功').answer()
    }
  } catch (e) {
    new result(ctx, '添加失败，服务器发生错误', 500).answer()
  }
})

router.get('/obtaincate', new Auth().m, async ctx => {
  let {page} = ctx.query
  let sk = page * 10
  const query = `db.collection('dishes-category').orderBy('cid','desc').limit(10).skip('${sk}').get()`
  try {
    const res = await new getToken().posteve(TripUrl, query)
    const data = res.data.map(item => JSON.parse(item))
    const total = {total:res.pager.Total}
    const array = {...{result:data}, ...total}
    new result(ctx, 'SUCCESS', 200, array).answer()
  } catch (e) {
    new result(ctx, '服务器发生错误', 500).answer()
  }
})

module.exports = router.routes()