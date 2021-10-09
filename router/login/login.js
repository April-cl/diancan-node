const router = require('koa-router')()

router.get('/register', async ctx => {
  console.log('login.js')
})

module.exports = router.routes()