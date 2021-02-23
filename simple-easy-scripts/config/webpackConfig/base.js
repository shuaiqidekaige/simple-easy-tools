const path = require('path')
const WebpackBar = require('webpackbar');
const baseDir = process.cwd()
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(baseDir, 'doc/index.js'),
  output: {
    path: path.resolve(baseDir, 'docDist'),
    filename: 'index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'doc',
      inject: true,
      template: path.resolve(process.cwd(), 'public/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }),
    new WebpackBar({
      name: require(path.resolve(process.cwd(), 'package.json')).name + ' compiler'
    }),
  ],
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)/,
        exclude: /(node_modules)/,
        use: ['babel-loader']
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        exclude: /(node_modules)/,
        options: {
          limit: 10000,
          name: 'static/image/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.md$/,
        use: ['babel-loader','@simple-easy/simple-easy-mdloader']
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        chunks: {
          chunks: 'all',
          minChunks: 2,
          minSize: 0,
          name: 'chunks',
        },
      },
    },
  },
}