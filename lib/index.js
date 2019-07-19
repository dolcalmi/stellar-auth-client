const StellarSdk = require('stellar-sdk');
const merge = require('lodash.merge');
const LedgerHelper = require('./ledger-helper');
const RequestHelper = require('./request-helper');
const verifyChallenge = require('./verify');
const AuthSettings = require('./auth-settings');

StellarSdk.Network.usePublicNetwork();

function StellarAuth(domain, options) {

  this.domain = domain;
  this.authSettings = new AuthSettings(StellarSdk);

  this.options = merge({
    allowHttp: false,
    anchorName: null,
    bip32Path: `44'/148'/0'`,
    authAccount: null,
    authEndpoint: null,
  }, options);
}

StellarAuth.prototype = {

  login(clientPublicKey, signFunc, options = { }) {
    return this.authSettings.resolve(this.domain, options)
      .then(settings => {
        const { endpoint, account } = settings;
        const server = new RequestHelper(endpoint);
        return server.getChallenge(clientPublicKey)
          .then(txBase64 => verifyChallenge(txBase64, account, clientPublicKey , options))
          .then(tx => signFunc(tx))
          .then(txBase64 => server.getToken(txBase64));
      });
  },

  loginWithSecret(secret, options) {
    if (!secret || !StellarSdk.StrKey.isValidEd25519SecretSeed(secret)) {
      return Promise.reject(new Error('stellar-auth.errors.invalid-secret'));
    }
    const opts = merge(this.options, options);
    const clientKeyPair = StellarSdk.Keypair.fromSecret(secret);
    const sign = (tx) => {
      tx.sign(clientKeyPair);
      return tx.toEnvelope().toXDR('base64');
    };
    return this.login(clientKeyPair.publicKey(), sign, opts);
  },

  loginWithLedger(options) {
    const opts = merge(this.options, options);
    const sign = tx => LedgerHelper.sign(tx, opts.bip32Path);
    return LedgerHelper.getPublicKey(opts.bip32Path)
      .then(publicKey => this.login(publicKey, sign, opts));
  },

  setOption(key, value) {
    this.options[key] = value;
  },

  getOption(key) {
    return this.options[key];
  },
};

module.exports = StellarAuth;
