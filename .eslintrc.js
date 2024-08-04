module.exports = {
  parser: "@babel/eslint-parser",
  extends: ["eslint:recommended", "plugin:import/recommended", "prettier"],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    "import/resolver": {
      node: true,
    },
  },
  rules: {
    // Turns on errors for missing imports which is great
    "import/no-unresolved": "error",

    // TODO Fix later
    "sort-imports": "off",
    "sort-keys": "off",
    "no-warning-comments": "off",
    "prefer-arrow-callback": "off",
    "func-names": "off",
    "no-magic-numbers": "off",
    "id-length": "off",
    "no-empty-function": "off",
    "no-shadow": "off",
    "max-lines": "off",
    "max-statements": "off",
    "max-lines-per-function": "off",
    "no-undefined": "off",
    "one-var": "off",
    "no-inline-comments": "off",
    "line-comment-position": "off",
    "capitalized-comments": "off",
    "func-style": "off",
    "prefer-destructuring": "off",
    "init-declarations": "off",
    "no-invalid-this": "off",
    "no-multi-assign": "off",
    "max-params": "off",
    "no-plusplus": "off",
    "no-ternary": "off",
  },
};
