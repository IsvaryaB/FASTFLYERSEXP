"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur-sm shadow-sm">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <img src="/images/main-logo.png" alt="FastFlyer logo" className="h-8 w-8 rounded-sm" />
        <span className="font-semibold text-foreground">FastFlyer</span>
        <span className="sr-only">FastFlyer Home</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href="/services" className="text-foreground hover:text-primary" prefetch={false}>
          Services
        </Link>
        <Link href="/solutions" className="text-foreground hover:text-primary" prefetch={false}>
          Solutions
        </Link>
        <Link href="/features" className="text-foreground hover:text-primary" prefetch={false}>
          Features
        </Link>
        <Link href="/track" className="text-foreground hover:text-primary" prefetch={false}>
          Track
        </Link>
        <Link href="/locations" className="text-foreground hover:text-primary" prefetch={false}>
          Locate Us
        </Link>
        <Link href="/company" className="text-foreground hover:text-primary" prefetch={false}>
          Company
        </Link>
        <Link href="/support" className="text-foreground hover:text-primary" prefetch={false}>
          Support
        </Link>
        <Link href="/contact" className="text-foreground hover:text-primary" prefetch={false}>
          Contact
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <img src="/indian-flag.png" alt="India Flag" className="h-4 w-4" />
          <span className="text-sm font-medium">INDIA</span>
        </div>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
          <Link href="/book" prefetch={false}>
            SHIP NOW <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  )
}
