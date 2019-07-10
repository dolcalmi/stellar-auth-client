require('core-js/stable');
require('regenerator-runtime/runtime');

const StellarSdk = require('stellar-sdk');
const WebTransport = require('@ledgerhq/hw-transport-u2f');
const NodeTransport = require('@ledgerhq/hw-transport-node-hid');
const AppStellar = require('@ledgerhq/hw-app-str');
const { isNode } = require('browser-or-node');

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
  let transport = null;
  if (isNode) {
    transport = NodeTransport.default.create()
  } else {
    transport = WebTransport.default.create()
  }
  return transport.default.create()
    .then(transport => new AppStellar.default(transport))
}

module.exports = {
  getPublicKey,
  sign
};
