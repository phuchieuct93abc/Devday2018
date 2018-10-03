const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const commonModule = {
  rules: [{
    test: /\.js$/,
    loader: 'babel-loader',
    include: __dirname + '/src',
    exclude: /node_modules/,
  },

  {
    test: /\.css$/,
    use: ExtractTextWebpackPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader'
    })
  }
  ],
}
const extractTextPlugin = new ExtractTextWebpackPlugin("styles.css");

module.exports = [{
  entry: './src/testing.js',

  output: {
    filename: 'testing.js',
    path: path.resolve(__dirname, './dist')
  },
  watch: true,
  mode: "development",
  plugins: [
    extractTextPlugin,
    new HtmlWebpackPlugin({
      title: 'TestingPage', //Testing page for each team,
      filename: 'testing.html',
      template: './src/pages/testing.html'
    })
  ],
  module: commonModule
},
{
  entry: './src/admin.js',
  output: {
    filename: 'admin.js',
    path: path.resolve(__dirname, './dist')
  },
  watch: true,
  mode: "development",
  plugins: [
    extractTextPlugin,
    new HtmlWebpackPlugin({
      title: 'AdminPage', // Admin page for cofiguration
      filename: 'admin.html',
      template: './src/pages/admin.html'
    }),
  ],
  module: commonModule

},
{
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './dist')
  },
  watch: true,
  mode: "development",
  plugins: [
    extractTextPlugin,
    new HtmlWebpackPlugin({
      title: 'Main', //Main page for fighting
      filename: 'main.html',
      template: './src/pages/main.html'
    })
  ],
  module: commonModule

}
]