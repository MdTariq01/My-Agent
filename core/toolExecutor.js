import { getCurrentTime } from '../tools/systemTools.js'

export async function executeTool(toolName, toolArgs) {
  console.log(`Executing tool: ${toolName}`, toolArgs)

  switch (toolName) {
    case 'get_current_time':
      return getCurrentTime()

    default:
      return { error: `Unknown tool: ${toolName}` }
  }
}