'use strict';

const path = require('path');
const fs = require('fs');

const filePath = path.resolve(__dirname, '../.token');

function get() {
  return new Promise(resolve => {
    fs.readFile(filePath, (error, data) => {
      if (error) {
        // 不报错
        resolve('');
      }

      resolve(data.toString());
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
