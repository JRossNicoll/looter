"use client"

import { useState, useEffect } from "react"
import {
  connectPhantomWallet,
  disconnectPhantomWallet,
  getPhantomProvider,
  getConnectedWallet,
} from "../lib/phantom-wallet"
import Image from "next/image"

export default function WalletConnect({ onWalletChange }) {
  const [walletAddress, setWalletAddress] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Check if wallet is already connected
    const connected = getConnectedWallet()
    if (connected) {
      setWalletAddress(connected)
      onWalletChange?.(connected)
    }

    // Listen for wallet changes
    const provider = getPhantomProvider()
    if (provider) {
      const handleAccountChanged = (publicKey) => {
        if (publicKey) {
          const address = publicKey.toString()
          setWalletAddress(address)
          onWalletChange?.(address)
        } else {
          setWalletAddress(null)
          onWalletChange?.(null)
        }
      }

      provider.on("accountChanged", handleAccountChanged)

      return () => {
        provider.removeListener("accountChanged", handleAccountChanged)
      }
    }
  }, [onWalletChange])

  const handleConnect = async () => {
    setIsConnecting(true)
    const address = await connectPhantomWallet()
    if (address) {
      setWalletAddress(address)
      onWalletChange?.(address)
    }
    setIsConnecting(false)
  }

  const handleDisconnect = async () => {
    await disconnectPhantomWallet()
    setWalletAddress(null)
    onWalletChange?.(null)
  }

  const formatAddress = (address) => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (walletAddress) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-accent/50 p-2 min-h-[44px]">
        <div className="flex h-6 w-6 items-center justify-center">
          <Image
            src="/images/degenchat-logo.png"
            alt="Wallet"
            width={24}
            height={24}
            className="h-6 w-6 rounded-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs sm:text-sm font-medium text-foreground">{formatAddress(walletAddress)}</div>
          <button
            onClick={handleDisconnect}
            className="truncate text-[10px] sm:text-xs text-muted-foreground transition-colors hover:text-foreground touch-manipulation min-h-[24px]"
          >
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-accent/50 px-4 py-3 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 min-h-[48px] touch-manipulation active:scale-98"
    >
      {isConnecting ? "Connecting..." : "Connect Phantom Wallet"}
    </button>
  )
}
