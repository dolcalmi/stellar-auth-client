const verify = require('../../lib/verify');

describe('StellarAuth - Verify', function() {
  const stellarAuth = testUtils.getStellarAuthInstance();
  const serverPublicKey = testUtils.getServerPublicKey();
  const clientPublicKey = testUtils.getClientPublicKey();
  const networkPassphrase = StellarSdk.Networks.TESTNET

  it('Should be valid', async function() {
    const txBase64 = challengeUtil.challenge();
    const result = verify(txBase64, serverPublicKey, clientPublicKey, { networkPassphrase });
    const tx = new StellarSdk.Transaction(txBase64, networkPassphrase);
    await expect(result).to.be.fulfilled;
    await expect(result.then(t => t.toEnvelope().toXDR('base64'))).to.become(tx.toEnvelope().toXDR('base64'));

    await expect(
      verify(
        challengeUtil.challenge({ invalidSequence: '2' }),
        serverPublicKey,
        clientPublicKey,
        { invalidSequence: '3', networkPassphrase }
      )
    ).to.be.fulfilled;

    await expect(
      verify(
        challengeUtil.challenge({ anchorName: 'Acme anchor auth' }),
        serverPublicKey,
        clientPublicKey,
        { anchorName: 'Acme anchor', networkPassphrase }
      )
    ).to.be.fulfilled;
  });

  it('Should be invalid with invalid sequence', async function() {
    let txBase64 = challengeUtil.challenge();
    let result = verify(txBase64, serverPublicKey, clientPublicKey, { invalidSequence: '5' });
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');

    txBase64 = challengeUtil.challenge({ invalidSequence: '3', networkPassphrase });
    result = verify(txBase64, serverPublicKey, clientPublicKey);
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');
  });

  it('Should be invalid with invalid anchor name', async function() {
    let txBase64 = challengeUtil.challenge();
    let result = verify(txBase64, serverPublicKey, clientPublicKey, { anchorName: 'Anchor', networkPassphrase });
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');

    txBase64 = challengeUtil.challenge({ anchorName: 'Acme' });
    result = verify(txBase64, serverPublicKey, clientPublicKey, { anchorName: 'Anchor', networkPassphrase });
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');
  });

  it('Should be invalid without server signature', async function() {
    const txBase64 = challengeUtil.challenge({ sign: false });
    const result = verify(txBase64, serverPublicKey, clientPublicKey, { networkPassphrase });
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');
  });

  it('Should be invalid with invalid server signature', async function() {
    const txBase64 = challengeUtil.challenge();
    const result = verify(txBase64, StellarSdk.Keypair.random().publicKey(), clientPublicKey, { networkPassphrase });
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');
  });

  it('Should be invalid with invalid operation', async function() {
    let txBase64 = challengeUtil.challenge();
    let result = verify(txBase64, serverPublicKey, StellarSdk.Keypair.random().publicKey(), { networkPassphrase });
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');

    txBase64 = challengeUtil.challenge({ diffOpType: true });
    result = verify(txBase64, serverPublicKey, clientPublicKey, { networkPassphrase });
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');

    txBase64 = challengeUtil.challenge({ addExtraOp: true });
    result = verify(txBase64, serverPublicKey, clientPublicKey, { networkPassphrase });
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');
  });

  it('Should be invalid for expired challenge', async function() {
    const txBase64 = challengeUtil.challenge({ expired: true });
    const result = verify(txBase64, serverPublicKey, clientPublicKey, { networkPassphrase });
    await expect(result).to.be.rejectedWith('stellar-auth.errors.expired-transaction');
  });

});
