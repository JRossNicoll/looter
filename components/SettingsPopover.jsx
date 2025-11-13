"use client"
import { useState } from "react"
import { User, Globe, HelpCircle, Crown, BookOpen, LogOut, ChevronRight, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { disconnectPhantomWallet } from "../lib/phantom-wallet"
import { useLanguage } from "../lib/language-context"

export default function SettingsPopover({ children, walletAddress, onWalletChange }) {
  const [open, setOpen] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "ja", name: "日本語" },
    { code: "zh", name: "中文" },
    { code: "ko", name: "한국어" },
    { code: "pt", name: "Português" },
  ]

  const handleLogout = async () => {
    try {
      await disconnectPhantomWallet()
      onWalletChange?.(null)
      setOpen(false)
    } catch (error) {
      console.error("[v0] Error logging out:", error)
    }
  }

  const handleGetHelp = () => {
    window.open("https://docs.phantom.app/", "_blank")
    setOpen(false)
  }

  const handleUpgrade = () => {
    alert("Upgrade to Pro for unlimited chats, priority support, and advanced AI models!")
    setOpen(false)
  }

  const handleLearnMore = () => {
    window.open("https://phantom.app/learn", "_blank")
    setOpen(false)
  }

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode)
    setShowLanguageMenu(false)
  }

  if (showLanguageMenu) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start" side="top">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setShowLanguageMenu(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ←
              </button>
              <div className="text-sm font-medium">{t("language")}</div>
            </div>

            <div className="space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className="flex items-center justify-between w-full p-2 text-sm text-left rounded-lg transition-colors"
                >
                  <span>{lang.name}</span>
                  {language === lang.code && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" side="top">
        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-3">
            {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "j@gmail.com"}
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 mb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{t("personal")}</span>
            </div>
            <div className="ml-auto">
              <div className="text-xs text-muted-foreground">{t("proPlan")}</div>
            </div>
            <div className="text-primary">
              <Check className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-foreground mb-2">{t("settings")}</div>

            <button
              onClick={() => setShowLanguageMenu(true)}
              className="flex items-center gap-3 w-full p-2 text-sm text-left rounded-lg transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{t("language")}</span>
              <ChevronRight className="h-4 w-4 ml-auto" />
            </button>

            <button
              onClick={handleGetHelp}
              className="flex items-center gap-3 w-full p-2 text-sm text-left rounded-lg transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span>{t("getHelp")}</span>
            </button>

            <button
              onClick={handleUpgrade}
              className="flex items-center gap-3 w-full p-2 text-sm text-left rounded-lg transition-colors"
            >
              <Crown className="h-4 w-4" />
              <span>{t("upgradePlan")}</span>
            </button>

            <button
              onClick={handleLearnMore}
              className="flex items-center gap-3 w-full p-2 text-sm text-left rounded-lg transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>{t("learnMore")}</span>
              <ChevronRight className="h-4 w-4 ml-auto" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-2 text-sm text-left rounded-lg transition-colors border border-border mt-2"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("logOut")}</span>
            </button>
            {/* </CHANGE> */}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
