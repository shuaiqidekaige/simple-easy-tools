#!/usr/bin/env node
const commander = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra')
const validateProjectName = require("validate-npm-package-name");
const path = require('path');

const packageJson = require('../package.json');

let projectName

// 校验包名
function validateName(name) {
  const validationResult = validateProjectName(name);
  if (!validationResult.validForNewPackages) {
    console.error(
      chalk.red(
        `Cannot create a project named ${chalk.green(
          `"${appName}"`
        )} because of npm naming restrictions:\n`
      )
    );
    [
      ...(validationResult.errors || []),
      ...(validationResult.warnings || []),
    ].forEach(error => {
      console.error(chalk.red(`  * ${error}`));
    });
    console.error(chalk.red('\nPlease choose a different project name.'));
    process.exit(1);
  }
}

// 检测文件是否存在
function checkFileDirIsExit (dir) {
  const targetDir = path.resolve(process.cwd(), dir)
  if (fs.existsSync(targetDir)) {
    console.error(chalk.red('directory is exist, please retry to enter project'))
    process.exit(1)
  }
}

// 检测项目名称
function checkProjectName(name) {
  if (typeof name === 'undefined') {
    console.error('please enter your project-directory')
    console.log('');
    console.log('Example To Create Project:');
    console.log(`${packageJson.name} ${chalk.green('<project-directory>')}`);
    console.log('');
    console.log(
      `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
  }
  validateName(name)
  checkFileDirIsExit(name)
  projectName = name
}

const program = new commander.Command(packageJson.name);

program.on('--help', () => {
  console.log('');
  console.log('Example To Create Project:');
  console.log(`${packageJson.name} ${chalk.green('<project-directory>')}`);
});

program
  .version(packageJson.version)
  .arguments('[project-directory]')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action(async name => {
    checkProjectName(name);
    await require('./inquirer')(name)
  })
  .parse(process.argv);

