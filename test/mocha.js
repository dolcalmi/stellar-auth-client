'use strict';

//Load dependencies
const axios = require('axios');
const sinon = require("sinon");
const StellarSdk = require('stellar-sdk');
const testUtils = require('./test-utils');
const challengeUtil = require('./challenge-util');
const chaiAsPromised = require('chai-as-promised');

if (typeof window === 'undefined') {
  global.StellarAuthClient = require("../lib/");
  global.axios = axios;
  global.sinon = sinon;
  global.testUtils = testUtils;
  global.StellarSdk = StellarSdk;
  global.challengeUtil = challengeUtil;
  global.chai = require('chai');
  global.chai.should();
  global.chai.use(chaiAsPromised);
  global.expect = global.chai.expect;
} else {
  // eslint-disable-next-line no-undef
  window.StellarSdk = StellarSdk;
  window.axios = StellarAuthClient.axios;
  StellarSdk.axios = StellarAuthClient.axios;
  window.testUtils = testUtils;
  window.challengeUtil = challengeUtil;
  chai.use(chaiAsPromised);
}
