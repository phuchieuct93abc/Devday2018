const path = require('path');

module.exports = {
  entry: './pacman-server/src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './pacman-server/dist')
  },
 
  watch:true,
  mode:'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-loader' ]
      }
    ]
  }
};