const webpackConfig = require("./webpack.dev.js");

delete webpackConfig.plugins;
delete webpackConfig.output;

module.exports = function(config) {
  config.set({
    frameworks: ["mocha", "chai"],
    browsers: ["FirefoxHeadless"],

    files: [
      "dist/stellar-auth-client.dev.js",
      "test/mocha.js",
      "test/lib/**/*.js",
    ],

    preprocessors: {
      "test/**/*.js": ["webpack"],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true,
    },

    singleRun: true,

    reporters: ["dots"],
  });
};


// module.exports = function(config) {
//   config.set({
//     frameworks: ['mocha', 'chai-as-promised', 'chai'],
//     browsers: ['Firefox'],
//
//     files: [
//       'dist/stellar-auth-client.js',
//       'test/mocha.js',
//       'test/test-utils.js',
//       'test/challenge-util.js',
//       'test/lib/**/*.js'
//     ],
//
//     preprocessors: {
//       'test/**/*.js': ['webpack']
//     },
//
//     webpack: {
//       node: {
//         fs: "empty"
//       },
//       module: {
//         rules: [
//           {
//             test: /\.js$/,
//             exclude: /node_modules/,
//             loader: "babel-loader",
//             options: {
//               presets: ["@babel/preset-env"],
//               plugins: [
//                 [
//                   "@babel/plugin-transform-runtime",
//                   {
//                     "regenerator": true,
//                     "useESModules": false,
//                   }
//                 ],
//                 ["babel-plugin-transform-builtin-extend", {
//                   globals: ["Error", "Array"]
//                 }]
//               ]
//             },
//           }
//         ]
//       },
//       mode: 'development'
//     },
//
//     webpackMiddleware: {
//       noInfo: true
//     },
//
//     singleRun: false,
//
//     reporters: ['dots']
//   });
// };
