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
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: false
        }
      },
      postcssLoader,
      'less-loader'
    ]
  },
  sass: {
    test: /(\.scss|\.sass)$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: false
        }
      },
      postcssLoader,
      'sass-loader'
    ]
  }
}

function getDevWebpackConfig (config) {
  const preprocessor = config.css.preprocessor
  const preprocessorRules = getPreprocessorRules[preprocessor]
  return {
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: false
              }
            },
            'postcss-loader'
          ]
        },
        preprocessorRules
      ]
    },
    devServer: {
      port: 8080,
      host: '0.0.0.0',
      hot: true,
      compress: true,
      watchContentBase: true,
      stats: 'errors-only',
      quiet: true
    }
  }
}

module.exports = getDevWebpackConfig