# Stellar Auth client library
[![Version](https://img.shields.io/npm/v/stellar-auth-client.svg)](https://www.npmjs.org/package/stellar-auth-client)
[![Build Status](https://api.travis-ci.org/dolcalmi/stellar-auth-client.svg?branch=master)](https://travis-ci.org/dolcalmi/stellar-auth-client)
[![Coverage Status](https://coveralls.io/repos/github/dolcalmi/stellar-auth-client/badge.svg?branch=master)](https://coveralls.io/github/dolcalmi/stellar-auth-client?branch=master)
[![David](https://img.shields.io/david/dolcalmi/stellar-auth-client.svg)](https://david-dm.org/dolcalmi/stellar-auth-client)
[![David](https://img.shields.io/david/dev/dolcalmi/stellar-auth-client.svg)](https://david-dm.org/dolcalmi/stellar-auth-client?type=dev)
[![Try on RunKit](https://badge.runkitcdn.com/stellar-auth-client.svg)](https://runkit.com/npm/stellar-auth-client)

Client side library for [Stellar SEP 0010](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md) implementation.

## Quick start

Using npm to include stellar-auth-client in your own project:

```shell
npm install --save stellar-auth-client
```

For browsers,
[use Bower to install stellar-auth-client](#to-self-host-for-use-in-the-browser). It
exports a variable `StellarAuthClient`. The example below assumes you have
`stellar-auth-client.js` relative to your html file.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/{version}/stellar-sdk.js"></script>
<script src="stellar-auth-client.js"></script>
<script>
  console.log(StellarAuthClient);
</script>
```

## Install

### To use as a module in a Node.js project

1. Install it using npm:

```shell
npm install --save stellar-auth-client
```

2. require/import it in your JavaScript:

```js
var StellarAuthClient = require('stellar-auth-client');
```

### To self host for use in the browser

1. Install it using [bower](http://bower.io):

```shell
bower install stellar-auth-client
```

2. Include it in the browser:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/{version}/stellar-sdk.js"></script>
<script src="./bower_components/stellar-auth-client/stellar-auth-client.js"></script>
<script>
  console.log(StellarAuthClient);
</script>
```


## Development

Run all tests:

```bash
$ npm install
$ npm test
```

To run a specific set of tests:

```shell
gulp test:node
gulp test:browser
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
