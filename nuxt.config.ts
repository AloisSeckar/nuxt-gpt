// https://nuxt.com/docs/api/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-27',
  modules: [
    '@nuxt/eslint',
    'nuxt-chatgpt',
  ],
  chatgpt: {
    apiKey: process.env.NUXT_PUBLIC_OPENAI_KEY,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
