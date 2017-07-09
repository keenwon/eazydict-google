'use strict';

const {
  EDOutput,
  Translate,
  CODES
} = require('eazydict-standard-output');

function main(data) {
  try {
    return parser(data);
  } catch (e) {
    return new EDOutput(CODES.PARSE_ERROR);
  }
}

function parser(data) {
  const output = new EDOutput();
  const trans = [];

  data[1].forEach(item => {
    let type = item[0];
    let tran = item[1].slice(0, 8).join(', ');

    trans.push(new Translate(type, tran));
  });

  output.translates = trans;

  return output;
}

module.exports = main;
