import globals from 'globals';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';
import jsdoc from "eslint-plugin-jsdoc";
import jest from 'eslint-plugin-jest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [...compat.extends('google'), {
  plugins: {
    jsdoc: jsdoc,
    jest: jest,
  },

  languageOptions: {
    globals: {
      ...globals.browser,
      ...jest.environments.globals.globals,
    },

    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  rules: {
    indent: ['error', 2],
    "jsdoc/require-description": "error",
    "jsdoc/check-values": "error"
  },
}];
