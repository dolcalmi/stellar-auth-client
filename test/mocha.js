
'use strict';

//Load dependencies
const chai = require('chai');
const axios = require('axios');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const StellarSdk = require('stellar-sdk');
const testUtils = require('./test-utils');
const challengeUtil = require('./challenge-util');
const chaiAsPromised = require('chai-as-promised');

//Enable should assertion style for usage with chai-as-promised
chai.should();

//Extend chai
chai.use(sinonChai);
chai.use(chaiAsPromised);

if (typeof window === 'undefined') {
  //Expose globals
  global.axios = axios;
  global.expect = chai.expect;
  global.sinon = sinon;
  global.testUtils = testUtils;
  global.StellarSdk = StellarSdk;
  global.challengeUtil = challengeUtil;
} else {
  // eslint-disable-next-line no-undef
  window.axios = StellarSdk.axios;
}
