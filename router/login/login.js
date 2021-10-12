const result = require('../../config/result.js')
const router = require('koa-router')()
const {getToken, AddUrl} = require('../../config/databaseapi.js')

router.get('/register', async ctx => {
  console.log('login.js')
  let name = 'April'
  let query = `db.collection("ceshi").add({data:{name:'${name}'}})`
  let res = await new getToken().posteve(AddUrl, query)
  console.log(res)
})

module.exports = router.routes()