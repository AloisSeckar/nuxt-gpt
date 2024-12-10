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
      <UButton color="black" variant="solid" :disabled="thinking" @click="sendMessage">
        Zeptat se
      </UButton>
    </div>
    <div v-if="thinking" class="my-4">
      {{ thinkingText }}
    </div>
    <div class="my-4">
      <UAlert
        v-for="answer in data" :key="answer.id"
        variant="soft" :color="answer.color" class="mb-2"
        :title="answer.question" :description="answer.answer" />
    </div>
    <div class="mt-8 text-sm">
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
  id: number
  question: string
  answer: string
  color: AlertColor
}

const questions = ref(0)
const data = ref([] as ChatGPTEntry[])
const inputData = ref('')

const thinking = ref(false)
const thinkingText = ref('Přemýšlím')

async function sendMessage() {
  // loading indicator
  thinking.value = true
  resume()
  // ChatGPT interaction
  try {
    const question = inputData.value
    if (question) {
      const answer = await chat(inputData.value) as string
      data.value.unshift({
        id: questions.value++,
        question,
        answer,
        color: getRandomColor(),
      })
    } else {
      alert('Nejprve položte otázku')
    }
  } catch (error) {
    console.error(error)
    alert(error)
  }
  // loading indicator
  pause()
  thinking.value = false
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

const { pause, resume } = useIntervalFn(() => {
  if (thinkingText.value.length < 12) {
    thinkingText.value += '.'
  } else {
    thinkingText.value = 'Přemýšlím'
  }
}, 333)
pause()
</script>
