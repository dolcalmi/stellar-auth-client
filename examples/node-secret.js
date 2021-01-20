const StellarSdk = require('stellar-sdk');
const StellarAuthClient = require('../lib');
const clientKeyPair = StellarSdk.Keypair.random();
const auth = new StellarAuthClient('k.tempocrypto.com');
auth
  .loginWithSecret(clientKeyPair.secret())
  .then(t => {
    console.log('token: ', t);
  })
