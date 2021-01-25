const StellarSdk = require('stellar-sdk');
const merge = require('lodash.merge');
const LedgerHelper = require('./ledger-helper');
const RequestHelper = require('./request-helper');
const verifyChallenge = require('./verify');
const AuthSettings = require('./auth-settings');

function StellarAuth(homeDomain, options) {

  this.homeDomain = homeDomain;
  this.authSettings = new AuthSettings(StellarSdk);

  this.options = merge({
    allowHttp: false,
    homeDomain,
    bip32Path: `44'/148'/0'`,
    authAccount: null,
    authEndpoint: null,
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  }, options);

  this.lastRequest = null;
}

StellarAuth.prototype = {

  login(clientPublicKey, signFunc, options = { }) {
    return this.authSettings.resolve(this.homeDomain, options)
      .then(settings => {
        const { endpoint, account } = settings;
        this.lastRequest = {
          homeDomain: this.homeDomain,
          authEndpoint: endpoint,
          authAccount: account,
        };
        const server = new RequestHelper(endpoint, options);
        return server.getChallenge(clientPublicKey)
          .then(r => {
            this.lastRequest = merge(this.lastRequest, {
              challenge: r.transaction,
              networkPassphrase: r.networkPassphrase
            });
            const opts = merge(options, { endpoint, networkPassphrase: r.networkPassphrase });
            return verifyChallenge(r.transaction, account, clientPublicKey, opts);
          })
          .then(tx => signFunc(tx))
          .then(txBase64 => {
            this.lastRequest.signedChallenge = txBase64;
            return server.getToken(txBase64)
          })
          .then(token => {
            this.lastRequest.token = token;
            return token;
          });
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
