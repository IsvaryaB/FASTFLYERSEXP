"use client"

import { PackageIcon, MapPinIcon, HeadsetIcon, CalendarIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export function ServiceHighlights() {
  const [activeCards, setActiveCards] = useState<Record<number, boolean>>({})

  const services = [
    {
      icon: PackageIcon,
      title: "Easy Booking",
      description: "Effortless online booking with flexible options.",
      image: "/images/easy-booking.png", // Using new Easy Booking image for booking
    },
    {
      icon: MapPinIcon,
      title: "Real-time Tracking",
      description: "Monitor your shipment's journey from pickup to delivery.",
      image: "/images/real-time-tracking.jpg",
    },
    {
      icon: CalendarIcon,
      title: "Wide Coverage",
      description: "Delivering across 50+ cities with reliable service.",
      image: "/images/global-shipping.jpg",
    },
    {
      icon: HeadsetIcon,
      title: "24/7 Support",
      description: "Dedicated customer support whenever you need it.",
      image: "/images/24-7-support.jpg",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-balance text-3xl font-bold tracking-tighter sm:text-5xl"
          >
            Our Core Services Since-2010
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
          >
            Experience seamless logistics with FastFlyer.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service, index) => {
            const isActive = !!activeCards[index]

            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl p-6 text-center shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  {/* Background image layer */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.img
                        key="bg"
                        src={
                          service.image || "/placeholder.svg?height=600&width=800&query=service%20background%20image"
                        }
                        alt={service.title}
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Dark overlay for readability */}
                  <div
                    className={`absolute inset-0 transition-colors duration-300 ${isActive ? "bg-black/50" : "bg-transparent"}`}
                    aria-hidden="true"
                  />

                  {/* Foreground content */}
                  <div className="relative z-10 flex h-full flex-col items-center">
                    <CardHeader className="flex w-full flex-col items-center p-0">
                      {/* Icon button that toggles the background image */}
                      <motion.button
                        type="button"
                        aria-label={isActive ? `Hide ${service.title} background` : `Show ${service.title} background`}
                        aria-pressed={isActive}
                        onClick={() => setActiveCards((prev) => ({ ...prev, [index]: !prev[index] }))}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ring-1 transition-all duration-300
                          ${isActive ? "bg-primary text-primary-foreground ring-primary/40" : "bg-primary/10 text-primary ring-primary/20"}`}
                      >
                        <service.icon className="h-8 w-8" />
                      </motion.button>

                      <CardTitle
                        className={`text-xl font-semibold transition-colors duration-300 ${isActive ? "text-white" : ""}`}
                      >
                        {service.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="mt-2 p-0">
                      <p
                        className={`text-sm md:text-base transition-colors duration-300 ${isActive ? "text-white/90" : "text-muted-foreground"}`}
                      >
                        {service.description}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
