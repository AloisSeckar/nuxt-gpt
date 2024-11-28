// https://nuxt.com/docs/api/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-28',
  modules: [
    '@nuxt/eslint',
    'nuxt-chatgpt',
    '@nuxt/ui',
  ],
  colorMode: {
    preference: 'dark',
  },
  chatgpt: {
    apiKey: process.env.NUXT_PUBLIC_OPENAI_KEY,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
