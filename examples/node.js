const StellarSdk = require('stellar-sdk');
const StellarAuthClient = require('../lib');
const clientKeyPair = StellarSdk.Keypair.random();
const auth = new StellarAuthClient('stellarport.io', { anchorName: 'Stellarport' });
auth
  .loginWithSecret(clientKeyPair.secret())
  .then(t => {
    console.log('token: ', t);
  })
