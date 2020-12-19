const inquirer = require('inquirer');


const PROMPTS = [
  {
    type: 'list',
    name: 'cssPreprocessors',
    message: 'please input css preprocessors:',
    choices: [
      'less',
      'sass'
    ],
    default: 'sass'
  },
  {
    type: 'confirm',
    name: 'isUseTypeScript',
    message: 'use typescript in your project?',
  },
];

async function promptsQuirer(name) {
  const inquirerInfo = await inquirer.prompt(PROMPTS);
  require('../generator')({
    projectName: name,
    ...inquirerInfo
  })
}

module.exports = promptsQuirer