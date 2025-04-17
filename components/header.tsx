"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [language, setLanguage] = useState<"ru" | "en">("ru")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleLanguage = () => {
    setLanguage(language === "ru" ? "en" : "ru")
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="border-b border-gray-100 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center ml-2">
          <div className="relative h-14 w-14 md:h-16 md:w-16">
            <Image src="/logo.png" alt="VISION ARCHITECTS Logo" fill className="object-contain" />
          </div>
          {/* <span className="text-xl tracking-wider">VISION ARCHITECTS</span> */}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/about" className="hover:text-gray-600 transition-colors">
            О нас
          </Link>
          <Link href="/offers" className="hover:text-gray-600 transition-colors">
            Предложения
          </Link>
          <Link href="/contact" className="hover:text-gray-600 transition-colors">
            Контакты
          </Link>
          <Button variant="ghost" className="text-sm" onClick={toggleLanguage}>
            {language === "ru" ? "EN" : "RU"}
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Открыть меню</span>
        </Button>
      </div>

      {/* Mobile Navigation - Переделанное мобильное меню */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 border-t border-gray-100">
          <nav className="flex flex-col space-y-4">
            <Link href="/about" className="hover:text-gray-600 transition-colors" onClick={toggleMobileMenu}>
              О нас
            </Link>
            <Link href="/offers" className="hover:text-gray-600 transition-colors" onClick={toggleMobileMenu}>
              Предложения
            </Link>
            <Link href="/contact" className="hover:text-gray-600 transition-colors" onClick={toggleMobileMenu}>
              Контакты
            </Link>
            <Button variant="ghost" className="text-sm w-fit" onClick={toggleLanguage}>
              {language === "ru" ? "EN" : "RU"}
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
