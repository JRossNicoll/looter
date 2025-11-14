"use client"

import { useState } from "react"
import { signIn, signInWithGitHub, signInWithSSO } from "../lib/auth"
import Image from "next/image"

export default function LoginPage({ onConnect }) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showSignUp, setShowSignUp] = useState(false)
  const [signUpName, setSignUpName] = useState("")

  const handlePhantomConnect = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const { connectPhantomWallet } = await import("../lib/phantom-wallet")
      const address = await connectPhantomWallet()

      if (address) {
        onConnect(address)
      } else {
        setError("Failed to connect. Please install Phantom wallet.")
      }
    } catch (err) {
      console.error("[v0] Error connecting wallet:", err)
      setError("Connection failed. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleGitHubSignIn = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const result = await signInWithGitHub()
      if (result.success && result.user) {
        onConnect(result.user.email)
      } else {
        setError(result.error || "GitHub sign in failed")
      }
    } catch (err) {
      console.error("[v0] Error with GitHub sign in:", err)
      setError("GitHub sign in failed. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSSOSignIn = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const result = await signInWithSSO()
      if (result.success && result.user) {
        onConnect(result.user.email)
      } else {
        setError(result.error || "SSO sign in failed")
      }
    } catch (err) {
      console.error("[v0] Error with SSO sign in:", err)
      setError("SSO sign in failed. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleEmailSignIn = async (e) => {
    e.preventDefault()
    setIsConnecting(true)
    setError(null)

    try {
      const result = await signIn(email, password)
      if (result.success && result.user) {
        onConnect(result.user.email)
      } else {
        setError(result.error || "Sign in failed")
      }
    } catch (err) {
      console.error("[v0] Error with email sign in:", err)
      setError("Sign in failed. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setIsConnecting(true)
    setError(null)

    try {
      const { signUp } = await import("../lib/auth")
      const result = await signUp(email, password, signUpName)
      if (result.success && result.user) {
        onConnect(result.user.email)
      } else {
        setError(result.error || "Sign up failed")
      }
    } catch (err) {
      console.error("[v0] Error with sign up:", err)
      setError("Sign up failed. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  if (showSignUp) {
    return (
      <div className="relative min-h-screen w-full bg-black flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-[400px]">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.4)]">
              <Image
                src="/images/ghost-logo-3-eyes.png"
                alt="LOOTCHAT Ghost"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg md:text-xl font-bold text-[#9333EA]">LOOTCHAT: Loot the World!</h2>
          </div>

          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-semibold text-white mb-2">Create Your Account</h1>
            <p className="text-xs md:text-sm text-gray-400">Access the LOOTCHAT Platform</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-3 md:space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-white mb-2">
                Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-[#9333EA]/20 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9333EA]/60 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-[#9333EA]/20 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9333EA]/60 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                minLength={6}
                className="w-full px-4 py-2.5 bg-white/5 border border-[#9333EA]/20 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9333EA]/60 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isConnecting}
              className="w-full px-4 py-3 bg-[#9333EA] text-white rounded-lg text-sm font-semibold hover:bg-[#9333EA]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(147,51,234,0.25)]"
            >
              {isConnecting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {error && (
            <div className="mt-4 text-center text-xs md:text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 md:px-4 md:py-2.5">
              {error}
            </div>
          )}

          <p className="text-center text-xs md:text-sm text-gray-400 mt-4 md:mt-6">
            Already have an account?{" "}
            <button
              onClick={() => setShowSignUp(false)}
              className="text-[#9333EA] font-semibold hover:text-[#9333EA]/80 transition-colors"
            >
              Sign In
            </button>
          </p>

          <div className="flex flex-col items-center gap-4 mt-6">
            <div className="flex items-center justify-center gap-3">
              <a
                href="https://x.com/LooterGPT"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-[#9333EA]/40 transition-all group"
                aria-label="Follow us on X"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-[#9333EA] transition-colors"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://t.me/LOOTCHATOFFICIAL"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-[#9333EA]/40 transition-all group"
                aria-label="Join us on Telegram"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-[#9333EA] transition-colors"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.155.232.171.326.016.093.036.306.02.472z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.4)]">
            <Image
              src="/images/ghost-logo-3-eyes.png"
              alt="LOOTCHAT Ghost"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-bold text-[#9333EA]">LOOTCHAT: Loot the World!</h2>
        </div>

        <div className="space-y-2 md:space-y-3 mb-6">
          <button
            onClick={handlePhantomConnect}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#9333EA] hover:bg-[#9333EA]/90 text-white rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(147,51,234,0.3)]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.9 17.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41c2.93 1.18 5 4.05 5 7.41 0 2.08-.8 3.97-2.1 5.39M11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.22.21-1.79L9 15v1a2 2 0 0 0 2 2m1-16A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z" />
            </svg>
            <span>{isConnecting ? "Connecting..." : "Continue with Phantom"}</span>
          </button>

          <button
            onClick={handleGitHubSignIn}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-[#9333EA]/20 hover:bg-white/10 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>

          <button
            onClick={handleSSOSignIn}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-[#9333EA]/20 hover:bg-white/10 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Continue with SSO</span>
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#9333EA]/20"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-black px-2 text-gray-500">OR</span>
          </div>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-3 md:space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 bg-white/5 border border-[#9333EA]/20 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9333EA]/60 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <a href="#" className="text-sm text-[#9333EA] hover:text-[#9333EA]/80 transition-colors font-medium">
                Forgot Password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 bg-white/5 border border-[#9333EA]/20 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9333EA]/60 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isConnecting}
            className="w-full px-4 py-3 bg-[#9333EA] text-white rounded-lg text-sm font-semibold hover:bg-[#9333EA]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(147,51,234,0.25)]"
          >
            {isConnecting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-center text-xs md:text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 md:px-4 md:py-2.5">
            {error}
          </div>
        )}

        <p className="text-center text-xs md:text-sm text-gray-400 mt-4 md:mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => setShowSignUp(true)}
            className="text-[#9333EA] font-semibold hover:text-[#9333EA]/80 transition-colors"
          >
            Sign Up Now
          </button>
        </p>

        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://x.com/LooterGPT"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-[#9333EA]/40 transition-all group"
              aria-label="Follow us on X"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-[#9333EA] transition-colors"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://t.me/LOOTCHATOFFICIAL"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-[#9333EA]/40 transition-all group"
              aria-label="Join us on Telegram"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-[#9333EA] transition-colors"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.155.232.171.326.016.093.036.306.02.472z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
