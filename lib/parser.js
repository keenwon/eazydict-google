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

  debug('parser data: %j', data);

  data[1].forEach(item => {
    let type = item[0];
    let tran = item[1].slice(0, 8).join(', ');
    let translate = new Translate(type, tran);

    debug('translate object: %O', translate);

    trans.push(translate);
  });

  output.translates = trans;

  return output;
}

module.exports = main;
