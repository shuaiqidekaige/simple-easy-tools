const path = require('path')
const baseDir = process.cwd()
const pkg = path.resolve(baseDir, 'package.json')

module.exports = {
  mode: 'production',
  entry: path.resolve(baseDir, 'dist/es/index.js'),
  output: {
    path: path.resolve(baseDir, 'dist'),
    filename: 'index.min.js',
    library: pkg.name,
    libraryTarget: 'umd',
  },
  externals : {
    react: 'react',
  },
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