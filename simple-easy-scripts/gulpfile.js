const gulp = require('gulp');
const path = require('path');
const fs = require('fs-extra')
const through2 = require('through2');
const rimraf = require('rimraf');
const merge2 = require('merge2')
const babel = require('gulp-babel');
const { outputFileSync } = require('fs-extra')
const { transformLess, setModulesEnv, transformJs, getModulesEnv, webpackBuild } = require('./util')
const getScriptBuildConfig = require('../config/webpackConfig/scriptBuild.js')

const dist = path.resolve(process.cwd(), './dist')

const libDir = path.resolve(dist, './lib')
const esDir = path.resolve(dist, './es')

const packName = 'components'

function compile(modules) {
  // 删除文件夹
  setModulesEnv(modules)
  rimraf.sync(modules === 'lib' ? libDir : esDir);
  // 编译less
  const less = gulp
      .src([`${packName}/**/*.less`]) // 读取components下的less文件, 创建流
      .pipe(
          through2.obj(function (file, encoding, next) { // 转化流
              this.push(file.clone());
              transformLess(path.resolve(process.cwd, file.path)).then(css => {
                  file.contents = Buffer.from(css);
                  file.path = file.path.replace(/\.less$/, '.css');
                  this.push(file);
                  next();
              }).catch(e => {
                console.error(e);
              });
          })
      ).pipe(gulp.dest(modules === 'es' ? esDir : libDir));
  // 编译图片
  const assets = gulp
    .src([`${packName}/**/*.@(png|svg)`]) // glob规则
    .pipe(gulp.dest(modules === 'es' ? esDir : libDir));

  // 编译jsx
  const jsx = gulp.src([`${packName}/**/*.@(jsx|js)`]).pipe(babel()).pipe(
      through2.obj(function (file, encoding, next) {
          this.push(file.clone());
          next();
        })
  ).pipe(gulp.dest(modules === 'es' ? esDir : libDir))
  return merge2([less, assets, jsx]);
}
// 生成样式入口文件
async function generateCssEntry (dir, files) {
  let content = ''
  files.forEach(file => {
    if (fs.existsSync(path.join(dir, file, 'style', 'index.less'))) {
      content += `@import "./${path.join(file, 'style', 'index.less').replace(/\\/g, () => '/')}";\n`;
    }
  });
  outputFileSync(
    path.join(libDir, 'index.less'),
    content,
  );
  let css
  try {
    css = await transformLess(path.join(libDir, 'index.less'))
  } catch (error) {
    console.log(error)
  }
  outputFileSync(
    path.join(libDir, 'index.css'),
    css,
  );
}

// 生成js入口文件
async function generateJsEntry (dir, files) {
  let content = ''
  files.forEach(file => {
    if (fs.existsSync(path.join(dir, file, 'index.js'))) {
      let name = ''
      const arr = file.split('-')
      for(let i = 0;i < arr.length;i++){
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
      }
      name = arr.join('')
      content += `export { default as ${name} } from "./${file}";\n`;
    }
  });
  let baseDir = getModulesEnv() === 'lib' ? libDir : esDir
  const entryJs = path.join(baseDir, 'index.js')
  if (getModulesEnv() === 'lib') {
    content = await transformJs(content, entryJs)
  }
  outputFileSync(
    entryJs,
    content,
  );
  
}
// 生成入口文件
async function generateEntry (modules) {
  setModulesEnv(modules)
  const dir = getModulesEnv() === 'lib' ? libDir : esDir;
  const files = fs.readdirSync(dir);
  await generateJsEntry(dir, files)
  if (getModulesEnv() === 'lib') {
    await generateCssEntry(dir, files)
  }
}

gulp.task('compile-with-es', done => {
  console.log('[Parallel] Compile to es...');
  compile('es').on('finish', done);
});

gulp.task('compile-with-lib', done => {
  console.log('[Parallel] Compile to lib...');
  compile('lib').on('finish', done);
});

gulp.task('generateEsEntry', async done => {
  console.log('[series] generateEsEntry...');
  await generateEntry('es')
  done()
})

gulp.task('generateLibEntry', async done => {
  console.log('[series] generateLibEntry...');
  await generateEntry('lib')
  done()
})

gulp.task('generateScriptEntry', async done => {
  webpackBuild(getScriptBuildConfig, done)
})

// 打包
gulp.task(
  'compile',
  gulp.series(gulp.series('compile-with-es', 'compile-with-lib'), gulp.series('generateEsEntry', 'generateLibEntry', 'generateScriptEntry'))
);

