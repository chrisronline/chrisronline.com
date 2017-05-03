const webpack = require('webpack')
const path = require('path')
const baseConfig = require('./webpack.config.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = Object.assign({}, baseConfig, {
  entry: {
    site: './app/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'deploy', 'assets'),
    filename: '[name]_[hash].js'
  },
  module: {
    rules: baseConfig.module.rules.map(rule => {
      if (rule.loader && rule.loader.indexOf('file-loader') > -1) {
        rule.loader = 'file-loader?name=[name].[ext]&outputPath=assets/fonts'
      }
      return rule
    })
  },
  plugins: [
    new ExtractTextPlugin('[name]_[hash].css'),
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
})

module.exports = config