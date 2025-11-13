import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || messages.length === 0) {
      return new Response("Messages are required", { status: 400 })
    }

    const result = streamText({
      model: xai("grok-3", {
        apiKey: process.env.XAI_API_KEY,
      }),
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      system:
        "You are a helpful and witty AI assistant. Provide helpful, accurate, and engaging responses. Be concise but thorough.",
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("[v0] Error generating response:", error)
    return new Response("Failed to generate response", { status: 500 })
  }
}
