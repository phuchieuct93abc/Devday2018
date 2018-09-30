const path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  module: {
    rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname + '/src',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin("bundle.css")
  ]
};