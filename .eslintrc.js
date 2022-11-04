module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:vue/vue3-essential', 'airbnb-base'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    semi: ['error', 'never'],
    'import/no-extraneous-dependencies': ['off'],
    'implicit-arrow-linebreak': ['off'],
    'comma-dangle': ['off'],
  },
}
