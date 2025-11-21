import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  // Игнорируемые файлы
  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
      '.env',
      '.env.*',
      'public/',
      '*.log',
      '.DS_Store',
    ],
  },

  // JavaScript файлы
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off',
      'no-debugger': 'warn',
      'prefer-const': 'warn',
      'no-var': 'warn',
      ...prettier.rules,
    },
  },

  // TypeScript файлы
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': await import('@typescript-eslint/eslint-plugin').then(m => m.default),
    },
    languageOptions: {
      parser: await import('@typescript-eslint/parser').then(m => m.default),
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'no-debugger': 'warn',
      ...prettier.rules,
    },
  },

  // Vue файлы
  {
    files: ['**/*.vue'],
    plugins: {
      vue,
    },
    languageOptions: {
      parser: await import('vue-eslint-parser').then(m => m.default),
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...vue.configs['base'].rules,
      ...vue.configs['recommended'].rules,
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      'vue/require-default-prop': 'off',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/comment-directive': 'off',
      'no-console': 'off',
      'no-debugger': 'warn',
      ...prettier.rules,
    },
  },
];
