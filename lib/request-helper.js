const URI = require('urijs');
const axios = require('axios');
const merge = require('lodash.merge');

function RequestHelper(serverURL, options = { }) {

  this.serverURL = URI(serverURL);

  if (typeof options.timeout !== 'number') {
    options.timeout = 0;
  }

  this.options = merge({
    allowHttp: false,
    timeout: 0,
  }, options);

  if (this.serverURL.protocol() !== 'https' && !this.options.allowHttp) {
    throw new Error('stellar-auth.errors.insecure-server');
  }

  this.axios = axios;
  this.axios.defaults.timeout = this.options.timeout;

  // this.axios = axios.create({
  //   baseURL: this.serverURL.toString(),
  //   timeout: this.options.timeout,
  // });
}

RequestHelper.prototype = {

  getChallenge(clientPublicKey) {
    return this.axios.get(this.serverURL.toString(), { params: { account: clientPublicKey } })
      .then(resp => {
        if (resp && resp.data && resp.data.transaction) {
          return resp.data.transaction;
        }
        throw new Error('stellar-auth.errors.challenge.invalid-response');
      });
  },

  getToken(txBase64) {
    return this.axios.post(this.serverURL.toString(), { transaction: txBase64 })
      .then(resp => {
        if (resp && resp.data && resp.data.token) {
          return resp.data.token;
        }
        throw new Error('stellar-auth.errors.token.invalid-response');
      });
  },
};

module.exports = RequestHelper;
