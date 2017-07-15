'use strict';

const path = require('path');
const fs = require('fs');

const filePath = path.resolve(__dirname, '../.token');

function get() {
  return new Promise(resolve => {
    fs.readFile(filePath, (error, data) => {
      let token;

      if (error) {
        // 不报错
        token = '';
      } else {
        token = data ? data.toString() : '';
      }

      resolve(token);
    })
  });
}

function set(token) {
  return new Promise(resolve => {
    fs.writeFile(filePath, token, (error, data) => {
      if (error) {
        // 不报错
        resolve();
      }

      resolve();
    })
  });
}

module.exports = {
  get,
  set
};
