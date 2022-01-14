const axios = require('axios')
const qs = require('querystring')
const result = require('./handle.js')

let param = qs.stringify({
  grant_type: 'client_credential',
  appid: '需要修改',
  secret: '需要修改'
})

let url = 'https://api.weixin.qq.com/cgi-bin/token?' + param

let env = '需要修改'

let AddUrl = 'https://api.weixin.qq.com/tcb/databaseadd?access_token='

let TripUrl = 'https://api.weixin.qq.com/tcb/databasequery?access_token='

let UpdateUrl = 'https://api.weixin.qq.com/tcb/databaseupdate?access_token='

let Subscribe = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='

let Qrcode = 'https://api.weixin.qq.com/wxa/getwxacode?access_token='

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

  async subscribe(touser, data) {
    try {
      let token = await this.gettoken()
      let OBJ = {
        touser,
        data,
        template_id: '86PH_DZpVKd_5L0dNAqxzlbwCcTHbR7IQrjcxh0OuH8',
        page: 'pages/my-order/my-order',
        miniprogram_state: 'developer'
      }
      let colldata = await axios.post(Subscribe + token, OBJ)
      return 'success'
    } catch (e) {
      throw new result(e, 500)
    }
  }

  async qrcode(number) {
    let token = await this.gettoken()
    let OBJ = JSON.stringify({path: 'pages/index/index?number=' + number})
    try {
      let colldata = await axios.post(Qrcode + token, OBJ, {responseType: 'arraybuffer'})
      return colldata
    } catch (e) {
      throw new result(e, 500)
    }
  }
}

module.exports = {getToken, AddUrl, TripUrl, UpdateUrl}