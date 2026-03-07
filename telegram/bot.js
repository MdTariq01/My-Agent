import TelegramBot from 'node-telegram-bot-api'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { toolDefinitions } from '../config/tools.js'
import { executeTool } from '../core/toolExecutor.js'
import { handleStart } from './registration.js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({
model: 'gemini-2.5-flash',
  systemInstruction: `You are a personal AI assistant.
  You are helpful, concise and proactive.
  You act on behalf of the user autonomously.
  When you need information, use the tools available to you.`,
  tools: [{ functionDeclarations: toolDefinitions }]
})

let bot
const conversations = {}

async function chat(chatId, userMessage) {

  if (!conversations[chatId]) {
    conversations[chatId] = model.startChat({ history: [] })
  }

  const chatSession = conversations[chatId]

  // send user message
  let result = await chatSession.sendMessage(userMessage)

  // tool calling loop
  while (true) {
    const candidate = result.response.candidates[0]
    const parts = candidate.content.parts

    // check if Gemini wants to call a tool
    const toolCallPart = parts.find(p => p.functionCall)

    if (!toolCallPart) {
      // no tool call — return the text reply
      return result.response.text()
    }

    // Gemini wants to call a tool
    const toolName = toolCallPart.functionCall.name
    const toolArgs = toolCallPart.functionCall.args

    console.log(`Gemini calling tool: ${toolName}`)

    // execute the tool
    const toolResult = await executeTool(toolName, toolArgs)

    console.log(`Tool result:`, toolResult)

    // send tool result back to Gemini
    result = await chatSession.sendMessage([
      {
        functionResponse: {
          name: toolName,
          response: toolResult
        }
      }
    ])

    // loop again — Gemini will now process the result
  }
}

export function startBot() {
  const token = process.env.TELEGRAM_TOKEN
  if (!token) throw new Error('TELEGRAM_TOKEN is missing!')

  bot = new TelegramBot(token, { polling: true })

  // handle /start command
  bot.onText(/\/start/, async (msg) => {
    await handleStart(bot, msg)
  })

  bot.on('message', async (msg) => {
    if (!msg.text) return
    if (msg.text.startsWith('/')) return
    const chatId = msg.chat.id
    const text = msg.text

    console.log(`Message from ${chatId}: ${text}`)

    bot.sendChatAction(chatId, 'typing')

    try {
      const reply = await chat(chatId, text)
      await bot.sendMessage(chatId, reply)
    } catch (error) {
      console.error('Error:', error)
      await bot.sendMessage(chatId, 'Something went wrong.')
    }
  })

  bot.on('polling_error', (error) => {
    console.error('Telegram error:', error.code)
  })

  console.log('Telegram bot started')
}

export function getBot() {
  return bot
}