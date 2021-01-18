const jest = require('jest')
const { existsSync } = require('fs-extra')
const path = require('path')
const { program } = require('commander');
const chalk = require('chalk');
const { setModulesEnv } = require('../util')

const rootDir = process.cwd()

function getConfig () {
  const originConfigPath = path.resolve(__dirname, '../jestConfig/jest.config.js')
  const configPath = path.resolve(rootDir, 'jest.config.js')
  const originConfig = require(originConfigPath)
  let config = {}
  if (existsSync(configPath)) {
    config = require(configPath)
  }
  return {
    ...originConfig,
    ...config
  }
}

program
  .option('--clear', 'clear cache')
  .option('--watch', 'watch file')

program.parse(process.argv);

const options = program.opts();

function runJest () {
  setModulesEnv('test')
  const config = {
    rootDir,
    config: getConfig(),
    watch: options.watch,
    clearCache: options.clear,
  }
  jest.runCLI(config, [ rootDir ]).then(response => {
    if (!response.results.success && !options.watch) {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error(chalk.red(err));

    if (!options.watch) {
      process.exit(1);
    }
  });
}


runJest() 