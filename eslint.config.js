// eslint.config.js

// Js configs
import js from '@eslint/js';

// Eslint plugins
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

// globals and typescript
import globals from 'globals';
import typescript from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    // Base configs
    js.configs.recommended,
    ...typescript.configs.recommended,

    // React config
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ...react.configs.flat.recommended,
        ...react.configs.flat['jsx-runtime'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        rules: {
            // React specific rules
            'react/react-in-jsx-scope': 'off', // Not needed with React 17+
            'react/prop-types': 'off', // Using TypeScript for prop validation
            'react/no-unescaped-entities': 'warn', // Warn instead of off
            'react/jsx-no-target-blank': 'error', // Security: no target="_blank" without rel="noreferrer"
            'react/jsx-key': 'error', // Required key prop in list items
            'react/jsx-no-duplicate-props': 'error',
            'react/self-closing-comp': 'warn', // Self-close components when possible
            'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }], // Consistent braces usage
            'react/display-name': 'off', // Not necessary with React.lazy or dynamic imports
        },
        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                typescript: true,
                node: true,
            },
        },
    },

    // React Hooks plugin
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },

    // Import rules
    {
        plugins: {
            import: importPlugin,
        },
        rules: {
            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'import/no-duplicates': 'error',
            'import/no-unresolved': 'error',
            'import/no-cycle': 'warn',
        },
    },

    // TypeScript specific rules
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn', // Avoid using 'any'
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
            '@typescript-eslint/consistent-type-definitions': ['warn', 'type'], // Prefer 'type' over 'interface'
            '@typescript-eslint/no-non-null-assertion': 'warn', // Avoid ! assertions
            '@typescript-eslint/explicit-function-return-type': 'off', // Let TypeScript infer
            '@typescript-eslint/strict-boolean-expressions': 'warn',
            '@typescript-eslint/prefer-nullish-coalescing': 'warn',
            '@typescript-eslint/prefer-optional-chain': 'warn',
        },
    },

    // General rules
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        rules: {
            // Best practices
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'error',
            'no-alert': 'warn',
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'no-var': 'error',
            'prefer-const': 'error',
            'prefer-template': 'warn',
            'object-shorthand': 'warn',

            // Error prevention
            'no-unused-expressions': 'error',
            'no-return-await': 'error',
            'require-await': 'warn',

            // Code style (non-formatting)
            camelcase: ['warn', { properties: 'never', ignoreDestructuring: true }],
        },
    },

    // Ignore patterns
    {
        ignores: [
            'vendor',
            'node_modules',
            'public',
            'bootstrap/ssr',
            'tailwind.config.js',
            'dist',
            'build',
            '*.config.js',
            '.eslintrc.*',
            'coverage',
            '*.min.js',
        ],
    },

    // Prettier must be last to override other formatting rules
    prettier,
];
