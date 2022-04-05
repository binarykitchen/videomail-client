module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['eslint:recommended', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    'no-else-return': 1,
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'ignore',
        named: 'ignore',
        asyncArrow: 'ignore'
      }
    ]
  },
  ignorePatterns: ['node_modules/*']
}
