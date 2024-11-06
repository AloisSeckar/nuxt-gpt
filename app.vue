<template>
  <div>
    <h1>nuxt-gpt</h1>
    <div>
    <input v-model="inputData">
    <button
      @click="sendMessage"
      v-text="'Send'"
    />
    <div>{{ data }}</div>
  </div>
  </div>
</template>

<script lang="ts">
const { chat } = useChatgpt('gpt-4o')

const data = ref('')
const inputData = ref('')

async function sendMessage() {
  try {
    const response = await chat(inputData.value)
    data.value = response
  } catch(error) {
    alert(`Join the waiting list if you want to use GPT-4 models: ${error}`)
  }
}
</script>