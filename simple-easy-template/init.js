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

function writeFile (dirPath, content, target) {
  const dirArr = dirPath.split('/')
  let index = 0
  while (++index) {
    const dir = dirArr.slice(0, index).join('/')
    console.log(dir)
    const writePath = path.join(target, dir)
    if (dirArr.length <= index) {
      fs.ensureFileSync(writePath)
      fs.writeFileSync(writePath, content)
      break;
    } else {
      fs.ensureDirSync(writePath)
    }
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
        const data = fs.readFileSync(templatePath, 'utf8')
        const renderContent = ejs.render(data, { projectName, preprocessor: cssPreprocessors })
        writeFile(filePath, renderContent, targetDir)
        // fs.writeFileSync(writePath, renderContent)
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