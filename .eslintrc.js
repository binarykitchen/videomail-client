module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['eslint:recommended', 'plugin:import/recommended', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    // Turns on errors for missing imports which is great
    'import/no-unresolved': 'error'
  }
}
