const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = [{
  entry: './pacman-server/src/testing.js',

  output: {
    filename: 'testing.js',
    path: path.resolve(__dirname, './pacman-server/dist')
  },
  watch: true,
  plugins: [
    new HtmlWebpackPlugin({
      title: 'TestingPage', //Testing page for each team,
      filename: 'testing.html',
      template: './pacman-server/src/pages/testing.html'
    })
  ]
},
{
  entry: './pacman-server/src/admin.js',
  output: {
    filename: 'admin.js',
    path: path.resolve(__dirname, './pacman-server/dist')
  },
  watch: true,
  plugins: [
    new HtmlWebpackPlugin({
      title: 'AdminPage', // Admin page for cofiguration
      filename: 'admin.html',
      template: './pacman-server/src/pages/admin.html'
    }),
  ]
},
{
  entry: './pacman-server/src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './pacman-server/dist')
  },
  watch: true,
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Main', //Main page for fighting
      filename: 'main.html',
      template: './pacman-server/src/pages/main.html'
    })
  ]
}
]