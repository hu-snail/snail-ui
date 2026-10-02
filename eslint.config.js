// ESLint 9.x flat config. Foundation-stage baseline.
// Phase 1+: typescript-eslint parser enables TS type-only syntax + project-aware rules.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
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

  // Recommended JS for all JS/MJS/CJS files
  js.configs.recommended,

  // Type-aware recommended rules for all TS/TSX
  ...tseslint.configs.recommended,

  // Project-wide language options + rule overrides
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
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'prefer-const': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
  },
);