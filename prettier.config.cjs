//@ts-check

/** @type {import('prettier').Config} */
const config = {
  printWidth: 90,
  plugins: ["prettier-plugin-curly", "prettier-plugin-sh", "prettier-plugin-packagejson"],
};

module.exports = config;
