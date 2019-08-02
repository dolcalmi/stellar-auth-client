const MockAdapter = require('axios-mock-adapter');

describe('StellarAuth', function() {
  const stellarAuth = testUtils.getStellarAuthInstance();
  const serverKeyPair = testUtils.getServerKeyPair();
  const clientKeyPair = testUtils.getClientKeyPair();

  beforeEach(function() {
    const url = 'https://acme.com';
    this.axiosMock = new MockAdapter(axios);
    StellarSdk.Config.setDefault();
    this.axiosMock.onGet('https://acme.com/.well-known/stellar.toml')
    .reply(200, `
    #   The endpoint which clients should query to resolve stellar addresses
    #   for users on your domain.
    WEB_AUTH_ENDPOINT="https://acme.com/auth"
    SIGNING_KEY="${testUtils.getServerPublicKey()}"
    `);

    this.challenge = challengeUtil.challenge();
    this.axiosMock.onGet('https://acme.com/auth', { params: { account: clientKeyPair.publicKey() } })
    .reply(200, {
      transaction: this.challenge
    });
    this.axiosMock.onPost('https://acme.com/auth').reply(200, {
      token: testUtils.getToken()
    });
  });

  afterEach(function() {
    this.axiosMock.reset();
    this.axiosMock.restore();
  });

  it('Should have valid default values', function() {
    const options = stellarAuth.options;
    expect(options.allowHttp).to.equal(false);
    expect(options.bip32Path).to.equal(`44'/148'/0'`);
    expect(options.authEndpoint).to.equal(null);
    expect(options.authAccount).to.equal(null);
    expect(options.anchorName).to.equal(null);
  });

  it('Should allow set allowHttp value', function() {
    let sa = testUtils.getStellarAuthInstance({ allowHttp: true });
    expect(sa.options.allowHttp).to.equal(true);
    sa.setOption('allowHttp', false);
    expect(sa.getOption('allowHttp')).to.equal(false);
  });

  it('Should allow set bip32Path value', function() {
    let sa = testUtils.getStellarAuthInstance({ bip32Path: `44'/148'/1'` });
    expect(sa.options.bip32Path).to.equal(`44'/148'/1'`);
    sa.setOption('bip32Path', `44'/148'/3'`);
    expect(sa.getOption('bip32Path')).to.equal(`44'/148'/3'`);
  });

  it('Should allow set authEndpoint value', function() {
    let sa = testUtils.getStellarAuthInstance({ authEndpoint: 'https://myanchor.co/auth' });
    expect(sa.options.authEndpoint).to.equal('https://myanchor.co/auth');
    sa.setOption('authEndpoint', 'https://myanchor2.co/auth');
    expect(sa.getOption('authEndpoint')).to.equal('https://myanchor2.co/auth');
  });

  it('Should allow set authAccount value', function() {
    let sa = testUtils.getStellarAuthInstance({ authAccount: 'GBLSLT6HHSTKPRWR4CWX5QERLLUAFX5MEGS6CCZZMIX3GQHQTD7SVFGT' });
    expect(sa.options.authAccount).to.equal('GBLSLT6HHSTKPRWR4CWX5QERLLUAFX5MEGS6CCZZMIX3GQHQTD7SVFGT');
    sa.setOption('authAccount', 'GDGQHWJDOHVO2T5JG7VH2AUP7LUTYWTZKGQHGJGRSHGNOHNJHEO7JDLB');
    expect(sa.getOption('authAccount')).to.equal('GDGQHWJDOHVO2T5JG7VH2AUP7LUTYWTZKGQHGJGRSHGNOHNJHEO7JDLB');
  });

  it('Should allow set anchor name value', function() {
    var sa = testUtils.getStellarAuthInstance({ anchorName: 'my anchor' });
    expect(sa.options.anchorName).to.equal('my anchor');
    sa.setOption('anchorName', 'your anchor');
    expect(sa.getOption('anchorName')).to.equal('your anchor');
  });

  it('Should allow login with secret', async function() {
    const auth = testUtils.getStellarAuthInstance({ domain: 'acme.com' });
    const result = auth.loginWithSecret(clientKeyPair.secret())
    await expect(result).to.become(testUtils.getToken());
  });

  it('Should throw error for login with invalid secret', async function() {
    const auth = testUtils.getStellarAuthInstance({ domain: 'acme.com' });
    const result = auth.loginWithSecret('asfdsd')
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-secret');
  });

});
