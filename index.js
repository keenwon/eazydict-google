'use strict';

const querystring = require('querystring');
const fetch = require('./lib/fetch');
const getToken = require('./lib/token');
const parser = require('./lib/parser');
const {
  EDOutput,
  CODES
} = require('eazydict-standard-output');

/**
 * 构造请求数据
 */
const getFetchData = (text, token) => {

  /**
   * 全中文，则翻译为英文
   * 否则统一翻译为中文
   */

  let to = /^[\u4e00-\u9fa5]+$/.test(text)
    ? 'en'
    : 'zh-CN';

  return {
    client: 't',
    sl: 'auto',
    tl: to,
    hl: to,
    dt: [
      'at', 'bd', 'ex', 'ld', 'md',
      'qca', 'rw', 'rm', 'ss', 't'
    ],
    ie: 'UTF-8',
    oe: 'UTF-8',
    otf: 1,
    ssel: 0,
    tsel: 0,
    kc: 4,
    tk: token,
    q: text
  }
};

/**
 * 入口
 */
function main(word) {
  if (!word) {
    return Promise.reject(new Error('请输入要查询的文字'));
  }

  let fetchBody, url, api;

  return getToken(word)
    .then(token => {
      fetchBody = getFetchData(word, token);
      url = `https://translate.google.com/#auto/${fetchBody.tl}/${encodeURIComponent(word)}`;
      api = `https://translate.google.com/translate_a/single?${querystring.stringify(fetchBody)}`;

      return fetch(api);
    })
    .then(data => parser(data))
    .catch(error => {
      if (error.name === 'FetchError') {
        return new EDOutput(CODES.NETWORK_ERROR);
      }

      return new EDOutput(CODES.OTHER);
    })
    .then(output => {
      // 添加插件信息
      output.pluginName = 'Google';
      output.url = url;

      return output;
    });

}

if (require.main === module) {
  // istanbul ignore next
  let word = process.argv.slice(2).join(' ');

  main(word)
    .then(result => {
      console.log(result); // eslint-disable-line no-console
    });
} else {
  module.exports = main;
}
