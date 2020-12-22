const path = require('path');
const { merge } = require('webpack-merge');
const fs = require('fs-extra')

const { getEnv } = require('../util')
const baseConfig = require('./base')
const devConfig = require('./dev')
const prodConfig = require('./build')

function getSimpleEastConfig () {
  const basePath = process.cwd()
  const configPath = path.join(basePath, 'simple-easy.config.js')
  if (fs.existsSync(configPath)) {
    return require(configPath)
  } else {
    return {
      css: {
        preprocessor: 'less',
      }
    }
  }
}


function getWebpackConfig () {
  const env = getEnv()
  const simpleEasyConfig = getSimpleEastConfig()
  let config = {}
  if (env === 'development') {
    config = devConfig(simpleEasyConfig)
  } else {
    config = prodConfig(simpleEasyConfig)
  }
  return merge(baseConfig, config)
}

module.exports = getWebpackConfig