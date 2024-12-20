import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import tsSortKeys from 'eslint-plugin-typescript-sort-keys';

const prettier = {
    ...eslintConfigPrettier,
    plugins: {
        eslintPluginPrettier,
    },
    rules: {
        ...eslintConfigPrettier.rules,
        'arrow-body-style': 'off',
    },
};
// noinspection JSUnusedGlobalSymbols
export default tsEslint.config(
    ...(Array.isArray(eslint.configs.recommended)?eslint.configs.recommended:[eslint.configs.recommended]),
    ...tsEslint.configs.recommended,
    prettier,
    {
        rules: {
            'linebreak-style': ['error', 'unix'],
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'object-curly-spacing': ['error', 'always'],
            'max-depth': ['error', 4],
            'prefer-template': ['error'],
            'sort-vars': ['error'],
            'sort-keys': ['error', 'asc'],
            'prefer-arrow-callback': ['error', { 'allowUnboundThis': false }],
        },
    },
    {
        plugins: {
            tsSortKeys,
        },
        rules: {
            'tsSortKeys/interface': ['error', 'asc', {
                requiredFirst: true,
            }],
            'tsSortKeys/string-enum': ['error'],
        },
    },
);