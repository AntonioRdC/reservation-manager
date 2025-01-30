import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import ts from '@typescript-eslint/parser';

export default {
  files: ['**/*.{js,mjs,cjs,ts,tsx}'],
  languageOptions: {
    globals: globals.browser,
    parser: ts,
  },
  plugins: {
    '@eslint/js': pluginJs,
    'typescript-eslint': tseslint,
    '@next/eslint-plugin-next': nextPlugin,
  },
};
