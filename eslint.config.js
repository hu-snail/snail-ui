// ESLint 9.x flat config. Foundation-stage baseline.
// Per-package overrides (e.g. TS-ESLint, Vue rules) will land in later phases.

import js from '@eslint/js';

export default [
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/*.d.ts',
      '**/*.min.js',
      '**/._*',
      '.changeset/**',
    ],
  },

  // Recommended JS baseline for all JS/TS/MJS/CJS files
  js.configs.recommended,

  // Project-wide language options
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        URL: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      // TypeScript handles unused vars strictly; let TS own this rule
      'no-unused-vars': 'off',
      // Prefer const; allow let when reassignment is needed
      'prefer-const': 'error',
      // Use === over ==
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
  },
];