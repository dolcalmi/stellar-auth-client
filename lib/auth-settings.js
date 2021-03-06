const StellarSdk = require('stellar-sdk');

function AuthSettings() {

}

AuthSettings.prototype = {

  resolve(domain, options = { }) {
    let endpoint = options.authEndpoint;
    let account = options.authAccount;

    let auth = Promise.resolve({ endpoint, account });

    if (domain && (!endpoint || !account)) {
      auth = StellarSdk.StellarTomlResolver.resolve(domain, options)
        .then(stellarToml => {
          return {
            endpoint: endpoint || stellarToml.WEB_AUTH_ENDPOINT,
            account: account || stellarToml.SIGNING_KEY,
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            throw new Error('stellar-auth.errors.toml.unavailable');
          }
          throw error;
        });
    }

    return auth
      .then(s => {
        if (!s.endpoint) {
          throw new Error('stellar-auth.errors.invalid-auth-endpoint');
        }

        if (!s.account) {
          throw new Error('stellar-auth.errors.invalid-auth-account');
        }
        return s;
      });
  },

};

module.exports = AuthSettings;
