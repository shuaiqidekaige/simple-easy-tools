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

const templateName = '@simple-easy/simple-easy-template'
let manager

// 生成器
async function generator(obj) {
  cwd = process.cwd()
  projectName = obj.projectName
  targetDir = path.resolve(cwd, projectName)
  fs.ensureDirSync(targetDir);
  manager = useYarnOrNpm()
  await createPackAgeJson();
  installAllDependencies();
  generatorTemplate(obj);
}
// 获取包最近的版本
async function getPkgLatestVersion (pkg) {
  try {
    return await checkForLatestVersion(pkg)
  } catch (error) {
    try {
      // 报错则用npm view yourPack version 来查询最新包的版本
      return execSync(`npm view ${pkg} version`, { stdio: 'ignore' }).toString().trim();
    } catch (error) {
      console.log()
      return null
    }
  }
}

// 查询包最近版本
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

// 获取项目依赖
async function getDependencies () {
  const devDependencies = [templateName]
  const lastedDevDependencies = {}
  for (let i = 0; i < devDependencies.length; i++) {
    const devDependencie = devDependencies[i];
    lastedDevDependencies[devDependencie] = await getPkgLatestVersion(devDependencie)
  }
  return {
    devDependencies: lastedDevDependencies
  }
}

// 生成模板
function generatorTemplate (obj) {
  const { projectName, cssPreprocessors, isUseTypeScript } = obj
  const args = `
    var init = require('${templateName}/init.js');
    init.apply(null, JSON.parse(process.argv[1]));
  `
  const params = [projectName, cssPreprocessors, isUseTypeScript, targetDir, templateName, manager]
  executeNodeScript(targetDir, process.execPath, ['-e', args, JSON.stringify(params)])
}

// 创建packagejson文件
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

// 安装依赖
function installAllDependencies() {
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

// 执行node脚本
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

// 获取包管理器名称
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

// 检测yarn或者npm是否存在
function checkYarnOrNpmIsExit (order) {
  try {
    execSync(`${order} --version`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = generator