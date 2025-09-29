"use client"

import { BookingForm } from "./booking-form"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative h-[70dvh] w-full overflow-hidden xl:h-[80dvh] flex items-center justify-center">
      <img
        src="/images/shipping-warehouse.jpg"
        alt="Shipping warehouse with trucks"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" /> {/* Overlay for better text readability */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center md:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-balance text-4xl font-bold tracking-tighter text-white sm:text-3xl md:text-4xl lg:text-5xl mt-4"
        >
          The Journey of Trust and Speed
          <br />
        </motion.h1>
        <BookingForm />
      </div>
    </section>
  )
}
