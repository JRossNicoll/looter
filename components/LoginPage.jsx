"use client"

import { useState } from "react"
import { signIn, signInWithGitHub } from "../lib/auth"
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
        setError("Please install Phantom wallet")
      }
    } catch (err) {
      setError("Connection failed")
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
      setError("GitHub sign in failed")
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
      setError("Sign in failed")
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
      setError("Sign up failed")
    } finally {
      setIsConnecting(false)
    }
  }

  // Premium animated border card
  const AnimatedCard = ({ children }) => (
    <div className="relative group">
      {/* Animated gradient border - smooth rotation */}
      <div 
        className="absolute -inset-[1px] rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      />
      {/* Glow effect */}
      <div 
        className="absolute -inset-[1px] rounded-2xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      />
      {/* Inner card */}
      <div className="relative bg-[#0a0a0c] rounded-2xl p-7">
        {children}
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: 0% 0; }
        }
      `}</style>
    </div>
  )

  if (showSignUp) {
    return (
      <div className="min-h-screen w-full bg-[#050506] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/[0.07] via-violet-500/[0.05] to-cyan-500/[0.07] rounded-full blur-[100px]" />
        
        <div className="w-full max-w-[360px] relative z-10">
          <AnimatedCard>
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/30">
                <Image
                  src="/images/ghost-logo-3-eyes.png"
                  alt="Degenetics"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-lg font-semibold text-white tracking-tight">Create account</h1>
              <p className="text-[13px] text-zinc-400 mt-1.5">Join the future of crypto intelligence</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignUp} className="space-y-3">
              <input
                type="text"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                placeholder="Name"
                required
                className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[13px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[13px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[13px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />

              {error && <p className="text-[11px] text-red-400 text-center py-1">{error}</p>}

              <button
                type="submit"
                disabled={isConnecting}
                className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-[13px] font-medium transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/25"
              >
                {isConnecting ? "Creating..." : "Create account"}
              </button>
            </form>

            <p className="text-center text-[13px] text-zinc-400 mt-6">
              Already have an account?{" "}
              <button onClick={() => setShowSignUp(false)} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Sign in
              </button>
            </p>
          </AnimatedCard>

          {/* Footer */}
          <div className="mt-8 flex flex-col items-center gap-2.5">
            <a href="https://x.com/looterchat" target="_blank" rel="noopener noreferrer" className="text-[12px] text-zinc-400 hover:text-white transition-colors">
              @looterchat
            </a>
            <a href="https://pump.fun/coin/CE6mKngfsP21SViu2iMuUJTmbR22jSnqJQ9PSXxwpump" target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors">
              CE6mKngfsP21SViu2iMuUJTmbR22jSnqJQ9PSXxwpump
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#050506] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/[0.07] via-violet-500/[0.05] to-cyan-500/[0.07] rounded-full blur-[100px]" />
      
      <div className="w-full max-w-[360px] relative z-10">
        <AnimatedCard>
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/30">
              <Image
                src="/images/ghost-logo-3-eyes.png"
                alt="Degenetics"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-lg font-semibold text-white tracking-tight">Sign in to Degenetics</h1>
            <p className="text-[13px] text-zinc-400 mt-1.5">AI-powered crypto intelligence</p>
          </div>

          {/* Primary Actions */}
          <div className="space-y-2.5">
            <button
              onClick={handlePhantomConnect}
              disabled={isConnecting}
              className="w-full h-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-[13px] font-medium tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/20"
            >
              <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 128 128" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M55.6416 82.1477C50.8744 89.4525 42.8862 98.6966 32.2568 98.6966C27.232 98.6966 22.4004 96.628 22.4004 87.6424C22.4004 64.7584 53.6445 29.3335 82.6339 29.3335C99.1257 29.3335 105.697 40.7755 105.697 53.7689C105.697 70.4471 94.8739 89.5171 84.1156 89.5171C80.7013 89.5171 79.0264 87.6424 79.0264 84.6688C79.0264 83.8931 79.1552 83.0527 79.4129 82.1477C75.7409 88.4182 68.6546 94.2361 62.0192 94.2361C57.1877 94.2361 54.7397 91.1979 54.7397 86.9314C54.7397 85.3799 55.0618 83.7638 55.6416 82.1477ZM80.6133 53.3182C80.6133 57.1044 78.3795 58.9975 75.8806 58.9975C73.3438 58.9975 71.1479 57.1044 71.1479 53.3182C71.1479 49.532 73.3438 47.6389 75.8806 47.6389C78.3795 47.6389 80.6133 49.532 80.6133 53.3182ZM94.8102 53.3184C94.8102 57.1046 92.5763 58.9977 90.0775 58.9977C87.5407 58.9977 85.3447 57.1046 85.3447 53.3184C85.3447 49.5323 87.5407 47.6392 90.0775 47.6392C92.5763 47.6392 94.8102 49.5323 94.8102 53.3184Z" fill="currentColor"/>
              </svg>
              <span>Connect Phantom</span>
            </button>

            <button
              onClick={handleGitHubSignIn}
              disabled={isConnecting}
              className="w-full h-10 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white rounded-lg text-[13px] font-medium tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2.5"
            >
              <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[13px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[13px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />

            {error && <p className="text-[11px] text-red-400 text-center py-1">{error}</p>}

            <button
              type="submit"
              disabled={isConnecting}
              className="w-full h-11 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-zinc-300 hover:text-white rounded-xl text-[13px] font-medium transition-all disabled:opacity-50"
            >
              {isConnecting ? "Signing in..." : "Continue"}
            </button>
          </form>

          <p className="text-center text-[13px] text-zinc-400 mt-6">
            New to Degenetics?{" "}
            <button onClick={() => setShowSignUp(true)} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Create account
            </button>
          </p>
        </AnimatedCard>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center gap-2.5">
          <a href="https://x.com/looterchat" target="_blank" rel="noopener noreferrer" className="text-[12px] text-zinc-400 hover:text-white transition-colors">
            @looterchat
          </a>
          <a href="https://pump.fun/coin/CE6mKngfsP21SViu2iMuUJTmbR22jSnqJQ9PSXxwpump" target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors">
            CE6mKngfsP21SViu2iMuUJTmbR22jSnqJQ9PSXxwpump
          </a>
        </div>
      </div>
    </div>
  )
}
