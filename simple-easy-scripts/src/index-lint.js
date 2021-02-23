const path = require('path')
const { program } = require('commander');
const chalk = require('chalk');
const execSync = require('child_process').execSync;

const rootDir = process.cwd()

function runEslint () {
  execSync(`eslint --fix --ext .jsx,.js`, { cwd: rootDir, stdio: 'inherit' })
}

function runPrettier () {
  execSync(`prettier --write`, { cwd: rootDir, stdio: 'inherit' })
}

function runStyleLint () {
  execSync(`stylelint --fix`, { cwd: rootDir, stdio: 'inherit' })
}

function lint () {
  runEslint()
  runPrettier()
  runStyleLint()
}

lint()



