//@ts-check

/** @type {import("prettier").Config} */
const config = {
  printWidth: 90,
  plugins: [
    "prettier-plugin-curly",
    "prettier-plugin-sh",
    "prettier-plugin-packagejson",
    "prettier-plugin-jsdoc",
  ],
  useTabs: false,
};

export default config;
