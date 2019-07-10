const MockDate = require('mockdate');
const MockAdapter = require('axios-mock-adapter');
const resolveAuthSettings = require('../../lib/resolve-auth-settings');

describe('StellarAuth - resolveAuthSettings', function() {
  beforeEach(function() {
    const url = 'https://acme.com';
    this.axiosMock = new MockAdapter(axios);
    this.axiosMock.onGet('https://acme.com/.well-known/stellar.toml')
    .reply(200, `
    #   The endpoint which clients should query to resolve stellar addresses
    #   for users on your domain.
    WEB_AUTH_ENDPOINT="https://acme.com/auth"
    WEB_AUTH_ACCOUNT="${testUtils.getServerPublicKey()}"
    `);
    this.axiosMock.onGet('https://acmefail2.com/.well-known/stellar.toml')
    .reply(500);
  });

  afterEach(function() {
    this.axiosMock.reset();
    this.axiosMock.restore();
  });

  it('Should resolve endpoint and server account from domain', async function() {
    const result = resolveAuthSettings('acme.com');
    await expect(result).to.be.fulfilled;
    await expect(result).to.become({
      account: testUtils.getServerPublicKey(),
      endpoint: 'https://acme.com/auth',
    });
  });

  it('Should resolve endpoint from options and server account from domain', async function() {
    const result = resolveAuthSettings('acme.com', { authEndpoint: 'https://auth.acme.com'});
    await expect(result).to.be.fulfilled;
    await expect(result).to.become({
      account: testUtils.getServerPublicKey(),
      endpoint: 'https://auth.acme.com',
    });
  });

  it('Should resolve server account from options and endpoint from domain', async function() {
    const authAccount = StellarSdk.Keypair.random().publicKey();
    const result = resolveAuthSettings('acme.com', { authAccount });
    await expect(result).to.be.fulfilled;
    await expect(result).to.become({
      account: authAccount,
      endpoint: 'https://acme.com/auth',
    });
  });

  it('Should fail without domain or auth settings', async function() {
    let result = resolveAuthSettings();
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-auth-endpoint');
    result = resolveAuthSettings('');
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-auth-endpoint');
    result = resolveAuthSettings('', { authEndpoint: 'https://auth.acme.com' });
    await expect(result).to.be.rejectedWith('stellar-auth.errors.invalid-auth-account');
  });

  it('Should fail with invalid domain', async function() {
    const result = resolveAuthSettings('acmefail.com');
    await expect(result).to.be.rejectedWith('stellar-auth.errors.toml.unavailable');
  });

  it('Should fail with server error', async function() {
    const result = resolveAuthSettings('acmefail2.com');
    await expect(result).to.be.rejectedWith('Request failed with status code 500');
  });

});
