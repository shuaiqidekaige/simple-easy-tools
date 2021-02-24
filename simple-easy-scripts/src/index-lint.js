const path = require('path')
const { program } = require('commander');
const chalk = require('chalk');
const execSync = require('child_process').execSync;

const rootDir = process.cwd()

function runEslint () {
  execSync(`eslint --fix --ext .js,.jsx`, { cwd: rootDir, stdio: 'inherit' })
}

function runPrettier () {
  execSync(`prettier "**/*.@(jsx|js)" -c --write`, { cwd: rootDir, stdio: 'inherit' })
}

function runStyleLint () {
  execSync(`stylelint "{doc,components}/**/*.{css,less,scss,sass}" --fix`, { cwd: rootDir, stdio: 'inherit' })
}

function lint () {
  runEslint()
  runPrettier()
  runStyleLint()
}

lint()
