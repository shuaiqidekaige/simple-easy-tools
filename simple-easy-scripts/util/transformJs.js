const { transformAsync } = require('@babel/core')
const { readFileSync, removeSync, outputFileSync } = require('fs-extra')

function transformJs (filePath) {
  return new Promise((resolve, reject) => {
    let code = readFileSync(filePath, 'utf-8');

    transformAsync(code, { filename: filePath })  // 默认去读取根目录下的babelrc或者babel.config.js文件
      .then(result => {
        if (result) {
          const jsFilePath = filePath.replace(/\.\w+$/, '.js')
          removeSync(filePath);
          outputFileSync(jsFilePath, result.code);
          resolve();
        }
      })
      .catch(reject);
  });
}

module.exports = transformJs