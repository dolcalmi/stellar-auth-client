const { Utils, InvalidSep10ChallengeError, Networks } = require('stellar-sdk');
const URI = require('urijs');

function verify(txBase64, serverAccountID, clientPublicKey, options = {}) {

  const { homeDomain, endpoint, networkPassphrase } = options;

  if (!endpoint) {
    throw new Error('stellar-auth.errors.invalid-endpoint');
  }

  const webAuthDomain = URI(endpoint).hostname();

  const { tx, clientAccountID } = Utils.readChallengeTx(
    txBase64,
    serverAccountID,
    networkPassphrase || Networks.PUBLIC,
    homeDomain,
    webAuthDomain
  );

  if (clientAccountID !== clientPublicKey) {
    throw new InvalidSep10ChallengeError(
      "The operation source account is not equal to the client's account"
    );
  }

  return tx;
}

module.exports = verify;
