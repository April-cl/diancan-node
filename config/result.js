class result {
  constructor (ctx, msg='SUCCESS', code=200, data=null, extra=null) {
    this.ctx = ctx
    this.msg = msg
    this.code = code
    this.data = data
    this.extra = extra
  }
  answer () {
    this.ctx.body = {
      msg: this.msg,
      data: this.data,
      extra: this.extra
    }
  }
}

module.exports = result