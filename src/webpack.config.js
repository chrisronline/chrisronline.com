var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    alias: {
      'react': 'react-lite',
      'react-dom': 'react-lite'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'eslint-loader'
          }
        ],
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
          },
        ]
      },
      {
        test: /\.scss$|\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [ autoprefixer({ browsers: ['last 2 versions']})]
              },
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [
                  path.resolve(__dirname, './node_modules'),
                  path.resolve(__dirname, './app/components')
                ],
              },
            },
          ]
        })
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=[name].[ext]'
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin({ filename: '[name].css', allChunks: false }),
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true)
      }
    })
  ],
};