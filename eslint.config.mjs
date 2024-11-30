import withNuxt from './.nuxt/eslint.config.mjs'

// config is being passed as an array of separate objects
// as suggested here: https://github.com/nuxt/eslint/discussions/413

export default withNuxt([
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
  },
  {
    rules: {
      'vue/max-attributes-per-line': ['error', {
        singleline: {
          max: 4,
        },
        multiline: {
          max: 3,
        },
      }],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          multiline: 'never',
          selfClosingTag: {
            multiline: 'never',
          },
        },
      ],
      '@stylistic/brace-style': 'off',
    },
  },
])
