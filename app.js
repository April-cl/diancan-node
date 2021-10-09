const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')()
const cors = require('koa2-cors')

app.use(cors())
app.use(json())
app.use(bodyParser())

const login = require('./router/login/login.js')

router.use('/api', login)

app.use(router.routes()).use(router.allowedMethods())

app.listen(5000)
console.log('success')