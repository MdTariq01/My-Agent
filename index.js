import 'dotenv/config'
import { connectDB } from './config/db.js'
import { startBot } from './telegram/bot.js'

async function main() {
  console.log('Starting agent...')
  await connectDB()
  startBot()
  console.log('Agent is alive.')
}

main()