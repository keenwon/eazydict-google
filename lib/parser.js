'use strict';

const debug = require('./debug');
const {
  EDOutput,
  Translate,
  CODES
} = require('eazydict-standard-output');

function main(data) {
  try {
    return parser(data);
  } catch (e) {
    return new EDOutput(CODES.PARSE_ERROR, e.message);
  }
}

function parser(data) {
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

      debug('translate object: %O', translate);

      trans.push(translate);
    });
  } else {
    // 翻译短语

    data[5][0][2].forEach(item => {
      let tran = item[0];
      let translate = new Translate('', tran);

      debug('translate object: %O', translate);

      trans.push(translate);
    });
  }

  output.translates = trans;

  return output;
}

module.exports = main;
