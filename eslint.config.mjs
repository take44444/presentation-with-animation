import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import explicitTypes from './eslint/rules/explicit-types.mjs';
import publicDocs from './eslint/rules/public-docs.mjs';
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '**/*.min.js',
    'node_modules/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
    '.agents/**',
    '.codex/**',
    '.specify/**',
  ]),
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      local: {
        rules: { 'explicit-types': explicitTypes, 'public-docs': publicDocs },
      },
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'local/explicit-types': 'error',
      'local/public-docs': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: false,
          allowHigherOrderFunctions: false,
          allowDirectConstAssertionInArrowFunctions: false,
        },
      ],
    },
  },
]);
