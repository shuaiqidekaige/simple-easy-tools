const { transformAsync } = require('@babel/core')

function transformJs (code, filePath) {
  return new Promise((resolve, reject) => {

    transformAsync(code, { filename: filePath })  // 默认去读取根目录下的babelrc或者babel.config.js文件
      .then(result => {
        if (result) {
          resolve(result.code);
        }
      })
      .catch(reject);
  });
}

module.exports = transformJs