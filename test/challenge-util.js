const StellarSdk = require('stellar-sdk');
const Crypto = require('crypto');
const merge = require('lodash.merge');

const testUtils = require('./test-utils');

function challenge(options = {}) {
  const opts = merge({
    challengeExpiresIn: 300, // 5 minutes
    invalidSequence: '-1',
    anchorName: 'Anchor server auth',
    sign: true,
    diffOpType: false,
    addExtraOp: false,
    expired: false,
    networkPassphrase: StellarSdk.Networks.TESTNET
  }, options);

  const serverKeyPair = testUtils.getServerKeyPair();
  const clientPublicKey = testUtils.getClientPublicKey();
  const minTime = Math.floor(Date.now() / 1000) - (opts.expired ? opts.challengeExpiresIn * 3 : 0);
  const maxTime = minTime + opts.challengeExpiresIn;
  const timebounds = {
    minTime: minTime.toString(),
    maxTime: maxTime.toString()
  };

  const op = StellarSdk.Operation.manageData({
    source: clientPublicKey,
    name: opts.anchorName,
    value: Crypto.randomBytes(32).toString('hex'),
  });

  const op2 = StellarSdk.Operation.payment({
    destination: StellarSdk.Keypair.random().publicKey(),
    asset: StellarSdk.Asset.native(),
    amount: '1',
  });

  const stellarServerAccount = new StellarSdk.Account(
    serverKeyPair.publicKey(),
    opts.invalidSequence // stellar sdk increments sequence
  );

  const builder = new StellarSdk
    .TransactionBuilder(stellarServerAccount, {
      fee: 100,
      timebounds,
      networkPassphrase: opts.networkPassphrase,
    });

  if (opts.addExtraOp || opts.diffOpType) {
    builder.addOperation(op2);
  }

  if (opts.addExtraOp || !opts.diffOpType) {
    builder.addOperation(op)
  }

  const tx = builder.build();

  if (opts.sign) {
    tx.sign(serverKeyPair);
  }

  return {
    transaction: tx.toEnvelope().toXDR('base64'),
    networkPassphrase: opts.networkPassphrase
  }
}

module.exports = {
  challenge
};
