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
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
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
  devtool: "source-map",
  plugins: [
    new UglifyJsPlugin({
      sourceMap: true
    })
  ]
  // watch: true
};
