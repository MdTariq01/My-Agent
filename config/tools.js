export const toolDefinitions = [
  {
    name: "get_current_time",
    description: "Get the current date, time and day.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_emails",
    description: "Read emails from the user's Gmail inbox. Use this when user asks to check emails, see inbox, or read messages.",
    parameters: {
      type: "object",
      properties: {
        count: {
          type: "number",
          description: "Number of emails to fetch. Default is 5."
        }
      },
      required: []
    }
  }
]