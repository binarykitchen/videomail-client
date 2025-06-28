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
import deMorgan from "eslint-plugin-de-morgan";
import packageJson from "eslint-plugin-package-json";
// import storybook from "eslint-plugin-storybook";

// Good reference: https://github.com/dustinspecker/awesome-eslint#readme

/*
  For the record, it's tricky to configure this perfectly.
  There are plenty of eslint plugins and each maintainer documents it differently.

  The npm eslint:inspect command is very helpful here which uses the @eslint/config-inspector

  If there are performance issues, always can fine-tune with files: {*.*} to narrow it down.
  But most of the time it's fine not to define fine and trust their defaults/recommendations.

  TODO Refine further
*/
export default tseslint.config(
  {
    // node_modules and .git already covered in eslint.configs.all
    name: "ignore some more files",
    ignores: [
      ".github",
      ".vscode",
      "dist",
      ".storybook/public",
      "storybook-static",
      "!.storybook",
    ],
  },
  {
    name: "global eslint rules for all source files",
    ...eslint.configs.all,
  },
  {
    name: "local language options",
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {
        // TODO Node? This is questionable, as it applies for ./etc only, whereas src is browser only
        ...globals.node,
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
    ...vitest.configs.recommended,
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/prefer-expect-assertions": "off",
      "vitest/max-expects": "off",
      "vitest/prefer-lowercase-title": "off",
      "vitest/prefer-describe-function-title": "off",
      "vitest/no-hooks": ["error", { allow: ["beforeAll", "afterAll"] }],
    },
  },
  {
    ...packageJson.configs.recommended,
  },
  pluginSecurity.configs.recommended,
  pluginPromise.configs["flat/recommended"],
  {
    name: "deMorgan",
    ...deMorgan.configs.recommended,
  },
  // TODO Continue from here, split further
  {
    name: "All JS and TS files",
    files: ["**/*.{js,mjs,cjs,ts}"],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      eslintPluginImportX.flatConfigs.recommended,
      eslintPluginImportX.flatConfigs.typescript,
      regexpPlugin.configs["flat/all"],
      depend.configs["flat/recommended"],
    ],
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
);
