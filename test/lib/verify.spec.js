const MockDate = require('mockdate');
const verify = require('../../lib/verify');

describe('StellarAuth - Verify', function() {
  const stellarAuth = testUtils.getStellarAuthInstance();
  const serverPublicKey = testUtils.getServerPublicKey();
  const clientPublicKey = testUtils.getClientPublicKey();


  it('Should be valid', async function() {
    const txBase64 = challengeUtil.challenge();
    const result = verify(txBase64, serverPublicKey, clientPublicKey);
    const tx = new StellarSdk.Transaction(txBase64);
    await expect(result).to.be.fulfilled;
    await expect(result).to.become(tx);

    await expect(
      verify(
        challengeUtil.challenge({ invalidSequence: '2' }),
        serverPublicKey,
        clientPublicKey,
        { invalidSequence: '3' }
      )
    ).to.be.fulfilled;

    await expect(
      verify(
        challengeUtil.challenge({ anchorName: 'Acme anchor auth' }),
        serverPublicKey,
        clientPublicKey,
        { anchorName: 'Acme anchor' }
      )
    ).to.be.fulfilled;
  });

  it('Should be invalid with invalid sequence', async function() {
    let txBase64 = challengeUtil.challenge();
    let result = verify(txBase64, serverPublicKey, clientPublicKey, { invalidSequence: '5' });
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');

    txBase64 = challengeUtil.challenge({ invalidSequence: '3' });
    result = verify(txBase64, serverPublicKey, clientPublicKey);
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');
  });

  it('Should be invalid with invalid anchor name', async function() {
    let txBase64 = challengeUtil.challenge();
    let result = verify(txBase64, serverPublicKey, clientPublicKey, { anchorName: 'Anchor' });
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');

    txBase64 = challengeUtil.challenge({ anchorName: 'Acme' });
    result = verify(txBase64, serverPublicKey, clientPublicKey, { anchorName: 'Anchor' });
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');
  });

  it('Should be invalid without server signature', async function() {
    const txBase64 = challengeUtil.challenge({ sign: false });
    const result = verify(txBase64, serverPublicKey, clientPublicKey);
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');
  });

  it('Should be invalid with invalid server signature', async function() {
    const txBase64 = challengeUtil.challenge();
    const result = verify(txBase64, StellarSdk.Keypair.random().publicKey(), clientPublicKey);
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');
  });

  it('Should be invalid with invalid operation', async function() {
    let txBase64 = challengeUtil.challenge();
    let result = verify(txBase64, serverPublicKey, StellarSdk.Keypair.random().publicKey());
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');

    txBase64 = challengeUtil.challenge({ diffOpType: true });
    result = verify(txBase64, serverPublicKey, clientPublicKey);
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');

    txBase64 = challengeUtil.challenge({ addExtraOp: true });
    result = verify(txBase64, serverPublicKey, clientPublicKey);
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');
  });

  it('Should be invalid for expired challenge', async function() {
    MockDate.set('2100-11-22');
    const txBase64 = challengeUtil.challenge();
    const result = verify(txBase64, serverPublicKey, clientPublicKey);
    await expect(result).to.be.rejectedWith('stellar-auth.errors.expired-transaction');
    MockDate.reset();
  });

});
