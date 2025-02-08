// https://nuxt.com/docs/api/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-09',
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-chatgpt',
  ],
  colorMode: {
    preference: 'dark',
  },
  chatgpt: {
    apiKey: process.env.NUXT_OPENAI_KEY,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
