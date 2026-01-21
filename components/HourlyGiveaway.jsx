"use client"
import { useState, useEffect } from "react"
import { Clock, TrendingUp, X, Ticket, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function HourlyGiveaway() {
  const [timeLeft, setTimeLeft] = useState({ minutes: 59, seconds: 0 })
  const [giveawayValue, setGiveawayValue] = useState(44)
  const [showModal, setShowModal] = useState(false)
  
  // HARDCODED: Fixed end time - January 22, 2026 at 23:59:00 UTC  
  // This will NOT reset on refresh - it's a fixed point in time
  const FIXED_END_TIME = new Date('2026-01-22T23:59:00Z').getTime()
  const TOTAL_DURATION = 59 * 60 // 59 minutes in seconds
  const BASE_VALUE = 44
  const INCREMENT_PER_2_MIN = 20 // $20 increase every 2 minutes

  useEffect(() => {
    const calculateTimeAndValue = () => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((FIXED_END_TIME - now) / 1000))
      
      // Cap at 59 minutes max
      const cappedRemaining = Math.min(remaining, TOTAL_DURATION)
      
      if (cappedRemaining === 0) {
        setTimeLeft({ minutes: 0, seconds: 0 })
        // Max value after 59 minutes: $44 + ($20 * 29 two-minute intervals) = $624
        setGiveawayValue(BASE_VALUE + (INCREMENT_PER_2_MIN * 29))
        return
      }

      const minutes = Math.floor(cappedRemaining / 60)
      const seconds = cappedRemaining % 60

      setTimeLeft({ minutes, seconds })

      // Calculate value: $20 increase every 2 minutes, incrementally
      const elapsed = TOTAL_DURATION - cappedRemaining
      const twoMinuteIntervals = Math.floor(elapsed / 120) // How many full 2-minute intervals have passed
      const progressInCurrentInterval = (elapsed % 120) / 120 // Progress within current 2-min interval
      
      // Base value + completed intervals + incremental progress to next $20
      const currentValue = BASE_VALUE + 
        (twoMinuteIntervals * INCREMENT_PER_2_MIN) + 
        (progressInCurrentInterval * INCREMENT_PER_2_MIN)

      setGiveawayValue(currentValue)
    }

    calculateTimeAndValue()
    const interval = setInterval(calculateTimeAndValue, 1000)

    return () => clearInterval(interval)
  }, [FIXED_END_TIME])

  const formatTime = (num) => String(num).padStart(2, "0")
  const formatValue = (val) => `$${val.toFixed(2)}`

  return (
    <>
      {/* Compact Giveaway Card */}
      <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-cyan-500" />
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Giveaway</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
          </div>
        </div>

        {/* Timer and Value Row */}
        <div className="flex items-center gap-2 mb-2">
          {/* Timer */}
          <div className="flex-1 flex items-center justify-center gap-0.5 rounded-md bg-black/40 px-2 py-1.5">
            <span className="text-sm font-mono font-semibold text-white">{formatTime(timeLeft.minutes)}</span>
            <span className="text-sm font-mono text-zinc-600">:</span>
            <span className="text-sm font-mono font-semibold text-white">{formatTime(timeLeft.seconds)}</span>
          </div>
          
          {/* Value */}
          <div className="flex-1 flex items-center justify-center rounded-md bg-black/40 px-2 py-1.5">
            <span className="text-sm font-mono font-semibold text-cyan-400">{formatValue(giveawayValue)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-0.5 rounded-full bg-black/40 overflow-hidden mb-2">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
            initial={{ width: "0%" }}
            animate={{
              width: `${((60 - timeLeft.minutes) / 60) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Enter Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full rounded-md bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 hover:border-cyan-500/40 px-3 py-1.5 text-[11px] font-medium text-cyan-400 transition-all active:scale-[0.98]"
        >
          Enter Giveaway
        </button>
      </div>

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
