import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      parser: tsparser,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },

    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },

    rules: {
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "warn",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "prettier/prettier": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
];
