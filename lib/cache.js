'use strict'

const debug = require('./debug')
const path = require('path')
const fs = require('fs')

const filePath = path.resolve(__dirname, '../.token')

function get () {
  let token

  try {
    token = fs.readFileSync(filePath).toString()
  } catch (error) {
    debug('read token error: %o', error)
    token = ''
  }

  return token
}

function set (token) {
  try {
    fs.writeFileSync(filePath, token)
  } catch (error) {
    debug('write token error: %o', error)
  }
}

module.exports = {
  get,
  set
}
