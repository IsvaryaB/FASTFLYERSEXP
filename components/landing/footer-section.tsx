"use client"

import Link from "next/link"
import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { JoinUsModal } from "@/components/join-us/join-us-modal"

export function FooterSection() {
  const [isJoinUsModalOpen, setIsJoinUsModalOpen] = useState(false)

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8 }}
      className="w-full bg-card py-8 text-foreground shadow-inner"
    >
      <div className="container flex flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="flex items-center gap-2">
            <img src="/images/main-logo.png" alt="FastFlyer logo" className="h-8 w-8 rounded-sm" />
            <Link href="#" className="text-2xl font-bold gradient-text" prefetch={false}>
              FastFlyer
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">Fast. Reliable. Trackable.</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-sm md:gap-8">
          <Link href="/contact" className="hover:text-primary transition-colors" prefetch={false}>
            Contact
          </Link>
          <Link href="#" className="hover:text-primary transition-colors" prefetch={false}>
            Privacy Policy
          </Link>
          <button
            onClick={() => setIsJoinUsModalOpen(true)}
            className="hover:text-primary transition-colors font-medium"
          >
            Carrier
          </button>
        </nav>
        <div className="flex gap-4">
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
            <FacebookIcon className="h-6 w-6" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
            <TwitterIcon className="h-6 w-6" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
            <InstagramIcon className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </Link>
        </div>
      </div>

      <JoinUsModal isOpen={isJoinUsModalOpen} onClose={() => setIsJoinUsModalOpen(false)} />
    </motion.footer>
  )
}
