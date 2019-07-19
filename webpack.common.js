const path = require("path");

module.exports = {
  entry: {
    "stellar-auth-client": "./lib/browser.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    library: "StellarAuthClient",
    umdNamedDefine: true,
  },
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      }
    ]
  }
};
