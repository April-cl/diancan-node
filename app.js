const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')()
const cors = require('koa2-cors')
const abnormal = require('./config/abnormal.js')

app.use(cors())
app.use(json())
app.use(bodyParser())
app.use(abnormal)

const login = require('./router/login/login.js')
const uploadres = require('./router/merchant-infor/infor.js')
const dish = require('./router/dish-manage/dish.js')
const order = require('./router/order/order.js')

router.use('/api', login)
router.use('/api', uploadres)
router.use('/api', dish)
router.use('/api', order)

app.use(router.routes()).use(router.allowedMethods())

app.listen(5000)
console.log('success')