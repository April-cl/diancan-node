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
  Arrfun (list, num) {
    if (JSON.parse(this.obj[num]).length === 0) {
      throw new result(list, 202)
    }
  }
  Parameter (list) {
    let bvc = this.obj.indexOf('')
    if (bvc !== -1) {
      throw new result(list[bvc],202)
    }
  }
  Blank (list) {
    let vbn = this.obj.filter(item => {
      return item.split(' ').join('').length === 0
    })
    let bvc = this.obj.indexOf(vbn[0])
    if (bvc !== -1) {
      throw new result(list[bvc], 202)
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

class shopinfor extends checking {
  start() {
    let arr = ['请输入店铺名称', '请输入店铺地址', '请上传店铺logo']
    super.Errunder()
    super.Parameter(arr)
    super.Blank(arr)
    super.Arrfun('请上传店铺logo', 2)
  }
}

class catecheck extends checking {
  start() {
    let arr = ['请输入菜品类目']
    super.Errunder()
    super.Parameter(arr)
    super.Blank(arr)
  }
}

class unitcheck extends checking {
  start() {
    let arr = ['请输入自定义单位']
    super.Errunder()
    super.Parameter(arr)
    super.Blank(arr)
  }
}

class putoncheck extends checking {
  start() {
    let arr = ['请输入菜品类目', '请输入菜品名称', '请输入菜品价格', '请选择菜品单位', '请上传菜品图片', '请上传所属类目的cid']
    super.Errunder()
    super.Parameter(arr)
    super.Blank(arr)
    super.Arrfun('请上传菜品图片', 4)
  }
}

class postcode extends checking {
  start() {
    let arr = ['桌号不能为空']
    super.Errunder()
    super.Parameter(arr)
    super.Blank(arr)
  }
}

module.exports = {regcheck, shopinfor, catecheck, unitcheck, putoncheck, postcode}