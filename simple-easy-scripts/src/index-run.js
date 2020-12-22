const gulp = require('gulp');
const chalk = require('chalk');
const { program } = require('commander');

program.parse(process.argv);

const task = program.args[0];

function runTask(task) {
  const instace = gulp.task(task)
  if (instace === undefined) {
    console.log(chalk.red('no task here'))
    return
  }
  try {
    instace.apply(gulp);
  } catch (error) {
    console.log(chalk.red(error))
  }
}

if (!task) {
  program.help();
} else {
  console.log('demo-tool run', task);

  require('../gulpfile');

  runTask(task);
}
