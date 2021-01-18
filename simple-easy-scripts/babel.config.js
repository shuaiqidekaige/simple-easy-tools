module.exports = function (api) {
    if (api) {
      api.cache.using(() => process.env.MODULES_ENV)
    }
    let presetParams = {}
    if (process.env.MODULES_ENV === 'test') {
        presetParams = {
            targets: { node: 'current' }
        }
    } else {
        const modules = process.env.MODULES_ENV === 'lib' ? 'commonjs' : false
        presetParams = {
            loose: true,
            modules,
        }
    }
    return {
      presets: [
        '@babel/preset-react',
        [
          '@babel/preset-env',
          presetParams,
        ]
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime'
        ],
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-proposal-class-properties'
      ],
    };
  }