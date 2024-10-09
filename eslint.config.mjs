// @ts-check

import eslint from "@eslint/js";
import * as depend from "eslint-plugin-depend";
import eslintPluginImportX from "eslint-plugin-import-x";
import vitest from "@vitest/eslint-plugin";
import pluginPromise from "eslint-plugin-promise";
import * as regexpPlugin from "eslint-plugin-regexp";
import pluginSecurity from "eslint-plugin-security";
import globals from "globals";
import tseslint from "typescript-eslint";
import storybook from "eslint-plugin-storybook";

// Good reference: https://github.com/dustinspecker/awesome-eslint#readme

export default tseslint.config(
  eslint.configs.all,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...storybook.configs["flat/recommended"],
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  pluginSecurity.configs.recommended,
  regexpPlugin.configs["flat/all"],
  pluginPromise.configs["flat/recommended"],
  depend.configs["flat/recommended"],
  {
    ignores: [
      ".github",
      ".vscode",
      "**/node_modules/",
      ".git",
      "test",
      "dist",
      ".storybook/public",
      "storybook-static",
    ],
    name: "Ignore files",
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
        ecmaVersion: 2022,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    name: "All",
    // TODO Consider removing some of these OFF-rules over time
    rules: {
      "@typescript-eslint/no-dynamic-delete": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "off",

      // See https://github.com/orgs/react-hook-form/discussions/8622#discussioncomment-4060570
      "@typescript-eslint/no-misused-promises": [
        2,
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      // Prepend "_" in the names of unused function arguments to silence
      // Our linter for some useful parameters we want to still display
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/restrict-template-expressions": "off",
      camelcase: "off",
      "capitalized-comments": "off",
      complexity: "off",
      "consistent-return": "off",
      "default-param-last": "off",
      "func-names": "off",
      "func-style": "off",
      "id-length": "off",
      "import-x/no-named-as-default-member": "off",
      "init-declarations": "off",
      "max-depth": "off",
      "max-lines": "off",
      "max-lines-per-function": "off",
      "max-params": "off",
      "max-statements": "off",
      "new-cap": "off",
      "no-console": "off",
      "no-debugger": "warn",
      "no-duplicate-imports": "off",
      "no-inline-comments": "off",
      "no-lonely-if": "off",
      "no-magic-numbers": "off",
      "no-multi-assign": "off",
      "no-negated-condition": "off",
      "no-nested-ternary": "off",
      "no-plusplus": "off",
      "no-shadow": "off",
      "no-ternary": "off",
      "no-undefined": "off",
      "no-use-before-define": "off",
      "no-void": "off",
      "no-new": "off",
      "no-warning-comments": "off",
      "one-var": "off",
      "prefer-arrow-callback": "off",
      "prefer-destructuring": "off",
      "prefer-named-capture-group": "off",
      "promise/always-return": "off",
      "promise/no-callback-in-promise": "off",
      "promise/no-promise-in-callback": "off",

      "regexp/no-super-linear-move": "off",
      "regexp/prefer-named-capture-group": "off",
      "regexp/require-unicode-sets-regexp": "off",
      "regexp/no-super-linear-backtracking": "off",
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-object-injection": "off",

      "security/detect-unsafe-regex": "off",
      "sort-imports": "off",
      "sort-keys": "off",
    },
  },
  {
    files: ["__tests__/**"],
    plugins: {
      vitest,
    },
    name: "Vitest",
    ...vitest.configs.recommended.rules,
  },
);
