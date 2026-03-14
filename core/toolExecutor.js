import { getCurrentTime } from '../tools/systemTools.js'
import { getEmails } from '../tools/emailTools.js'

export async function executeTool(toolName, toolArgs, userId) {
  console.log(`Executing tool: ${toolName}`, toolArgs)

  switch (toolName) {
    case 'get_current_time':
      return getCurrentTime()

    case 'get_emails':
      return await getEmails(userId, toolArgs.count || 5)

    default:
      return { error: `Unknown tool: ${toolName}` }
  }
}