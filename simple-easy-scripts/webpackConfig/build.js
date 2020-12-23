const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path')
const fs = require('fs')

const getPostcssConfig = () => {
  const basePath = process.cwd()
  let baseConfig = require(path.join(__dirname, '../postcss.config.js'))
  const configPath = path.join(basePath, 'postcss.config.js')
  if (fs.existsSync(configPath)) {
    const rootConfig = require(configPath)
    const { plugins = [] }  = rootConfig
    const allPlugins = [ ...baseConfig.plugins, ...plugins ]
    baseConfig = Object.assign(baseConfig, rootConfig)
    baseConfig.plugins = allPlugins
  }
  return baseConfig
}


const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: getPostcssConfig(),
  }
}


const getPreprocessorRules = {
  less: {
    test: /\.less$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: { publicPath: '../../' }
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      },
      postcssLoader,
      'less-loader'
    ]
  },
  sass: {
    test: /(\.scss|\.sass)$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: { publicPath: '../../' }
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      },
      postcssLoader,
      'sass-loader'
    ]
  }
}


function getBuildWebpackConfig (config) {
  const preprocessor = config.css.preprocessor
  const preprocessorRules = getPreprocessorRules[preprocessor]
  return {
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: '../../' }
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            postcssLoader
          ]
        },
        preprocessorRules
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      })
    ],
  }
}

module.exports = getBuildWebpackConfig