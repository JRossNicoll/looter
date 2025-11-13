// Phantom Wallet integration utilities
export interface PhantomProvider {
  isPhantom?: boolean
  connect: () => Promise<{ publicKey: { toString: () => string } }>
  disconnect: () => Promise<void>
  on: (event: string, callback: (args: any) => void) => void
  removeListener: (event: string, callback: (args: any) => void) => void
  publicKey?: { toString: () => string }
}

export const getPhantomProvider = (): PhantomProvider | null => {
  if (typeof window === "undefined") return null

  const provider = (window as any).phantom?.solana

  if (provider?.isPhantom) {
    return provider
  }

  return null
}

export const connectPhantomWallet = async (): Promise<string | null> => {
  const provider = getPhantomProvider()

  if (!provider) {
    window.open("https://phantom.app/", "_blank")
    return null
  }

  try {
    const response = await provider.connect()
    const publicKey = response.publicKey.toString()
    return publicKey
  } catch (error) {
    console.error("[v0] Error connecting to Phantom:", error)
    return null
  }
}

export const disconnectPhantomWallet = async (): Promise<void> => {
  const provider = getPhantomProvider()

  if (provider) {
    try {
      await provider.disconnect()
    } catch (error) {
      console.error("[v0] Error disconnecting from Phantom:", error)
    }
  }
}

export const getConnectedWallet = (): string | null => {
  const provider = getPhantomProvider()

  if (provider?.publicKey) {
    return provider.publicKey.toString()
  }

  return null
}
