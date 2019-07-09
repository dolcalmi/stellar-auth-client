const testUtils = require('../test-utils');
const stellarAuth = testUtils.getStellarAuthInstance();
const expect = require('chai').expect;

describe('StellarAuth - Options', function() {
  const serverKeyPair = testUtils.getServerKeyPair();
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

});
