// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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'
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'ft:gpt-3.5-turbo-0613:personal:ai-poet:88GTGA7b',
    stream: true,
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          "You are a friendly assistant that teaches kids about investing in stocks responsibly"
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
