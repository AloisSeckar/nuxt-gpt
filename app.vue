<template>
  <div class="w-full sm:w-5/6 sm:mx-auto py-4 text-center text-slate-200">
    <h1 class="text-3xl font-bold">
      Zeptej se Ej Aj
    </h1>
    <div class="my-4 px-2">
      Pomocí vstupu níže můžete zadarmo klást otázky placené verzi <strong>ChatGPT</strong>.<br class="hidden sm:block">
      Historie otázek se bude postupně zobrazovat, ale pozor - neukládá se!<br class="hidden sm:block">
      Jakmile ze stránky odejdete, po návratu zpět musíte začít znovu.
    </div>
    <div class="flex flex-col sm:flex-row gap-2 px-2 items-center justify-center">
      <strong>Otázka:</strong>
      <UInput v-model="inputData" class="w-full sm:w-96" />
      <UButton color="black" variant="solid" :disabled="thinking" @click="sendMessage">
        Zeptat se
      </UButton>
    </div>
    <div v-if="thinking" class="my-4">
      {{ thinkingText }}
    </div>
    <div class="flex flex-col mx-4 my-4">
      <UAlert
        v-for="answer in data" :key="answer.id"
        variant="soft" :color="answer.color"
        class="mb-4 mx-2 lg:w-4/5" :class="answer.id % 2 == 0 ? 'lg:self-start' : 'lg:self-end'">
        <template #title>
          <div class="text-left text-lg">
            {{ answer.question }}
          </div>
        </template>
        <template #description>
          <!-- eslint-disable vue/no-v-html -->
          <div class="text-justify text-base" v-html="answer.answer" />
        </template>
      </UAlert>
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
        answer: preFormat(answer),
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

function preFormat(input: string): string {
  // escape html tags
  input = input.replaceAll('<', '&lt;')
  input = input.replaceAll('>', '&gt;')
  // format markdown code blocks
  while (input.includes('```')) {
    input = input.replace('```', '<div class="my-2 p-1.5 bg-slate-200 opacity-75 text-black rounded"><pre>')
    input = input.replace('```', '</pre></div>')
  }
  // format markdown inline code
  while (input.includes('`')) {
    input = input.replace('`', '<pre class="inline-block p-0.5 bg-slate-200 opacity-75 text-black font-bold">')
    input = input.replace('`', '</pre>')
  }
  // format links
  input = input.replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" class="hover:text-slate-300">$1</a>`)
  // format bold font
  input = input.replaceAll(/\*\*([^*]+)\*\*/g, `<strong>$1</strong>`)
  // format newlines -> br
  input = input.replaceAll('\n', `<br>`)
  //
  return input
}
</script>
