const transformLess = require('./transformLess')
const transformJs = require('./transformJs')

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


module.exports = {
  transformLess,
  transformJs,
  getModulesEnv,
  setModulesEnv,
  setEnv,
  getEnv
}