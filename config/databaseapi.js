const axios = require('axios')
const qs = require('querystring')
const result = require('./handle.js')

let param = qs.stringify({
  grant_type: 'client_credential',
  appid: 'wxfc13ec009236656e',
  secret: '01ff08a1e9d0354b5cfcfe002e2f1236'
})

let url = 'https://api.weixin.qq.com/cgi-bin/token?' + param

let env = 'cloud1-6g8yjb3439a1e737'

let AddUrl = 'https://api.weixin.qq.com/tcb/databaseadd?access_token='

let TripUrl = 'https://api.weixin.qq.com/tcb/databasequery?access_token='

let UpdateUrl = 'https://api.weixin.qq.com/tcb/databaseupdate?access_token='

class getToken {
  constructor () {
  }

  async gettoken() {
    try {
      let token = await axios.get(url)
      if (token.status === 200) {
        return token.data.access_token
      } else {
        throw '获取 token 错误'
      }
    } catch (e) {
      throw new result(e, 500)
    }
  }

  async posteve(dataUrl, query) {
    try {
      let token = await this.gettoken()
      let data = await axios.post(dataUrl + token, {env, query})
      if (data.data.errcode === 0) {
        return data.data
      } else {
        throw '请求出错'
      }
    } catch(e) {
      throw new result(e, 500)
    }
  }
}

module.exports = {getToken, AddUrl, TripUrl, UpdateUrl}