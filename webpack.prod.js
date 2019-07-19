const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  externals: {
    'stellar-sdk': 'StellarSdk'
  },
  optimization: {
    nodeEnv: 'production'
  }
});
