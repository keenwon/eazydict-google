'use strict';

const HttpsProxyAgent = require('https-proxy-agent');
const SocksProxyAgent = require('socks-proxy-agent');

function proxy() {
  let proxy = 'socks://127.0.0.1:1080';

  return new SocksProxyAgent(proxy);
}

module.exports = proxy;