const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')()
const cors = require('koa2-cors')

app.use(cors())
app.use(json())
app.use(bodyParser())

app.use(router.routes()).use(router.allowedMethods())

app.listen(4000)
console.log('success')