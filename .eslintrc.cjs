/** @type {import('eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  env: {
    jest: true,
  },
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    '@remix-run/eslint-config/jest-testing-library',
    'prettier',
  ],
  globals: {
    shopify: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['eslint-plugin-import', 'prettier'], // Include 'react' plugin
  rules: {
    'no-nested-ternary': 'off',
    'import/prefer-default-export': 'off',
    'prettier/prettier': 'error', // Enforce Prettier rules
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off', // Ensure React is in scope for JSX
    'react/jsx-uses-react': 'error', // Disable the old jsx-uses-react rule (for React 17+)
    'react/jsx-uses-vars': 'error', // Ensure variables used in JSX are declared
    'hydrogen/prefer-image-component': 'off',
    'no-useless-escape': 'off',
    'no-unused-vars': 'warn',
    'no-case-declarations': 'off',
    'jsx-a11y/click-events-have-key-events': 'off', // disabling it may effect accessbility score
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        labelComponents: ['CustomInputLabel'],
        labelAttributes: ['label'],
        controlComponents: ['CustomInput'],
        depth: 3,
      },
    ],
    // Add other project-specific rules here
    'no-console': 'off',
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-return-assign': 0,
    camelcase: 0,
    // TODO: Remove jest plugin from hydrogen/eslint-plugin
    'jest/no-deprecated-functions': 'off',
    'import/order': [
      'error',
      {
        /**
         * @description
         *
         * This keeps imports separate from one another, ensuring that imports are separated
         * by their relative groups. As you move through the groups, imports become closer
         * to the current file.
         *
         * @example
         * ```
         * import fs from 'fs';
         *
         * import package from 'npm-package';
         *
         * import xyz from '~/project-file';
         *
         * import index from '../';
         *
         * import sibling from './foo';
         * ```
         */
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        'newlines-between': 'always',
      },
    ],
  },
};
