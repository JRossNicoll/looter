"use client"
import { useState, useEffect, useRef } from "react"
import { Clock, TrendingUp, X, Ticket, Sparkles, Gift } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Fixed constants outside component to avoid re-creation
const TOTAL_DURATION = 59 * 60 // 59 minutes in seconds
const BASE_VALUE = 44
const INCREMENT_PER_2_MIN = 20

// Fixed end time stored in localStorage key
const STORAGE_KEY = 'degenetics_giveaway_end_time'

export default function HourlyGiveaway() {
  const [timeLeft, setTimeLeft] = useState({ minutes: 59, seconds: 0 })
  const [giveawayValue, setGiveawayValue] = useState(BASE_VALUE)
  const [showModal, setShowModal] = useState(false)
  const [endTime, setEndTime] = useState(null)

  useEffect(() => {
    // Get or set the fixed end time from localStorage
    let storedEndTime = null
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        storedEndTime = parseInt(stored, 10)
        // Check if stored time is still valid (not expired)
        if (storedEndTime <= Date.now()) {
          // Reset to 59 minutes from now
          storedEndTime = Date.now() + (59 * 60 * 1000)
          localStorage.setItem(STORAGE_KEY, storedEndTime.toString())
        }
      } else {
        // First time - set 59 minutes from now
        storedEndTime = Date.now() + (59 * 60 * 1000)
        localStorage.setItem(STORAGE_KEY, storedEndTime.toString())
      }
    } catch {
      storedEndTime = Date.now() + (59 * 60 * 1000)
    }
    setEndTime(storedEndTime)
  }, [])

  useEffect(() => {
    if (!endTime) return

    const calculateTimeAndValue = () => {
      const now = Date.now()
      let remaining = Math.max(0, Math.floor((endTime - now) / 1000))
      
      // If timer expired, reset to 59 minutes and update localStorage
      if (remaining === 0) {
        const newEndTime = now + (59 * 60 * 1000)
        setEndTime(newEndTime)
        try {
          localStorage.setItem(STORAGE_KEY, newEndTime.toString())
        } catch {}
        remaining = 59 * 60
      }
      
      // Cap at 59 minutes max display
      const cappedRemaining = Math.min(remaining, TOTAL_DURATION)

      const minutes = Math.floor(cappedRemaining / 60)
      const seconds = cappedRemaining % 60

      setTimeLeft({ minutes, seconds })

      // Calculate value: $20 increase every 2 minutes, incrementally
      const elapsed = TOTAL_DURATION - cappedRemaining
      const twoMinuteIntervals = Math.floor(elapsed / 120)
      const progressInCurrentInterval = (elapsed % 120) / 120
      
      const currentValue = BASE_VALUE + 
        (twoMinuteIntervals * INCREMENT_PER_2_MIN) + 
        (progressInCurrentInterval * INCREMENT_PER_2_MIN)

      setGiveawayValue(currentValue)
    }

    calculateTimeAndValue()
    const interval = setInterval(calculateTimeAndValue, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  const formatTime = (num) => String(num).padStart(2, "0")
  const formatValue = (val) => `$${val.toFixed(2)}`

  // Calculate progress percentage
  const progressPercent = ((TOTAL_DURATION - (timeLeft.minutes * 60 + timeLeft.seconds)) / TOTAL_DURATION) * 100

  return (
    <>
      {/* Enhanced Giveaway Card with Animated Border */}
      <div className="relative group">
        {/* Animated gradient border */}
        <div 
          className="absolute -inset-[1px] rounded-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 blur-[0.5px]"
          style={{
            background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #06b6d4)',
            backgroundSize: '300% 100%',
            animation: 'gradientShift 3s ease infinite',
          }}
        />
        
        {/* Soft outer glow */}
        <div 
          className="absolute -inset-[2px] rounded-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 blur-md"
          style={{
            background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #06b6d4)',
            backgroundSize: '300% 100%',
            animation: 'gradientShift 3s ease infinite',
          }}
        />
        
        {/* Card content */}
        <div className="relative rounded-xl bg-[#0a0a0c] p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/10">
                <Gift className="h-4.5 w-4.5 text-cyan-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-white uppercase tracking-wider leading-tight">Giveaway</span>
                <span className="text-[9px] text-zinc-500 leading-tight">Launch Week Special</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">Live</span>
            </div>
          </div>

          {/* Prize Pool Label */}
          <div className="text-center mb-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Current Prize Pool</span>
          </div>

          {/* Value Display - Prominent */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {formatValue(giveawayValue)}
              </span>
            </div>
          </div>

          {/* Timer Label */}
          <div className="text-center mb-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Time Remaining</span>
          </div>

          {/* Timer Display - Larger */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center rounded-xl bg-black/60 border border-white/[0.06] px-4 py-3">
                <span className="text-3xl font-mono font-bold text-white tracking-wider">
                  {formatTime(timeLeft.minutes)}
                </span>
              </div>
              <span className="text-[9px] text-zinc-600 mt-1">MIN</span>
            </div>
            <span className="text-2xl font-mono text-cyan-500 animate-pulse mb-4">:</span>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center rounded-xl bg-black/60 border border-white/[0.06] px-4 py-3">
                <span className="text-3xl font-mono font-bold text-white tracking-wider">
                  {formatTime(timeLeft.seconds)}
                </span>
              </div>
              <span className="text-[9px] text-zinc-600 mt-1">SEC</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] text-zinc-600">Prize increasing...</span>
              <span className="text-[9px] text-cyan-400">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="h-2 rounded-full bg-black/60 border border-white/[0.04] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
                style={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="rounded-lg bg-black/40 border border-white/[0.04] p-2.5 text-center">
              <span className="text-[9px] text-zinc-600 block">Starting</span>
              <span className="text-xs font-semibold text-white">$44.00</span>
            </div>
            <div className="rounded-lg bg-black/40 border border-white/[0.04] p-2.5 text-center">
              <span className="text-[9px] text-zinc-600 block">Max Prize</span>
              <span className="text-xs font-semibold text-cyan-400">$634.00</span>
            </div>
          </div>

          {/* Enter Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] shadow-lg shadow-cyan-500/25"
          >
            Enter Giveaway
          </button>

          {/* Fine print */}
          <p className="text-[10px] text-zinc-500 text-center mt-3">Hold $DGEN to participate</p>
        </div>
      </div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="fixed left-1/2 top-1/2 z-[101] w-[95%] max-w-md max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/[0.06] bg-[#0a0a0c] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="overflow-y-auto overscroll-contain p-5">
                {/* Ambient glow */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-600/5 blur-3xl" />
                </div>

                {/* Close button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 z-20 rounded-md p-1.5 text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 transition-all"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Logo */}
                <div className="relative flex justify-center mb-5">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-cyan-500/20 blur-xl" />
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-white/[0.08] shadow-lg">
                      <Image
                        src="/images/ghost-logo-3-eyes.png"
                        alt="Degenetics"
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center mb-5">
                  <h2 className="text-xl font-semibold text-white tracking-tight mb-1.5">Hourly Giveaway</h2>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1">
                    <Sparkles className="h-3 w-3 text-cyan-500" />
                    <span className="text-[11px] font-medium text-cyan-400 uppercase tracking-wider">Launch Week Special</span>
                  </div>
                </div>

                {/* Description Card */}
                <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 mb-4">
                  <p className="text-[13px] text-zinc-400 leading-relaxed text-center">
                    In celebration of our platform launch, we're hosting{" "}
                    <span className="text-white font-medium">hourly giveaways</span> for an{" "}
                    <span className="text-white font-medium">entire week</span>.
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 mt-3 rounded-md bg-black/40 px-3 py-2">
                    <Clock className="h-3.5 w-3.5 text-cyan-500" />
                    <span className="text-[11px] font-medium text-zinc-300">Every hour, on the hour</span>
                  </div>
                </div>

                {/* How to Enter */}
                <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Ticket className="h-4 w-4 text-cyan-500" />
                    <h3 className="text-[13px] font-medium text-white">How to Enter</h3>
                  </div>
                  <p className="text-[12px] text-zinc-400 leading-relaxed mb-3">
                    Simply hold <span className="text-cyan-400 font-medium">$DGEN</span> at the time of the draw.
                  </p>
                  <div className="rounded-md bg-black/40 p-2.5">
                    <p className="text-[11px] text-zinc-500">
                      <span className="text-zinc-300 font-medium">1 token = 1 ticket</span>
                      <br />
                      <span className="text-zinc-600">100 $DGEN = 100 tickets</span>
                    </p>
                  </div>
                </div>

                {/* Automatic Process */}
                <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-emerald-500/10">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-medium text-white mb-1">Fully Automatic</h4>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Winners are randomly selected and winnings sent directly to the winning wallet.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Good Luck */}
                <div className="rounded-lg border border-cyan-500/10 bg-cyan-500/5 p-3 text-center mb-4">
                  <p className="text-[13px] font-medium text-cyan-400">Good Luck!</p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 py-2.5 text-[13px] font-medium text-white transition-all active:scale-[0.98] shadow-lg shadow-cyan-500/20"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
