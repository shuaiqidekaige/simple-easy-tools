const chalk = require('chalk');
const { program } = require('commander');
const address = require('address');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const { setEnv, webpackBuild } = require('../util');
const getWebpackConfig = require('../config/webpackConfig')
const portfinder = require('portfinder');

program.parse(process.argv);

const task = program.args[0];

function serverLog(port) {
  const local = `http://localhost:${port}/`;
  const network = `http://${address.ip()}:${port}/`;

  console.log('\n  Site running at:\n');
  console.log(`  ${chalk.bold('Local')}:    ${chalk.blue(local)} `);
  console.log(`  ${chalk.bold('Network')}:  ${chalk.blue(network)}`);
}

function getPort() {
  return portfinder.getPortPromise()
}

async function runDevser() {
  try {
    const port = await getPort()
    startUpDevServer(port)
  } catch (error) {
    console.log(chalk.red(error));
  }
}

function startUpDevServer(port) {
  const configs = getWebpackConfig()
  const compiler = webpack(configs)
  const devServerConfig = configs.devServer
  devServerConfig.port = port
  const server = new webpackDevServer(compiler, devServerConfig)
  server.showStatus = function () {
  };
  server.listen(port, '0.0.0.0', (err) => {
    if (err) {
      console.log(chalk.red(err));
    } else {
      serverLog(port)
    }
  });
}

function build() {
  webpackBuild(getWebpackConfig(), () => {
    console.log('打包成功')
  })
}


function docTask(task) {
  if (task === 'dev') {
    setEnv('development')
    runDevser()
  } else if (task === 'build') {
    setEnv('production')
    build()
  } else {
    console.log(chalk.red('no task here'))
  }
}

if (!task) {
  program.help();
} else {
  console.log('demo-tool doc', task);
  docTask(task);
}
