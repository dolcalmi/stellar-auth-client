'use strict';

const StellarSdk = require('stellar-sdk');

const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJHQTZVSVhYUEVXWUZJTE5VSVdBQzM3WTRRUEVaTVFWREpIREtWV0ZaSjJLQ1dVQklVNUlYWk5EQSIsImp0aSI6IjE0NGQzNjdiY2IwZTcyY2FiZmRiZGU2MGVhZTBhZDczM2NjNjVkMmE2NTg3MDgzZGFiM2Q2MTZmODg1MTkwMjQiLCJpc3MiOiJodHRwczovL2ZsYXBweS1iaXJkLWRhcHAuZmlyZWJhc2VhcHAuY29tLyIsImlhdCI6MTUzNDI1Nzk5NCwiZXhwIjoxNTM0MzQ0Mzk0fQ.8nbB83Z6vGBgC1X9r3N6oQCFTBzDiITAfCJasRft0z0';
const clientKeyPair = StellarSdk.Keypair.random();
const serverKeyPair = StellarSdk.Keypair.fromSecret('SDNEEPE7IUAAVVFD26RBFAT5G3SR2SOQMT265ETXEWIM4MQZHUJDYDMT');
const defaultDomain= 'myanchordomain.com';

var utils = module.exports = {

  getToken: function() {
    return jwtToken;
  },

  getClientPublicKey: function() {
    return clientKeyPair.publicKey();
  },

  getClientKeyPair: function() {
    return clientKeyPair;
  },

  getServerPublicKey: function() {
    return serverKeyPair.publicKey();
  },

  getServerKeyPair: function() {
    return serverKeyPair;
  },

  getStellarAuthInstance: function(options = {}) {
    var StellarAuth = require('../lib');
    return new StellarAuth(options.domain || defaultDomain, options);
  },
};
