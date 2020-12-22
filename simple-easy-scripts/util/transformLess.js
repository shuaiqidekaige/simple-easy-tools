const less = require('less');
const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const NpmImportPlugin = require('less-plugin-npm-import');  // 为less加前缀

function transformLess(lessFile) {
  let data = fs.readFileSync(lessFile, 'utf-8');
  // 读取文件过程中发现一个问题：已有记事本文件（非空），
  // 转码 UTF-8，复制到pycharm中，在开始位置打印结果会出现  \ufeff
  data = data.replace(/^\uFEFF/, '');
  // Do less compile
  const lessOpts = {
    paths: [path.dirname(lessFile)],  // 路径
    filename: lessFile,  // 文件名
    plugins: [new NpmImportPlugin({ prefix: '~' })],  // 插件使用
    javascriptEnabled: true,
  };
  return less
    .render(data, lessOpts)
    .then(result => postcss([autoprefixer]).process(result.css, { from: undefined }))
    .then(r => r.css);
}

module.exports = transformLess;
