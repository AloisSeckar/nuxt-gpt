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
      <UAlert
        v-for="answer in data" :key="answer.id"
        variant="soft" :color="answer.color" class="mb-2"
        :title="answer.question" :description="answer.answer"
      />
    </div>
    <div class="mt-2 text-sm">
      <hr class="mb-1">
      &copy; <a href="https://alois-seckar.cz/">Alois Sečkár</a> 2024
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Zeptej se Ej Aj',
})

const { chat } = useChatgpt()

type AlertColor = 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'

type ChatGPTEntry = {
  id: string
  question: string
  answer: string
  color: AlertColor
}

const data = ref([] as ChatGPTEntry[])
const inputData = ref('')

async function sendMessage() {
  try {
    const question = inputData.value
    const answer = await chat(inputData.value) as string
    data.value.unshift({
      id: useId(),
      question,
      answer,
      color: getRandomColor(),
    })
  }
  catch (error) {
    alert(`Join the waiting list if you want to use GPT-4 models: ${error}`)
  }
}

const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'] as const
function getRandomColor(): AlertColor {
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]!
}

onKeyStroke('Enter', (e) => {
  e.preventDefault()
  sendMessage()
})
</script>
