//@ts-check

/** @type {import("prettier").Config} */
const config = {
  plugins: [
    "prettier-plugin-curly",
    "prettier-plugin-sh",
    "prettier-plugin-packagejson",
    "prettier-plugin-jsdoc",
  ],
  overrides: [
    {
      files: "*.jsonc",
      options: {
        trailingComma: "none",
      },
    },
  ],
  printWidth: 90,
  // Let prose wrap naturally in the reader's editor.
  proseWrap: "never",
  useTabs: false,
};

export default config;
