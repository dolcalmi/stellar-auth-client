const StellarSdk = require('stellar-sdk');
const Crypto = require('crypto');
const merge = require('lodash.merge');

const testUtils = require('./test-utils');

function challenge(options = {}) {
  const opts = merge({
    challengeExpiresIn: 300, // 5 minutes
    homeDomain: 'acme.com',
    networkPassphrase: StellarSdk.Networks.TESTNET
  }, options);

  const serverKeyPair = testUtils.getServerKeyPair();
  const clientPublicKey = testUtils.getClientPublicKey();

  return {
    transaction: StellarSdk.Utils.buildChallengeTx(
      serverKeyPair,
      clientPublicKey,
      opts.homeDomain,
      opts.challengeExpiresIn,
      opts.networkPassphrase
    ),
    networkPassphrase: opts.networkPassphrase,
  };
}

module.exports = {
  challenge
};
