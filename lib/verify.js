const StellarSdk = require('stellar-sdk');

function verify(txBase64, serverPublicKey, clientPublicKey, options = {}) {

  const { invalidSequence, anchorName } = options;

  const tx = new StellarSdk.Transaction(txBase64);
  const seq = invalidSequence || '0';
  const serverKeyPair = StellarSdk.Keypair.fromPublicKey(serverPublicKey);

  const isValidTx = isValidTransaction(tx, serverKeyPair, seq) &&
    hasValidOperation(tx, clientPublicKey, anchorName);

  if (!isValidTx) {
    return Promise.reject(new Error('stellar-auth.errors.invalid-transaction'));
  }

  if (!hasValidTimeBounds(tx)) {
    return Promise.reject(new Error('stellar-auth.errors.expired-transaction'));
  }

  return Promise.resolve(tx);
}

function isValidTransaction(tx, serverKeyPair, sequence) {
  return tx.signatures.length === 1 &&
    tx.operations.length === 1  &&
    tx.source === serverKeyPair.publicKey() &&
    tx.sequence === sequence &&
    serverKeyPair.verify(tx.hash(), tx.signatures[0].signature());
}

function hasValidTimeBounds(tx) {
  return tx.timeBounds &&
      Date.now() > Number.parseInt(tx.timeBounds.minTime, 10) &&
      Date.now() < Number.parseInt(tx.timeBounds.maxTime, 10);
}

function hasValidOperation(tx, clientPublicKey, anchorName) {
  const op = tx.operations[0];
  if (isValidPublicKey(op.source) && op.source === clientPublicKey) {
    const hasValidType = op.type === 'manageData';

    if (anchorName) {
      return hasValidType && op.name === `${anchorName} auth`;
    }

    return hasValidType;
  }

  return false;
}

function isValidPublicKey(input) {
  if (!input) {
    return false;
  }
  return StellarSdk.StrKey.isValidEd25519PublicKey(input);
}

module.exports = verify;
