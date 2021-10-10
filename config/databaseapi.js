const axios = require('axios')
const qs = require('querystring')
const result = require('./handle.js')

let param = qs.stringify({
  grant_type: 'client_credential',
  appid: 'wxfc13ec009236656e',
  secret: '01ff08a1e9d0354b5cfcfe002e2f1236'
})

let url = 'https://api.weixin.qq.com/cgi-bin/token?' + param

class getToken {
  constructor () {
  }

  async gettoken() {
    try {
      let token = await axios.get(url)
      console.log(token)
      if (token.status === 200) {
        return token.data.access_token
      } else {
        throw '获取 token 错误'
      }
    } catch (e) {
      console.log(e)
      throw new result(e, 500)
    }
  }
}

module.exports = {getToken}