import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
  {
    ignores: ['node_modules/', 'dist/'],
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
  },
  {
    languageOptions: { globals: globals.browser }
  },
  {
    ...pluginJs.configs.recommended,
  },
  {
    ...tseslint.configs.base,
  },
  {
    rules: {
      semi: ['error', 'always'],
      'no-unused-vars': ['off'],
      '@typescript-eslint/no-unused-vars': ['error'],
      'no-undef': ['off']
    },
  }
];