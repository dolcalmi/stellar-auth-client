const MockAdapter = require('axios-mock-adapter');
const RequestHelper = require('../../lib/request-helper');

describe('StellarAuth - Request Helper', function() {
  const url = 'https://acme.com:1337/auth';

  beforeEach(function() {
    this.server = new RequestHelper(url);
    this.axiosMock = new MockAdapter(axios);
    this.challenge = challengeUtil.challenge();
    this.axiosMock.onGet(url, { params: { account: testUtils.getClientPublicKey() } })
    .reply(200, {
      transaction: this.challenge
    });
    this.axiosMock.onPost(url, { transaction: this.challenge }).reply(200, {
      token: testUtils.getToken()
    });
  });

  afterEach(function() {
    this.axiosMock.reset();
    this.axiosMock.restore();
  });

  it('allow insecure server when options.allowHttp flag is set', function() {
    expect(
      () => new RequestHelper('http://acme.com:1337/auth', { allowHttp: true })
    ).to.not.throw();
  });

  it('throws error for insecure server', function() {
    expect(
      () => new RequestHelper('http://acme.com:1337/auth')
    ).to.throw(/stellar-auth.errors.insecure-server/);
  });

  it('set timeout to 0 when option is not number', function() {
    const rh = new RequestHelper('https://acme.com:1337/auth', { timeout: '5' })
    expect(rh.options.timeout).to.equal(0);
  });

  it('should allow set timeout value', function() {
    const rh = new RequestHelper('https://acme.com:1337/auth', { timeout: 5000 })
    expect(rh.options.timeout).to.equal(5000);
  });

  it('returns transaction for valid challenge request', async function() {
    const result = this.server.getChallenge(testUtils.getClientPublicKey())
    await expect(result).to.become(this.challenge);
  });

  it('returns token for valid token request', async function() {
    const result = this.server.getToken(this.challenge)
    await expect(result).to.be.fulfilled;
    await expect(result).to.become(testUtils.getToken());
  });

  it('fails when challenge response is malformed', async function() {
    const account = StellarSdk.Keypair.random();
    this.axiosMock.onGet(url, { params: { account: account.publicKey() } })
    .reply(200);
    const result = this.server.getChallenge(account.publicKey())
    await expect(result).to.be.rejectedWith('stellar-auth.errors.challenge.invalid-response');
  });

  it('fails when token response is malformed', async function() {
    const challenge = challengeUtil.challenge();
    this.axiosMock.onPost(url, { transaction: challenge })
    .reply(200);
    const result = this.server.getToken(challenge)
    await expect(result).to.be.rejectedWith('stellar-auth.errors.token.invalid-response');
  });

});
