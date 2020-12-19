const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const spawnSync = require('child_process').spawnSync;
const https = require('https');

let targetDir
let cwd
let projectName

const templateName = 'vue'
const scripts = 'demo-scripts'
let manager

async function generator(obj) {
  cwd = process.cwd()
  projectName = obj.projectName
  targetDir = path.resolve(cwd, projectName)

  fs.ensureDirSync(targetDir);

  await createPackAgeJson();
  installAllDependencies();
  generatorTemplate();

}

async function getPkgLatestVersion (pkg) {
  try {
    return await checkForLatestVersion(pkg)
  } catch (error) {
    try {
      return execSync(`${pkg} view version`, { stdio: 'ignore' }).toString().trim();
    } catch (error) {
      console.log()
      return null
    }
  }
}

function checkForLatestVersion(pkg) {
  return new Promise((resolve, reject) => {
    https
      .get(
        `https://registry.npmjs.org/-/package/${pkg}/dist-tags`,
        res => {
          if (res.statusCode === 200) {
            let body = '';
            res.on('data', data => (body += data));
            res.on('end', () => {
              resolve(JSON.parse(body).latest);
            });
          } else {
            reject();
          }
        }
      )
      .on('error', () => {
        reject();
      });
  });
}

async function getDependencies () {
  const devDependencies = [templateName, scripts]
  const lastedDevDependencies = {}
  for (let i = 0; i < devDependencies.length; i++) {
    const devDependencie = devDependencies[i];
    lastedDevDependencies[devDependencie] = await getPkgLatestVersion(devDependencie)
  }
  return {
    devDependencies: lastedDevDependencies
  }
}

function generatorTemplate () {
  const args = `
    var init = require('${scripts}/init.js');
    init.apply(null, JSON.parse(process.argv[1]));
  `
  const params = [targetDir, projectName, manager, scripts]
  executeNodeScript(targetDir, process.execPath, ['-e', args, JSON.stringify(params)])
}

async function createPackAgeJson() {
  console.log('check your envirnment, it will take few minutes.');
  const dependencies = await getDependencies()
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    ...dependencies
  };
  fs.writeFileSync(
    path.join(targetDir, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );
}

function installAllDependencies() {
  manager = useYarnOrNpm()
  if (manager) {
    try {
      console.log('Installing packages. This might take a couple of minutes.');
      execSync(`${manager} install`, { cwd: targetDir, stdio: 'inherit' })
    } catch (error) {
      console.error(chalk.red(error))
      process.exit(1)
    }
  } else {
    console.error(chalk.red('please install yarn or npm'))
    process.exit(1)
  }
}

function executeNodeScript(cwd, command, args) {
  try {
    spawnSync(
      command,
      args,
      { cwd, stdio: 'inherit' }
    );
  } catch (error) {
    console.error(chalk.red(error))
  }
}

function useYarnOrNpm() {
  const isExitYarn = checkYarnOrNpmIsExit('yarnpkg')
  if (isExitYarn) {
    return 'yarn'
  }
  const isExitNpm = checkYarnOrNpmIsExit('npm')
  if (isExitNpm) {
    return 'npm'
  }
  return ''
}

function checkYarnOrNpmIsExit (order) {
  try {
    execSync(`${order} --version`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = generator