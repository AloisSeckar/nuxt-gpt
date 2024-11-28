<template>
  <div class="w-full sm:w-4/5 m-4 sm:mx-auto text-center text-slate-200">
    <h1 class="text-3xl font-bold">
      Zeptej se Ej Aj
    </h1>
    <div class="my-4">
      Pomocí vstupního pole níže můžete zadarmo klást otázky placené verzi ChatGPT.<br>
      Historie konverzace se bude postupně zobrazovat, ale pozor - neukládá se!<br>
      Jakmile ze stránky odejdete, po návratu zpět musíte začít znovu.
    </div>
    <div class="flex flex-row gap-2 items-center justify-center">
      Otázka:
      <UInput v-model="inputData" class="w-96" />
      <UButton color="black" variant="solid" @click="sendMessage">
        Zeptat se
      </UButton>
    </div>
    <div class="my-4">
      <UTextarea v-model="data" autoresize color="gray" variant="outline" />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Zeptej se Ej Aj',
})

const { chat } = useChatgpt()

const rows = ref(2)
const data = ref('Ptejte se!')
const inputData = ref('')

async function sendMessage() {
  try {
    rows.value = rows.value + 2
    const input = inputData.value
    data.value = data.value + '\n' + input
    const response = await chat(inputData.value)
    data.value = data.value + '\n' + response
  }
  catch (error) {
    alert(`Join the waiting list if you want to use GPT-4 models: ${error}`)
  }
}
</script>
