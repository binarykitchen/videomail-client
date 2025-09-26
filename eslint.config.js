// @ts-check

import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import deMorgan from "eslint-plugin-de-morgan";
import * as depend from "eslint-plugin-depend";
import eslintPluginImportX from "eslint-plugin-import-x";
import packageJson from "eslint-plugin-package-json";
import pluginPromise from "eslint-plugin-promise";
import * as regexpPlugin from "eslint-plugin-regexp";
import pluginSecurity from "eslint-plugin-security";
import simpleImportSort from "eslint-plugin-simple-import-sort";
// import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

// Good reference: https://github.com/dustinspecker/awesome-eslint#readme

// Source and test files
const CLIENT_ONLY_FILES = "src/**/*.{js,ts}";
const STORYBOOK_FILES = ".storybook/**/*.{js,ts}";

const ALL_FILES = [
  CLIENT_ONLY_FILES,
  STORYBOOK_FILES,
  // Root level files
  "*.{js,ts}",
  // Scripts
  "etc/**/*.{js,ts}",
];

/*
  For the record, it's tricky to configure this perfectly.
  There are plenty of eslint plugins and each maintainer documents it differently.

  The npm run lint:inspect command is very helpful here which uses the @eslint/config-inspector

  If there are performance issues, always can fine-tune with files: {*.*} to narrow it down.
  But most of the time it's fine not to define fine and trust their defaults/recommendations.
*/
export default tseslint.config(
  {
    // Node_modules and .git already covered in eslint.configs.all below
    name: "ignore some more files",
    ignores: ["dist", ".storybook/public", "storybook-static", "!.storybook"],
  },
  {
    name: "global eslint rules for all source files",
    ...js.configs.all,
    files: ALL_FILES,
    rules: {
      ...js.configs.all.rules,
      camelcase: "off",
      "capitalized-comments": "off",
      "class-methods-use-this": "off",
      complexity: "off",
      "consistent-return": "off",
      "default-param-last": "off",
      "func-names": "off",
      "func-style": "off",
      "id-length": "off",
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

      // These two are great, but can't be autofixed unfortunately,
      // hence adding eslint-plugin-simple-import-sort, see further below.
      "sort-imports": "off",
      "sort-keys": "off",
    },
  },
  {
    name: "general language options",
    files: ALL_FILES,
    languageOptions: {
      // Ensure the version also supports back to 5 years ago.
      // This for older devices and whoever doesn't update :)
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    name: "client-only language options",
    files: [CLIENT_ONLY_FILES],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    ...packageJson.configs.recommended,
  },
  // Can't give it a name because of plugins/extends.
  // Perhaps can improve it in the next updates or in ESLint v10 ...
  {
    files: ALL_FILES,
    plugins: {
      "import-x": eslintPluginImportX,
    },
    extends: [
      eslintPluginImportX.flatConfigs.recommended,
      eslintPluginImportX.flatConfigs.typescript,
    ],
    rules: {
      ...eslintPluginImportX.flatConfigs.recommended.rules,
      "import-x/no-named-as-default-member": "off",
    },
  },
  {
    name: "depend",
    ...depend.configs["flat/recommended"],
    files: ALL_FILES,
  },
  {
    ...pluginSecurity.configs.recommended,
    files: ALL_FILES,
    rules: {
      ...pluginSecurity.configs.recommended.rules,
      "security/detect-object-injection": "off",
    },
  },
  {
    ...pluginPromise.configs["flat/recommended"],
    files: ALL_FILES,
    rules: {
      ...pluginPromise.configs["flat/recommended"].rules,
      "promise/always-return": "off",
    },
  },
  {
    name: "deMorgan",
    files: ALL_FILES,
    ...deMorgan.configs.recommended,
  },
  {
    name: "regexp",
    ...regexpPlugin.configs["flat/all"],
    files: ALL_FILES,
    rules: {
      ...regexpPlugin.configs["flat/all"].rules,
      "regexp/require-unicode-sets-regexp": "off",
    },
  },
  {
    name: "sort imports and exports",
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    ...vitest.configs.recommended,
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/prefer-expect-assertions": "off",
      "vitest/max-expects": "off",
      "vitest/prefer-lowercase-title": "off",
      "vitest/prefer-describe-function-title": "off",
      "vitest/no-hooks": [
        "error",
        { allow: ["beforeAll", "afterAll", "beforeEach", "afterEach"] },
      ],
    },
  },
  {
    name: "Source code files with TypeScript",
    files: ALL_FILES,
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
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
      "@typescript-eslint/prefer-nullish-coalescing": "off",

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
    },
  },
);
