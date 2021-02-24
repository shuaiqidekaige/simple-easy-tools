const path = require('path');

module.exports = {
  "root": true,
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    "ecmaVersion":2019,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "babelOptions": {
      "configFile": path.resolve(process.cwd(), 'babel.config.js'),
    }
  },
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "es6": true,
  },
  "extends": [
    "airbnb",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",  // 关闭所有和prettier冲突的eslint代码风格冲突的配置
  ],
  "plugins": [
    "@babel",
    "react",
    "react-hooks"
  ],
  "rules": {
    // babel eslint
    "@babel/new-cap": 2,
    "@babel/no-invalid-this": 2,
    "@babel/no-unused-expressions": 1,
    "@babel/object-curly-spacing": 0, // 大括号{}中间有空格
    "@babel/semi": 0, // 逗号结尾

    'react/jsx-one-expression-per-line': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-indent': 0,
    'react/jsx-wrap-multilines': ['error', { declaration: false, assignment: false }],
    'react/jsx-filename-extension': 0,
    'react/state-in-constructor': 0,
    'react/jsx-props-no-spreading': 0,
    'react/destructuring-assignment': 0, // TODO: remove later
    'react/require-default-props': 0,
    'react/sort-comp': 0,
    'react/display-name': 0,
    'react/static-property-placement': 0,
    'react/no-find-dom-node': 0,
    'react/no-unused-prop-types': 0,
    'react/default-props-match-prop-types': 0,
    'react-hooks/rules-of-hooks': 2,
  }
};
