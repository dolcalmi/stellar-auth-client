require('core-js/stable');
require('regenerator-runtime/runtime');

const StellarSdk = require('stellar-sdk');
const isNode = require('detect-node');
let Transport;
if (isNode) {
  Transport = require('@ledgerhq/hw-transport-node-hid');
} else {
  Transport = require('@ledgerhq/hw-transport-u2f');
  // Transport = require('@ledgerhq/hw-transport-webhid');
  // Transport = require('@ledgerhq/hw-transport-webusb');
}
const AppStellar = require('@ledgerhq/hw-app-str');

function getPublicKey(bip32Path) {
  const path = bip32Path || `44'/148'/0'`;
  return getLedgerApp()
    .then(app => app.getPublicKey(path))
    .then(r => r.publicKey)
}

function sign(transaction, bip32Path) {
  const path = bip32Path || `44'/148'/0'`;
  return getLedgerApp()
    .then(app => app.signTransaction(path, transaction.signatureBase()))
    .then(signResult => addSignature(transaction, signResult, path))
    .then(tx => tx.toEnvelope().toXDR('base64'));
}

function addSignature(transaction, signResult, bip32Path) {
  return getPublicKey(bip32Path)
    .then(publicKey => StellarSdk.Keypair.fromPublicKey(publicKey))
    .then(keyPair => {
      const signature = signResult.signature;
      const hint = keyPair.signatureHint();
      const decorated = new StellarSdk.xdr.DecoratedSignature({ hint, signature });
      transaction.signatures.push(decorated);
      return transaction;
    })
}

function getLedgerApp() {
  return Transport.default.create()
    .then(transport => new AppStellar.default(transport))
}

module.exports = {
  getPublicKey,
  sign
};
