"use client"
import { useState, useEffect } from "react"
import { Clock, TrendingUp, X, Ticket, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function HourlyGiveaway() {
  const [timeLeft, setTimeLeft] = useState({ minutes: 60, seconds: 0 })
  const [giveawayValue, setGiveawayValue] = useState(50)
  const [showModal, setShowModal] = useState(false)
  
  // HARDCODED: Set to January 21, 2026 at 00:00:00 UTC (1 hour from now as of deployment)
  // This will NOT reset on refresh - it's a fixed point in time
  const FIXED_END_TIME = new Date('2026-01-21T00:00:00Z').getTime()
  const endTime = FIXED_END_TIME; // Declare the endTime variable

  useEffect(() => {
    const calculateTimeAndValue = () => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((FIXED_END_TIME - now) / 1000))
      
      // If timer has ended, show 00:00 and max value
      if (remaining === 0) {
        setTimeLeft({ minutes: 0, seconds: 0 })
        setGiveawayValue(500)
        return
      }

      const minutes = Math.floor(remaining / 60)
      const seconds = remaining % 60

      setTimeLeft({ minutes, seconds })

      // Calculate value: starts at $50, ends at $500 over 1 hour
      const totalDuration = 60 * 60 // 60 minutes in seconds
      const elapsed = totalDuration - remaining
      const progress = Math.min(1, elapsed / totalDuration)
      const baseValue = 50
      const maxValue = 500
      const currentValue = baseValue + (maxValue - baseValue) * progress

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
      <div className="mb-2 rounded-lg border border-[#9333EA]/20 bg-gradient-to-br from-[#9333EA]/25 to-[#9333EA]/15 p-2.5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9333EA]/20">
            <Clock className="h-3 w-3 text-[#9333EA]" />
          </div>
          <div className="text-[10px] font-semibold text-[#9333EA] uppercase tracking-wider">Hourly Giveaway</div>
        </div>

        {/* Timer Display */}
        <div className="mb-2">
          <div className="text-[9px] text-zinc-400 mb-1 uppercase tracking-wide">Next Giveaway</div>
          <div className="flex items-center justify-center gap-1 rounded-md bg-black/30 px-2 py-2">
            <div className="flex flex-col items-center">
              <motion.div
                key={timeLeft.minutes}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-bold text-white font-mono"
              >
                {formatTime(timeLeft.minutes)}
              </motion.div>
              <div className="text-[8px] text-zinc-500 uppercase">Min</div>
            </div>
            <div className="text-lg font-bold text-[#9333EA] pb-3">:</div>
            <div className="flex flex-col items-center">
              <motion.div
                key={timeLeft.seconds}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-bold text-white font-mono"
              >
                {formatTime(timeLeft.seconds)}
              </motion.div>
              <div className="text-[8px] text-zinc-500 uppercase">Sec</div>
            </div>
          </div>
        </div>

        {/* Giveaway Value */}
        <div className="mb-2">
          <div className="text-[9px] text-zinc-400 mb-1 uppercase tracking-wide">Giveaway Value</div>
          <div className="flex items-center justify-between rounded-md bg-black/30 px-2 py-2">
            <motion.div
              key={Math.floor(giveawayValue)}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-base font-bold text-[#9333EA] font-mono"
            >
              {formatValue(giveawayValue)}
            </motion.div>
            <TrendingUp className="h-3.5 w-3.5 text-green-400" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2 h-1 rounded-full bg-black/30 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#9333EA] to-green-400"
            initial={{ width: "0%" }}
            animate={{
              width: `${((60 - timeLeft.minutes) / 60) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full rounded-md bg-[#9333EA] hover:bg-[#9333EA]/90 px-3 py-1.5 text-xs font-semibold text-white transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9333EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]"
        >
          Enter Giveaway
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="fixed left-1/2 top-1/2 z-[101] w-[95%] max-w-lg max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-xl md:rounded-2xl border border-[#9333EA]/30 bg-gradient-to-b from-[#0f0f0f] to-black shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="overflow-y-auto overscroll-contain p-4 md:p-6">
                <div className="absolute inset-0 overflow-hidden rounded-xl md:rounded-2xl pointer-events-none">
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#9333EA]/10 blur-3xl"
                  />
                  <motion.div
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#9333EA]/10 blur-3xl"
                  />
                </div>

                {/* Close button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="sticky top-0 left-full z-20 -mb-8 rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors bg-black/50 backdrop-blur-sm"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative mb-4 md:mb-6"
                >
                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="mx-auto mb-3 md:mb-4 flex h-16 w-16 md:h-24 md:w-24 items-center justify-center"
                  >
                    <div className="relative h-full w-full">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full bg-[#9333EA]/30 blur-xl"
                      />
                      <div className="relative z-10 h-full w-full rounded-full overflow-hidden border-2 border-[#9333EA]/40 shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                        <Image
                          src="/images/ghost-logo-3-eyes.png"
                          alt="Degenetics"
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Title Section */}
                  <div className="text-center space-y-2 md:space-y-3">
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl md:text-3xl font-bold text-white tracking-tight"
                    >
                      Hourly Giveaway
                    </motion.h2>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="inline-flex items-center gap-1.5 md:gap-2 rounded-full border border-[#9333EA]/30 bg-[#9333EA]/10 px-3 md:px-4 py-1 md:py-1.5"
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-[#9333EA]" />
                      </motion.div>
                      <span className="text-xs md:text-sm font-bold text-[#9333EA] uppercase tracking-wider">
                        Launch Week Special
                      </span>
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                          delay: 0.5,
                        }}
                      >
                        <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-[#9333EA]" />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative mb-4 md:mb-6 rounded-lg md:rounded-xl border border-[#9333EA]/20 bg-gradient-to-br from-[#9333EA]/5 to-transparent p-3 md:p-5 backdrop-blur-sm"
                >
                  <div className="space-y-3 md:space-y-4">
                    <p className="text-center text-sm md:text-base text-zinc-200 leading-relaxed text-balance">
                      Welcome! In celebration of our platform and token launch, we are hosting{" "}
                      <span className="font-bold text-white">hourly giveaways</span> for an{" "}
                      <span className="font-bold text-white">entire week!</span>
                    </p>

                    <div className="flex items-center justify-center gap-2 rounded-lg border border-[#9333EA]/30 bg-black/40 px-3 md:px-4 py-2 md:py-3">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        <Clock className="h-4 w-4 md:h-5 md:w-5 text-[#9333EA]" />
                      </motion.div>
                      <span className="text-xs md:text-sm font-bold text-[#9333EA] uppercase tracking-wide">
                        Every hour, on the hour without fail
                      </span>
                    </div>
                  </div>
                </motion.div>

                <div className="relative space-y-3 md:space-y-4">
                  {/* How to Enter Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-lg md:rounded-xl border border-[#9333EA]/20 bg-gradient-to-br from-[#9333EA]/10 to-[#9333EA]/5 p-3 md:p-4"
                  >
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <Ticket className="h-4 w-4 md:h-5 md:w-5 text-[#9333EA]" />
                      <h3 className="text-sm md:text-base font-bold text-[#9333EA]">How to Enter</h3>
                    </div>
                    <p className="text-xs md:text-sm text-zinc-300 leading-relaxed text-balance mb-2 md:mb-3">
                      Entering couldn't be easier! All you need is to be a holder of{" "}
                      <span className="font-bold text-white">$DGEN</span> at the time of the draw.
                    </p>
                    <div className="rounded-lg border border-[#9333EA]/30 bg-black/30 p-2.5 md:p-3">
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        <span className="font-semibold text-white">Each token = 1 ticket</span>
                        <br />
                        Example: Holding 100 $DGEN = 100 tickets
                      </p>
                    </div>
                  </motion.div>

                  {/* Automatic Process Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-lg md:rounded-xl border border-white/5 bg-white/[0.02] p-3 md:p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-2 md:gap-3">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="flex h-7 w-7 md:h-8 md:w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20"
                      >
                        <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-400" />
                      </motion.div>
                      <div>
                        <h4 className="text-xs md:text-sm font-semibold text-white mb-1.5 md:mb-2">Fully Automatic</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed text-balance">
                          The entire process is automatic and autonomous. Winners are randomly selected with a new seed
                          after each draw, and winnings are sent directly to the winner's wallet holding the winning
                          $DGEN token!
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Good Luck Section */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="rounded-lg md:rounded-xl border border-[#9333EA]/30 bg-gradient-to-r from-[#9333EA]/20 to-[#9333EA]/10 p-3 md:p-4 text-center"
                  >
                    <p className="text-sm md:text-base font-bold text-[#9333EA]">Good Luck!</p>
                  </motion.div>
                </div>

                {/* Close button at bottom */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => setShowModal(false)}
                  className="relative mt-4 md:mt-6 w-full overflow-hidden rounded-lg md:rounded-xl bg-[#9333EA] hover:bg-[#9333EA]/90 px-4 py-2.5 md:py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9333EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]"
                >
                  <motion.div
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                  <span className="relative">Got it!</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
