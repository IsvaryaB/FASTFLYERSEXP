"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PackageIcon, TruckIcon, BuildingIcon, CreditCardIcon } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function SidebarNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/dashboard",
      icon: PackageIcon,
      label: "Bookings",
    },
    {
      href: "/dashboard/tracking",
      icon: TruckIcon,
      label: "Tracking",
    },
    {
      href: "/dashboard/service-centers",
      icon: BuildingIcon,
      label: "Service Centers",
    },
    {
      href: "/dashboard/payments",
      icon: CreditCardIcon,
      label: "Payments",
    },
  ]

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex w-64 flex-col border-r bg-card p-4 shadow-lg"
    >
      <div className="mb-8 text-center">
        <Link href="/dashboard" prefetch={false}>
          <img src="/images/fastflyer-logo.png" alt="FastFlyer Express Admin Logo" className="h-12 w-auto mx-auto" />
        </Link>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index + 0.5, duration: 0.3 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted hover:text-primary",
                pathname === item.href && "bg-muted text-primary",
              )}
              prefetch={false}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.aside>
  )
}
