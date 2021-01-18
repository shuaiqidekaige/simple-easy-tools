const { createHash } = require('crypto');
const { createTransformer } = require('babel-jest');
const path = require('path')
const { existsSync } = require('fs-extra')

function loadBabelConfig() {
  const babelConfigPath = path.resolve(process.cwd(), 'babel.config')
  if (existsSync(babelConfigPath)) {
    return require(babelConfigPath)
  }
  return {};
}

module.exports = {
  canInstrument: true,
  getCacheKey(sourceText) {
    const babelOptions = loadBabelConfig();
    return createHash('md5')
      .update('\0', 'utf8')
      .update(JSON.stringify(babelOptions))
      .update('\0', 'utf8')
      .update(sourceText)
      .update('\0', 'utf8')
      .update('components')
      .update('\0', 'utf8')
      .digest('hex');
  },
  process(sourceText, sourcePath, transformOptions) {
    const babelOptions = loadBabelConfig();

    const babelJest = createTransformer(babelOptions);
    return babelJest.process(sourceText, sourcePath, transformOptions);
  },
};