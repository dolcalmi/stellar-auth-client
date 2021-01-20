const verify = require('../../lib/verify');

describe('StellarAuth - Verify', function() {
  const stellarAuth = testUtils.getStellarAuthInstance();
  const serverPublicKey = testUtils.getServerPublicKey();
  const clientPublicKey = testUtils.getClientPublicKey();
  const networkPassphrase = StellarSdk.Networks.TESTNET;

  it('Should be valid', async function() {
    const txBase64 = challengeUtil.challenge().transaction;
    const result = verify(txBase64, serverPublicKey, clientPublicKey, {
      homeDomain: 'acme.com',
      networkPassphrase,
      endpoint: 'https://acme.com/auth'
    });
    const tx = new StellarSdk.Transaction(txBase64, networkPassphrase);

    await expect(result).to.not.be.null;
    await expect(result.toEnvelope().toXDR('base64')).to.equal(tx.toEnvelope().toXDR('base64'));
  });

  it('Should be invalid with invalid anchor name', async function() {
    let txBase64 = challengeUtil.challenge().transaction;
    let result = () => verify(txBase64, serverPublicKey, clientPublicKey, { homeDomain: 'Anchor', endpoint: 'https://acme.com/auth', networkPassphrase });
    expect(result).to.throw(/Invalid homeDomains: the transaction\'s operation key name does not match the expected home domain/);

    txBase64 = challengeUtil.challenge({ homeDomain: 'acme.com' }).transaction;
    result = () => verify(txBase64, serverPublicKey, clientPublicKey, { homeDomain: 'anchor.com', endpoint: 'https://auth.acme.com/auth', networkPassphrase });
    expect(result).to.throw(/Invalid homeDomains: the transaction\'s operation key name does not match the expected home domain/);
  });

  it('Should be invalid with invalid server signature', async function() {
    const txBase64 = challengeUtil.challenge().transaction;
    const result = () => verify(txBase64, StellarSdk.Keypair.random().publicKey(), clientPublicKey, { homeDomain: 'acme.com',  endpoint: 'https://auth.acme.com/auth', networkPassphrase });
    expect(result).to.throw(/The transaction source account is not equal to the server\'s account/);
  });

  it('Should be invalid with invalid endpoint', async function() {
    const verifyOpts = { homeDomain: 'acme.com', networkPassphrase };
    let txBase64 = challengeUtil.challenge().transaction;
    let result = () => verify(txBase64, serverPublicKey, clientPublicKey, verifyOpts);
    expect(result).to.throw(/stellar-auth.errors.invalid-endpoint/);
  });

  it('Should be invalid with invalid operation', async function() {
    const verifyOpts = { homeDomain: 'acme.com',  endpoint: 'https://auth.acme.com/auth', networkPassphrase };
    let txBase64 = challengeUtil.challenge().transaction;
    let result = () => verify(txBase64, serverPublicKey, StellarSdk.Keypair.random().publicKey(), verifyOpts);
    expect(result).to.throw(/The operation source account is not equal to the client\'s account/);
  });

  it('Should be invalid for expired challenge', async function() {
    const verifyOpts = { homeDomain: 'acme.com',  endpoint: 'https://auth.acme.com/auth', networkPassphrase };
    const txBase64 = challengeUtil.challenge({ challengeExpiresIn: -10 }).transaction;
    const result = () => verify(txBase64, serverPublicKey, clientPublicKey, verifyOpts);
    expect(result).to.throw(/The transaction has expired/);
  });

});
