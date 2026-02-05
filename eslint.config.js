// @ts-check

import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintDeMorgan from "eslint-plugin-de-morgan";
import eslintDepend from "eslint-plugin-depend";
import eslintImportX from "eslint-plugin-import-x";
import markdownlintPlugin from "eslint-plugin-markdownlint";
import markdownlintParser from "eslint-plugin-markdownlint/parser.js";
import eslintPackageJson from "eslint-plugin-package-json";
import pluginPromise from "eslint-plugin-promise";
import eslintRegexpPlugin from "eslint-plugin-regexp";
import eslintSecurity from "eslint-plugin-security";
import eslintSimpleImportSort from "eslint-plugin-simple-import-sort";
// import eslintStorybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

// Good reference:
// https://github.com/dustinspecker/awesome-eslint#readme

const CLIENT_ONLY_FILES = "./src/**/*.{js,ts}";
const TEST_ONLY_FILES = "./src/**/__tests__/**";
const STORYBOOK_FILES = "./.storybook/**/*.{js,ts}";

const ALL_FILES = [
  CLIENT_ONLY_FILES,
  STORYBOOK_FILES,
  // Root level files
  "./*.{js,ts}",
  // Scripts
  "./etc/**/*.{js,ts}",
];

/*
  For the record, it's tricky to configure this perfectly.
  There are plenty of eslint plugins and each maintainer documents it differently.

  The npm run lint:inspect command is very helpful here which uses the @eslint/config-inspector

  If there are performance issues, always can fine-tune with files: {*.*} to narrow it down.
  But most of the time it's fine not to define fine and trust their defaults/recommendations.
*/
export default defineConfig([
  globalIgnores(["dist", "storybook-static", ".storybook/public/mockServiceWorker.js"]),
  eslintDeMorgan.configs.recommended,
  eslintPackageJson.configs.recommended,
  eslintSecurity.configs.recommended,
  eslintRegexpPlugin.configs["flat/recommended"],
  eslintImportX.flatConfigs.recommended,
  // ...eslintStorybook.configs["flat/recommended"],
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
        project: ["./tsconfig.json"],
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
  // Can't give it a name because of plugins/extends.
  // Perhaps can improve it in the next updates or in ESLint v10 ...
  {
    files: ALL_FILES,
    plugins: {
      "import-x": eslintImportX,
    },
    extends: [
      eslintImportX.flatConfigs.recommended,
      eslintImportX.flatConfigs.typescript,
    ],
    rules: {
      ...eslintImportX.flatConfigs.recommended.rules,
      "import-x/no-named-as-default-member": "off",
    },
  },
  {
    name: "depend",
    plugins: {
      depend: eslintDepend,
    },
    extends: ["depend/flat/recommended"],
  },
  {
    files: ["**/*md"],
    plugins: {
      markdownlint: markdownlintPlugin,
    },
    languageOptions: {
      parser: markdownlintParser,
    },
    rules: {
      ...markdownlintPlugin.configs.recommended.rules,
      "markdownlint/md013": "off",
      "markdownlint/md033": "off",
      "markdownlint/md041": "off",
    },
  },
  {
    ...eslintSecurity.configs.recommended,
    files: ALL_FILES,
    rules: {
      ...eslintSecurity.configs.recommended.rules,
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
    name: "sort imports and exports",
    plugins: {
      "simple-import-sort": eslintSimpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    files: [TEST_ONLY_FILES],
    ...vitest.configs.recommended,
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/prefer-expect-assertions": "off",
      "vitest/max-expects": "off",
      "vitest/prefer-lowercase-title": "off",
      "vitest/prefer-describe-function-title": "off",
      // Allow hooks inside test files
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
]);
