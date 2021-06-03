const transformLess = require('./transformLess')
const transformJs = require('./transformJs')

const webpack = require('webpack')

function setModulesEnv(modules) {
  process.env.MODULES_ENV = modules
}

function getModulesEnv() {
  return process.env.MODULES_ENV
}

function setEnv(env) {
  process.env.NODE_ENV = env
}

function getEnv() {
  return process.env.NODE_ENV
}

function webpackBuild(webpackConfig, cb) {
  const compiler = webpack(webpackConfig);
  new webpack.ProgressPlugin().apply(compiler);
  compiler.run((err, stats) => {
    if (err) {
      console.error(chalk.red(err.stack || err));
      if (err.details) {
        console.error(chalk.red(err.details));
      }
      return;
    }
  
    const info = stats.toJson();
  
    if (stats.hasErrors()) {
      info.errors.forEach(error => {
        console.error(chalk.red(error.message));
        console.error(chalk.red(error.details));
        console.log('\n');
      })
      return;
    }
  
    if (stats.hasWarnings()) {
      console.warn(chalk.yellow(info.warnings));
    }
    cb()
  })
}


module.exports = {
  transformLess,
  transformJs,
  getModulesEnv,
  setModulesEnv,
  setEnv,
  getEnv,
  webpackBuild
}