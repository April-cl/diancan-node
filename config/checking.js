const result = require('./handle')

class checking {
  constructor (ctx, ...obj) {
    this.ctx = ctx
    this.obj = obj
  }
  Errunder () {
    let bvc = this.obj.indexOf(undefined)
    if (bvc !== -1) {
      throw new result('参数填写错误', 400)
    }
  }
  ValidField (field, msg, num) {
    let reg = {
      'phone': /^1[3456789]\d{9}$/,
      'password': /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/
    }
    if(!reg[field].test(this.obj[num])){
      throw new result(msg, 202)
    }
  }
}

class regcheck extends checking {
  start() {
    super.Errunder()
    super.ValidField('phone', '请填写正确的手机号码', 0)
    super.ValidField('password', '密码必须由6-20位数字和字母的组合', 1)
  }
}

module.exports = {regcheck}