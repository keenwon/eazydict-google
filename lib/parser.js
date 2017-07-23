'use strict';

const debug = require('./debug');
const {
  EDOutput,
  Translate,
  CODES
} = require('eazydict-standard-output');

function main(...argus) {
  try {
    return parser(...argus);
  } catch (e) {
    return new EDOutput(CODES.PARSE_ERROR, e.message);
  }
}

/**
 * 过滤无效翻译
 * 例如：asdf 会被翻译为 asdf
 */
function filterTranslate(translateList, words) {
  if (translateList && translateList.length === 1
    && translateList[0].trans === words) {
    return [];
  }

  return translateList;
}

function parser(data, words) {
  const output = new EDOutput();
  const trans = [];
  let count;

  debug('parser data: %j', data);

  if (data[1] && data[1].length) {
    // 翻译单词

    data[1].forEach(item => {
      let type = item[0];
      let tran = item[1].slice(0, 6).join(', ');
      let translate = new Translate(type, tran);

      debug('[word] translate object: %O', translate);

      trans.push(translate);
    });
  } else {
    // 翻译短语

    data[5][0][2].forEach(item => {
      let tran = item[0];
      let translate = new Translate('', tran);

      debug('[phrase] translate object: %O', translate);

      trans.push(translate);
    });
  }

  output.translates = filterTranslate(trans, words);

  return output;
}

module.exports = main;
