import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
    { files: ['**/*.{ts,tsx}'] },
    { ignores: ['**/dist/**', '**/generated/**'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    { settings: { react: { version: '19.2.4' } } },
    {
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
            'react/no-unescaped-entities': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
        },
    },
];
