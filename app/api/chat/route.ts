import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json()

    if (!messages || messages.length === 0) {
      return new Response("Messages are required", { status: 400 })
    }

    const prompt = convertToModelMessages(messages)

    const result = streamText({
      model: "xai/grok-3",
      system: "You are Degenetics, a helpful and knowledgeable AI assistant specializing in cryptocurrency, Solana blockchain, and trading insights. Provide helpful, accurate, and engaging responses. Be concise but thorough.",
      prompt,
      abortSignal: req.signal,
    })

    return result.toUIMessageStreamResponse({
      consumeSseStream: consumeStream,
    })
  } catch (error) {
    console.error("[v0] Error generating response:", error)
    return new Response("Failed to generate response", { status: 500 })
  }
}
