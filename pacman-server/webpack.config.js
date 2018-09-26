const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    publicPath: '/dist/',
    path: path.resolve(__dirname, './dist')
  },

  watch:true,
  mode:'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("css")
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("app.css"),
  ]
};