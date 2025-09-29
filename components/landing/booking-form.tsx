"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { AdminPanel } from "@/components/admin/admin-panel"

export function BookingForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("book") // 'book', 'track', 'admin'
  const [originPinCode, setOriginPinCode] = useState("")
  const [destinationPinCode, setDestinationPinCode] = useState("")
  const [trackId, setTrackId] = useState("")

  const handleStartShipping = () => {
    router.push("/book")
  }

  const handleTrack = () => {
    if (trackId.trim()) {
      router.push(`/track?id=${encodeURIComponent(trackId.trim())}`)
    } else {
      router.push("/track")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="glass-effect p-6 rounded-lg shadow-lg max-w-2xl w-full mx-auto"
    >
      <div className="flex justify-around mb-6 border-b border-white/20">
        <button
          className={`flex-1 py-3 px-4 text-lg font-semibold transition-all duration-300 ease-in-out relative ${
            activeTab === "book" ? "text-red-500" : "text-gray-300 hover:text-white"
          }`}
          onClick={() => setActiveTab("book")}
        >
          Book Order
          {activeTab === "book" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>}
        </button>
        <button
          className={`flex-1 py-3 px-4 text-lg font-semibold transition-all duration-300 ease-in-out relative ${
            activeTab === "track" ? "text-red-500" : "text-gray-300 hover:text-white"
          }`}
          onClick={() => setActiveTab("track")}
        >
          Track
          {activeTab === "track" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>}
        </button>
        <button
          className={`flex-1 py-3 px-4 text-lg font-semibold transition-all duration-300 ease-in-out relative ${
            activeTab === "admin" ? "text-red-500" : "text-gray-300 hover:text-white"
          }`}
          onClick={() => setActiveTab("admin")}
        >
          Admin Tracker
          {activeTab === "admin" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>}
        </button>
      </div>

      {activeTab === "book" && (
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Origin Pin Code"
            className="h-12 bg-white/70 border-gray-300 text-gray-800 placeholder:text-gray-500"
            value={originPinCode}
            onChange={(e) => setOriginPinCode(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Destination Pin Code"
            className="h-12 bg-white/70 border-gray-300 text-gray-800 placeholder:text-gray-500"
            value={destinationPinCode}
            onChange={(e) => setDestinationPinCode(e.target.value)}
          />
          <Button
            className="w-full bg-red-600 hover:bg-red-700 border-0 text-white text-lg font-semibold py-3 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
            onClick={handleStartShipping}
          >
            START SHIPPING
          </Button>
          <p className="text-sm text-white text-center">Want to ship anywhere, anytime? Do it in just a few clicks.</p>
        </div>
      )}

      {activeTab === "track" && (
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter Tracking ID"
            className="h-12 bg-white/70 border-gray-300 text-gray-800 placeholder:text-gray-500"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTrack()
            }}
          />
          <Button
            className="w-full bg-red-600 hover:bg-red-700 border-0 text-white text-lg font-semibold py-3 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
            onClick={handleTrack}
          >
            TRACK SHIPMENT
          </Button>
        </div>
      )}

      {activeTab === "admin" && <AdminPanel />}
    </motion.div>
  )
}
