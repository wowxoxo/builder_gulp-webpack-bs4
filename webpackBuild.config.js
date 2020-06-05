const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  output: {
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: "pre",
        loader: "jshint-loader"
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        query: {
          presets: [["latest", { modules: false }]]
        }
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: false
    })
  ]
};
