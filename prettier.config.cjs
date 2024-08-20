//@ts-check

/** @type {import('prettier').Config} */
const config = {
  printWidth: 90,
  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-curly",
    "prettier-plugin-sh",
    "prettier-plugin-packagejson",
  ],
  organizeImportsSkipDestructiveCodeActions: true,
};

module.exports = config;
