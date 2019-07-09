const axios = require('axios');
const StellarSdk = require('stellar-sdk');
const verifyChallenge = require('./verify');
const LedgerHelper = require('./ledgerHelper');

function login(clientKeyPair, authType, options) {
  let keyPair = clientKeyPair;
  let sign = (tx) => tx;

  if (authType === 'secret') {
    sign = (tx) => {
      tx.sign(keyPair);
      return tx;
    };
  }

  if (authType === 'ledger') {
    sign = tx => LedgerHelper.sign(tx, options.bip32Path);
  }

  return resolveAuthSettings(this.domain, options)
    .then(s => requestAndVerifyChallenge(s, keyPair.publicKey(), options))
    .then(tx => sign(tx));
}

function requestAndVerifyChallenge(authSettings, clientPublicKey, options) {
  const { endpoint, account } = authSettings;
  return requestChallenge(endpoint, clientPublicKey)
    .then(txBase64 => verifyChallenge(txBase64, account, clientPublicKey , options));
}

function requestChallenge(authEndpoint, clientPublicKey) {
  const req = axios.create({ baseURL: authEndpoint });
  return req.get(`${authEndpoint}?public_key=${clientPublicKey}`)
    .then(function (response) {
      if (response && response.transaction) {
        return response.transaction;
      }
      throw new Error('stellar-auth.errors.challenge.invalid-request');
    });
}

function resolveAuthSettings(domain, options) {
  let endpoint = options.authEndpoint;
  let account = options.authAccount;

  let auth = Promise.resolve({ endpoint, account });

  if (domain && (!endpoint || !account)) {
    auth = StellarSdk.StellarTomlResolver.resolve(domain)
      .then(stellarToml => {
        return {
          endpoint: endpoint || stellarToml.WEB_AUTH_ENDPOINT,
          account: account || stellarToml.WEB_AUTH_ACCOUNT,
        }
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
}

module.exports = login;
