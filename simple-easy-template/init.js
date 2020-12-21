const fs = require('fs-extra')
const chalk = require('chalk')
const path = require('path')
const fg = require('fast-glob')
const ejs = require('ejs')
const execSync = require('child_process').execSync;


function installAllDependencies(manager, targetDir) {
  try {
    console.log('Installing packages. This might take a couple of minutes.');
    execSync(`${manager} install`, { cwd: targetDir, stdio: 'inherit' })
  } catch (error) {
    console.error(chalk.red(error))
    process.exit(1)
  }
}

function init (...args) {
  const [projectName, cssPreprocessors, isUseTypeScript, targetDir, templateName, manager] = args
  try {
    const dirname = path.dirname(require.resolve(`${templateName}/package.json`, { paths: [targetDir] }))
    const templateDir = path.join(dirname, 'template')
    if (fs.existsSync(templateDir)) {
      const templateFiles = fg.sync('**', {
        dot: true,
        cwd: templateDir
      });
      templateFiles.forEach((filePath) => {
        const templatePath = path.join(templateDir, filePath)
        const outputPath = filePath.replace('.tpl', '');
        const writePath = path.join(targetDir, outputPath)
        const data = fs.readFileSync(templatePath, 'utf8')
        const renderContent = ejs.render(data, {projectName})
        fs.writeFileSync(writePath, renderContent)
      });
      installAllDependencies(manager, targetDir)
    } else {
      console.error(
        `could not locate supplied template: ${chalk.green(templateDir)}`
      )
      return
    }
  } catch (error) {
    console.error(chalk.red(error))
  }
}

module.exports = init