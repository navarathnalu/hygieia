module.exports = {
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  extends: 'eslint:recommended',
  rules: {
    semi: ['error', 'always'],
    indent: ['error', 2],
    'space-before-blocks': ['error',
      {
        'functions': 'always',
        'keywords': 'always',
        'classes': 'always'
      }
    ]
  },
  overrides: []
};