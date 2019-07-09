const StellarSdk = require('stellar-sdk');
const isValidDomain = require('is-valid-domain')
const merge = require('lodash.merge');
const login = require('./login');
const LedgerHelper = require('./login/ledgerHelper');

StellarSdk.Network.usePublicNetwork();

function StellarAuth(domain, options) {

  if (!isValidDomain(domain)) {
    throw new Error('stellar-auth.errors.invalid-domain');
  }

  this.domain = domain;

  this.options = merge({
    allowHttp: false,
    anchorName: null,
    bip32Path: `44'/148'/0'`,
    authAccount: null,
    authEndpoint: null,
  }, options);
}

StellarAuth.prototype = {

  loginWithSecret(secret, options) {
    if (!secret || !StellarSdk.StrKey.isValidEd25519SecretSeed(secret)) {
      return Promise.reject(new Error('stellar-auth.errors.invalid-secret'));
    }
    const clientKeyPair = StellarSdk.Keypair.fromSecret(secret);
    const opts = merge(this.options, options);
    return login.call(this, clientKeyPair, 'secret', opts);
  },

  loginWithLedger(options) {
    const bip32Path = options.bip32Path || this.bip32Path;
    const self = this;
    const opts = merge(this.options, options);
    return LedgerHelper.getPublicKey(bip32Path)
      .then(publicKey => StellarSdk.Keypair.fromPublicKey(publicKey))
      .then(keyPair => login.call(self, keyPair, 'ledger', opts))
  },

  setOption(key, value) {
    this.options[key] = value;
  },

  getOption(key) {
    return this.options[key];
  },
};

module.exports = StellarAuth;
