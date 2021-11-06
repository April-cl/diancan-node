const {shopinfor, catecheck, unitcheck, putoncheck} = require('../../config/checking.js')
const {Auth} = require('../../token/auth.js')
const result = require('../../config/result.js')
const {getToken, AddUrl, TripUrl, UpdateUrl} = require('../../config/databaseapi.js')
const router = require('koa-router')()
const {upload, codfun} = require('../../cos/cos.js')
const moment = require('moment')
moment.locale('zh-cn')

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
    new result(ctx, '添加失败，服务器发生错误', 500).answer()
  }
})

router.post('/uploaddishes', new Auth().m, async ctx => {
  const {id, category, name, unitprice, unit, image, value} = ctx.request.body
  new putoncheck(ctx, category, name, unitprice, unit, image, value).start()
  let time = moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
  let query = `db.collection('dishes-data').add({data:{
    category:'${category}',name:'${name}',unitprice:${unitprice},unit:'${unit}',image:${image},quantity:0,onsale:true,cid:'${value}',time:'${time}',monthlysale:0
  }})`
  let count = `db.collection('dishes-category').where({cid:'${value}'}).update({data:{count:db.command.inc(1)}})`
  try {
    await new getToken().posteve(AddUrl, query)
    await new getToken().posteve(UpdateUrl, count)
    new result(ctx,'提交成功').answer()
  } catch (e) {
    new result(ctx, '提交失败，服务器发生错误', 500).answer()
  }
})

router.get('/obtaindishes', new Auth().m, async ctx => {
  let {page} = ctx.query
  let sk = page * 10
  const query = `db.collection('dishes-data').orderBy('time', 'desc').limit(10).skip(${sk}).get()`
  try {
    const res = await new getToken().posteve(TripUrl, query)
    const data = res.data.map(item => JSON.parse(item))
    const total = {total:res.pager.Total}
    const array = {...{result:data}, ...total}
    new result(ctx, 'SUCCESS', 200, array).answer()
  } catch (e) {
    new result(ctx, '服务器发生错误', 500)
  }
})

router.get('/fromsale', new Auth().m, async ctx => {
  const {id, value} = ctx.query
  const query = `db.collection('dishes-data').doc('${id}').update({data:{onsale:false}})`
  let count = `db.collection('dishes-category').where({cid:'${value}'}).update({data:{count:db.command.inc(-1)}})`
  try {
    await new getToken().posteve(UpdateUrl, query)
    await new getToken().posteve(UpdateUrl, count)
    new result(ctx, '下架成功').answer()
  } catch (e) {
    new result(ctx, '服务器发生错误', 500).answer()
  }
})

router.post('/modifydishes', new Auth().m, async ctx => {
  const {id, category, name, unitprice, unit, image, value, valueBefore} = ctx.request.body
  new putoncheck(ctx, category, name, unitprice, unit, image, value).start()
  let time = moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
  let query = `db.collection('dishes-data').doc('${id}').update({data:{
    category:'${category}',name:'${name}',unitprice:${unitprice},unit:'${unit}',image:${image},quantity:0,onsale:true,cid:'${value}',time:'${time}'
  }})`
  let countBefore = `db.collection('dishes-category').where({cid:'${valueBefore}'}).update({data:{count:db.command.inc(-1)}})`
  let countAfter = `db.collection('dishes-category').where({cid:'${value}'}).update({data:{count:db.command.inc(1)}})`
  try {
    await new getToken().posteve(UpdateUrl, countBefore)
    await new getToken().posteve(UpdateUrl, query)
    await new getToken().posteve(UpdateUrl, countAfter)
    new result(ctx, '修改成功').answer()
  } catch (e) {
    new result(ctx, '服务器发生错误', 500).answer()
  }
})

module.exports = router.routes()