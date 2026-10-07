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
  // This to keep our documentation fluid, ignoring line length for prose like markdown
  proseWrap: "never",
  useTabs: false,
};

export default config;
