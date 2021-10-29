const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const {security} = require('./tokentime.js')
const result = require('../config/handle.js')

class Auth {
  constructor () {
  }

  get m() {
    return async (ctx, next) => {
      const token = basicAuth(ctx.req)
      if (!token || !token.name) {
        throw new result({errcode: '401', msg: '没有访问权限'}, 401)
      }
      try {
        var authcode = jwt.verify(token.name, security.secretKey)
      } catch (e) {
        if (e.name === 'TokenExpiredError') {
          throw new result({errcode: '401', msg: '账号过期，请重新登录'}, 401)
        }
        throw new result({errcode: '401', msg: '没有访问权限'}, 401)
      }
      ctx.auth = {
        uid: authcode.uid
      }
      await next()
    }
  }
}

module.exports = {Auth}