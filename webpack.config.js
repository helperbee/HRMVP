const path = require('path');
const dotenv = require('dotenv');

const webpack = require('webpack');

module.exports = {
  entry: './dist/index.js',
  mode:'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.AWS_SERVER': JSON.stringify(process.env.AWS_SERVER),
    }),
  ],
};