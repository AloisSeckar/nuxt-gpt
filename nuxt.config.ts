// https://nuxt.com/docs/api/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
  ],
  colorMode: {
    preference: 'dark',
  },
  runtimeConfig: {
    apiKey: process.env.NUXT_OPENAI_KEY,
  },
  compatibilityDate: '2025-11-11',
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
