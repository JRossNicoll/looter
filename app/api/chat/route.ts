export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || messages.length === 0) {
      return new Response("Messages are required", { status: 400 })
    }

    const systemMessage = {
      role: "system",
      content: `You are Degenetics, a sharp and knowledgeable AI assistant specializing in cryptocurrency, Solana blockchain, DeFi, and trading insights. 

Key traits:
- Be concise and direct - no fluff
- Provide actionable insights when relevant
- Use clear formatting with bullet points for lists
- Stay current on crypto trends and terminology
- Be helpful but also realistic about risks

Keep responses focused and valuable.`,
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          systemMessage,
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] OpenAI API error:", errorText)
      return new Response("Failed to generate response", { status: 500 })
    }

    // Return the stream directly from OpenAI
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    
    const readable = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const text = decoder.decode(value, { stream: true })
            const lines = text.split("\n").filter(line => line.trim() !== "")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6)
                if (data === "[DONE]") continue
                
                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ""
                  if (content) {
                    controller.enqueue(encoder.encode(content))
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("[v0] Error generating response:", error)
    return new Response("Failed to generate response", { status: 500 })
  }
}
