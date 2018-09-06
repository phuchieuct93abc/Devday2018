const path = require('path');

module.exports = {
  entry: './packman-server/src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './packman-server/dist')
  },
  watch:true,
  mode:'development'
};