'use strict';

const debug = require('./lib/debug');
const querystring = require('querystring');
const fetch = require('./lib/fetch');
const getToken = require('./lib/token');
const parser = require('./lib/parser');
const defaultsDeep = require('lodash.defaultsdeep');
const defaultConfigs = require('./defaultConfig');
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
   *
   * 注意:
   *
   * 使用 auto 的时候，会识别拼音。例如 you 翻译为 “有”
   * 所以强制设为英汉互译
   */
  let from, to;

  if (/^[\u4e00-\u9fa5]+$/.test(text)) {
    from = 'zh-CN';
    to = 'en';
  } else {
    from = 'en';
    to = 'zh-CN';
  }

  return {
    client: 't',
    sl: from,
    tl: to,
    hl: 'zh-CN',
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
function main(words, userConfigs) {
  debug('run with arguments %O', {
    words,
    userConfigs
  });

  let configs = defaultsDeep(defaultConfigs, userConfigs);

  debug('use configs %O', configs);

  if (!words) {
    return Promise.reject(new Error('请输入要查询的文字'));
  }

  let fetchBody, url, api;

  return getToken(words, configs)
    .then(token => {
      fetchBody = getFetchData(words, token);
      url = `https://translate.google.cn/#auto/${fetchBody.tl}/${encodeURIComponent(words)}`;
      api = `https://translate.google.cn/translate_a/single?${querystring.stringify(fetchBody)}`;

      debug(`fetch url: ${url.replace(/%/g, '%%')}`);
      debug(`fetch api: ${api.replace(/%/g, '%%')}`);

      return fetch(api, configs);
    })
    .then(data => parser(data, configs))
    .catch(error => {
      if (error.name === 'FetchError') {
        return new EDOutput(CODES.NETWORK_ERROR);
      }

      return new EDOutput(CODES.OTHER);
    })
    .then(output => {
      // 添加插件信息
      output.pluginName = 'Google';
      output.words = words;
      output.url = url;

      debug('output: %O', output);

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
