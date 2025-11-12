import OpenAI from 'openai'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type ChatBody = {
  messages: ChatMessage[]
  model?: string
  temperature?: number
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event)
    if (!config.apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing OPENAI_API_KEY',
      })
    }

    const body = await readBody<ChatBody>(event)
    if (!body?.messages?.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Request body must include `messages: ChatMessage[]`',
      })
    }

    const openai = new OpenAI({ apiKey: config.apiKey })

    const completion = await openai.chat.completions.create({
      model: body.model ?? 'gpt-4o',
      messages: body.messages,
    })

    const text = completion.choices[0]?.message?.content ?? ''
    setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    return text
  } catch (error) {
    console.log(error)
    // Normalize errors to a readable string response (still text/plain).
    const err = error as { status?: number, statusCode?: number, statusMessage?: string, message?: string }
    const status = Number(err?.status || err?.statusCode || 500)
    const message
      = err?.statusMessage
        || err?.message
        || 'Unexpected error while calling OpenAI'

    setResponseStatus(event, status)
    setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    return `Error (${status}): ${message}`
  }
})
