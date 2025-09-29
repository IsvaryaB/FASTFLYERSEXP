"use client"

import { motion } from "framer-motion"

export function StatsSection() {
  const stats = [
    { value: "1Lakh+", label: "Deliveries" },
    { value: "300+", label: "Cities in India" },
    { value: "95%", label: "On-Time" },
    { value: "190+", label: "Countries" },
    { value: "25K+", label: "Pincode service in India" },
    { value: "50+", label: "Partner Stores" },
]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants} className="flex flex-col items-center">
              <h3 className="text-5xl font-bold text-primary gradient-text">{stat.value}</h3>
              <p className="mt-2 text-lg font-medium text-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
