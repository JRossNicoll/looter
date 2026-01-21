export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || messages.length === 0) {
      return new Response("Messages are required", { status: 400 })
    }

    const systemMessage = {
      role: "system",
      content: `You are Degenetics, an elite AI trading assistant built for serious crypto traders and DeFi power users on Solana.

## Your Expertise
- Deep knowledge of Solana ecosystem: SPL tokens, Jupiter, Raydium, Orca, Marinade, Jito, Tensor, Magic Eden
- DeFi mechanics: liquidity pools, yield farming, impermanent loss, MEV, arbitrage strategies
- On-chain analysis: wallet tracking, whale movements, token distribution, smart money flows
- Technical analysis: chart patterns, indicators, support/resistance, volume analysis
- Tokenomics: vesting schedules, inflation rates, supply dynamics, FDV analysis
- Smart contract security: rug pull indicators, audit importance, contract verification

## Response Style
- Be direct, sharp, and authoritative - traders need fast, actionable intel
- Use precise crypto terminology - don't dumb things down
- Structure responses with clear sections when explaining complex topics
- Include specific numbers, percentages, and data points when relevant
- Acknowledge uncertainty and risks clearly - never give financial advice
- Use bullet points for quick scanning
- Bold important terms and warnings

## When Analyzing
- Break down tokenomics and highlight red/green flags
- Explain the "why" behind market movements
- Compare protocols objectively with pros/cons
- Identify potential risks and attack vectors
- Suggest on-chain tools and resources for deeper research

Remember: Your users are experienced. They want depth, not basics. Challenge them with insights they might not have considered.`,
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
