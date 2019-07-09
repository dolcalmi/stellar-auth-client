# Stellar Auth client library
[![Version](https://img.shields.io/npm/v/stellar-auth-client.svg)](https://www.npmjs.org/package/stellar-auth-client)
[![Build Status](https://api.travis-ci.org/dolcalmi/stellar-auth-client.svg?branch=master)](https://travis-ci.org/dolcalmi/stellar-auth-client)
[![Coverage Status](https://coveralls.io/repos/github/dolcalmi/stellar-auth-client/badge.svg?branch=master)](https://coveralls.io/github/dolcalmi/stellar-auth-client?branch=master)
[![David](https://img.shields.io/david/dolcalmi/stellar-auth-client.svg)](https://david-dm.org/dolcalmi/stellar-auth-client)
[![David](https://img.shields.io/david/dev/dolcalmi/stellar-auth-client.svg)](https://david-dm.org/dolcalmi/stellar-auth-client?type=dev)
[![Try on RunKit](https://badge.runkitcdn.com/stellar-auth-client.svg)](https://runkit.com/npm/stellar-auth-client)

Client side library for [Stellar SEP 0010](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md) implementation.

## Installation

Install the package with:

    npm install stellar-auth-client --save

## Development

Run all tests:

```bash
$ npm install
$ npm test
```

Run a single test suite:

```bash
$ npm run mocha -- test/lib/index.spec.js
```

Run a single test (case sensitive):

```bash
$ npm run mocha -- test/lib/index.spec.js --grep 'allowHttp'
```
<sub><sup>Library based on [Stellar SEP-0010 implementation](https://github.com/gzigzigzeo/stellar-sep-0010-implementation)</sup></sub>
