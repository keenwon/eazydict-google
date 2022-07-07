'use strict'

const fetch = require('node-fetch')
const pRetry = require('p-retry')
const proxy = require('./proxy')

/* eslint-disable max-len */
const headers = {
  accept: 'text/html',
  'accept-encoding': 'gzip,deflate',
  'accept-language': 'zh-CN,zh;q=0.8',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
  referer: 'https://translate.google.cn/',
  'user-agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36',
}
/* eslint-enable max-len */

function main(url, configs, responseType = 'json') {
  const retryOptions = {
    retries: configs.retries,
  }

  const fetchOptions = {
    headers,
    timeout: configs.timeout,
    agent: proxy(configs.proxy),
  }

  return pRetry(function () {
    return fetch(url, fetchOptions).then((response) => {
      return responseType === 'json' ? response.json() : response.text()
    })
  }, retryOptions)
}

module.exports = main
