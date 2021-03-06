module.exports =  {
    parser:  '@typescript-eslint/parser',
    extends:  [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    parserOptions:  {
        ecmaVersion:  2018,
        sourceType:  'module',
        ecmaFeatures:  {
            jsx:  true,
        },
    },
    rules:  {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
    settings:  {
        react:  {
            version:  'detect',
        },
    },
};