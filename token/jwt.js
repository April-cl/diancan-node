const jwt = require('jsonwebtoken')

const {security} = require('./tokentime.js')

function gentoken (uid, scope = 2) {
  const {secretKey, expiresIn} = security
  const token = jwt.sign({uid, scope}, secretKey, {expiresIn})
  return token
}

module.exports = {gentoken}