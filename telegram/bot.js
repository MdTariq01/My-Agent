import TelegramBot from 'node-telegram-bot-api';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Initialize with safety checks
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY is missing!");

const genAI = new GoogleGenerativeAI(apiKey);

// 2. Use the correct model ID (e.g., 'gemini-1.5-pro')
const model = genAI.getGenerativeModel({
model: 'gemini-flash-latest',
  systemInstruction: `You are a personal AI assistant. 
  You are helpful, concise and proactive.
  You act on behalf of the user autonomously.`
});

let bot;
const conversations = {};

async function chat(chatId, userMessage) {
  // If no conversation exists for this user, start a new chat session
  if (!conversations[chatId]) {
    conversations[chatId] = model.startChat({
      history: [],
      // Optional: Add safety settings here
    });
  }

  const chatSession = conversations[chatId];
  const result = await chatSession.sendMessage(userMessage);
  
  // result.response.text() is an async call in some versions/scenarios
  return result.response.text();
}

export function startBot() {
  const token = process.env.TELEGRAM_TOKEN;
  if (!token) throw new Error("TELEGRAM_TOKEN is missing!");

  bot = new TelegramBot(token, { polling: true });

  bot.on('message', async (msg) => {
    // Ignore messages that aren't text (like stickers or photos)
    if (!msg.text) return;

    const chatId = msg.chat.id;
    const text = msg.text;

    console.log(`Message from ${chatId}: ${text}`);

    // Show "typing..." in Telegram
    bot.sendChatAction(chatId, 'typing');

    try {
      const reply = await chat(chatId, text);
      await bot.sendMessage(chatId, reply);
    } catch (error) {
      console.error('Gemini Error:', error);
      // Helpful for debugging: check if it's a safety block or rate limit
      await bot.sendMessage(chatId, 'Sorry, I encountered an error processing that.');
    }
  });

  bot.on('polling_error', (error) => {
    console.error('Telegram Polling Error:', error.code); 
  });

  console.log('Telegram bot started successfully');
}

export function getBot() {
  return bot;
}