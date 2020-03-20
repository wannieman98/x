const esLintRules = {
  // https://eslint.org/docs/rules/
  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-template-curly-in-string': 'error',
  'require-atomic-updates': 'error',
  curly: ['error', 'all'],
  eqeqeq: 'error',
  'no-eval': 'error',
  'require-await': 'error',
  strict: ['error', 'global'],
  'no-restricted-imports': [
    'error',
    {
      paths: ['rxjs', 'rxjs/operators'],
      patterns: ['rxjs/internal/**/*', '**/types/**/*', '**/dist/**/*']
    }
  ],
  indent: 'off',
  'no-empty-function': 'off',
  'no-unused-vars': 'off',
  'no-extra-parens': 'off',
  'no-unused-expressions': 'off',
  'max-len': ['error', { code: 100, ignoreComments: false }]
};

const tsLintRules = {
  // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
  '@typescript-eslint/indent': 'off',
  '@typescript-eslint/explicit-member-accessibility': [
    'error',
    { overrides: { methods: 'no-public', properties: 'explicit' } }
  ],
  '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
  '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  '@typescript-eslint/no-empty-function': ['error', { allow: ['protected-constructors'] }],
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/no-extra-parens': ['error', 'all', { nestedBinaryExpressions: false }],
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
  '@typescript-eslint/no-unused-expressions': ['error'],
  // Type information rules
  '@typescript-eslint/no-unused-vars-experimental': 'error',
  '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
  '@typescript-eslint/prefer-optional-chain': 'error',
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/ban-types': [
    'error',
    {
      types: {
        '{}': {
          message: 'Use object instead',
          fixWith: 'object'
        }
      }
    }
  ]
};

const vuePluginRules = {
  // https://vuejs.github.io/eslint-plugin-vue/rules/
  'vue/attribute-hyphenation': 'off',
  'vue/attributes-order': [
    'error',
    {
      order: [
        'DEFINITION',
        'CONDITIONALS',
        'LIST_RENDERING',
        'UNIQUE',
        'RENDER_MODIFIERS',
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'CONTENT',
        'EVENTS',
        'GLOBAL',
        'OTHER_ATTR'
      ]
    }
  ],
  'vue/no-v-html': 'off',
  'vue/eqeqeq': 'error',
  'vue/v-on-function-call': 'error'
};

const importPluginRules = {
  // https://github.com/benmosher/eslint-plugin-import
  'import/no-self-import': 'error'
};

const jsDocRules = {
  // https://github.com/gajus/eslint-plugin-jsdoc
  'jsdoc/check-alignment': 'error',
  'jsdoc/check-indentation': 'error',
  'jsdoc/check-param-names': 'error',
  'jsdoc/check-tag-names': ['error', { definedTags: ['internal', 'typeParam'] }],
  'jsdoc/implements-on-classes': 'off',
  'jsdoc/newline-after-description': 'error',
  'jsdoc/require-description': 'error',
  'jsdoc/require-description-complete-sentence': 'error',
  'jsdoc/require-hyphen-before-param-description': 'error',
  'jsdoc/require-param': 'error',
  'jsdoc/require-param-description': 'error',
  'jsdoc/require-param-name': 'error',
  'jsdoc/require-param-type': 'off',
  'jsdoc/require-returns': 'error',
  'jsdoc/require-returns-check': 'error',
  'jsdoc/require-returns-description': 'error',
  'jsdoc/require-returns-type': 'off',
  'jsdoc/valid-types': 'off'
};

const jestPluginRules = {
  // https://github.com/jest-community/eslint-plugin-jest
  'jest/expect-expect': ['error', { assertFunctionNames: ['expect*'] }],
  'jest/lowercase-name': ['error', { ignore: ['test'] }],
  'jest/no-duplicate-hooks': 'error',
  'jest/no-expect-resolves': 'error',
  'jest/no-test-return-statement': 'error',
  'jest/prefer-hooks-on-top': 'error',
  'jest/require-top-level-describe': 'error',
  'jest/valid-title': 'error'
};

module.exports = {
  root: true,
  env: { node: true },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json', // required for rules that need type information
    extraFileExtensions: ['.vue']
  },
  plugins: ['jsdoc', 'eslint-plugin-tsdoc'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'plugin:vue/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsdoc/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:cypress/recommended',
    '@vue/prettier',
    '@vue/typescript'
  ],
  rules: {
    'prettier/prettier': 'error',
    'tsdoc/syntax': 'error',
    ...esLintRules,
    ...tsLintRules,
    ...vuePluginRules,
    ...importPluginRules,
    ...jsDocRules,
    ...jestPluginRules
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      },
      rules: {
        'jsdoc/require-jsdoc': 'off'
      }
    },
    {
      files: ['**/*.vue'],
      rules: {
        'jsdoc/empty-tags': 'off'
      }
    }
  ]
};