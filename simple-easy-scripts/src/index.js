#!/usr/bin/env node
const { program } = require('commander');
const packageInfo = require('../package.json');

program
  .version(packageInfo.version)
  .command('run [name]', 'run specified task')
  .command('doc [name]', 'doc specified task')
  .command('test', 'jest test all components')
  .parse(process.argv);