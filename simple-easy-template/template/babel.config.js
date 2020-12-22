module.exports = function (api) {
    if (api) {
      api.cache.using(() => process.env.MODULES_ENV)
    }
    const modules = process.env.MODULES_ENV === 'lib' ? 'commonjs' : false
    return {
      presets: [
        '@babel/preset-react',
        [
          '@babel/preset-env',
          {
            loose: true,
            modules,
          },
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