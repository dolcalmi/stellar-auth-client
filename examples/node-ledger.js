const StellarAuthClient = require('../lib');
const auth = new StellarAuthClient('k.tempocrypto.com');
auth
  .loginWithLedger()
  // .loginWithLedger({ bip32Path: `44'/148'/13'` })
  .then(t => {
    console.log('token: ', t);
  })
  .catch(e => {
    console.log('Error: ', e);
  })
