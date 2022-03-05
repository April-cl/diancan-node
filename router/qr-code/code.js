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
  } catch (e) {
    new result(ctx, '服务器发生错误', 500).answer()
  }
})

router.get('/getqrcode', new Auth().m, async ctx => {
  let {page} = ctx.query
  let sk = Number(page) * 10
  const query = `db.collection('table_qr_code').orderBy('time', 'desc').limit(10).skip(${sk}).get()`
  try {
    const res = await new getToken().posteve(TripUrl, query)
    const data = res.data.map(item => JSON.parse(item))
    const total = {total: res.pager.Total}
    const array = {...{result: data}, ...total}
    new result(ctx, 'SUCCESS', 200, array).answer()
  } catch (e) {
    new result(ctx, '服务器发生错误', 500).answer()
  }
})

router.get('/salesvolume', new Auth().m, async ctx => {
  try {
    let arr = [6, 5, 4, 3, 2, 1, 0]
    let catedays = arr.map((item)=>{
      return moment().utcOffset(8).subtract(item,'days').format('YYYY-MM-DD')
    })
    let str = JSON.stringify(catedays)
    const query = `db.collection('seven_day_sales').where({time:db.command.in(${str})}).orderBy('time','asc').field({time:true,sales_value:true}).get()`
    const res = await new getToken().posteve(TripUrl, query)
    const data = res.data.map(item => {
      return {
        sales_value: JSON.parse(item).sales_value,
        time: JSON.parse(item).time,
        unix: moment(JSON.parse(item).time).unix()
      }
    })
    let days = catedays.map(item => {
      return {
        sales_value: 0,
        time: item,
        unix: moment(item).unix()
      }
    })
    let obj ={}
    let removal = [...data, ...days].reduce((prev, item) => {
      if (!obj[item.time]) {
        prev.push(item)
        obj[item.time] = true
      }
      return prev
    }, [])
    let res_sort = removal.sort((A, B) => {
      return (A.unix - B.unix)
    })
    new result(ctx, 'SUCCESS', 200, res_sort).answer()
  } catch (e) {
    new result(ctx, '服务器发生错误', 500).answer()
  }

})


module.exports = router.routes()