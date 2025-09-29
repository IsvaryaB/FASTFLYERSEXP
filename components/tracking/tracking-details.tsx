"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircleIcon, PackageIcon, TruckIcon, XCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ShipmentStatus = "Pending" | "In Transit" | "Out for Delivery" | "Delivered" | "Cancelled"

interface Shipment {
  id: string
  status: ShipmentStatus
  origin: string
  destination: string
  estimatedDelivery: string
  events: {
    status: ShipmentStatus
    date: string
    location: string
  }[]
}

const mockShipments: Record<string, Shipment> = {
  ABC1234567: {
    id: "ABC1234567",
    status: "In Transit",
    origin: "New York, USA",
    destination: "Los Angeles, USA",
    estimatedDelivery: "2025-10-01",
    events: [
      { status: "Pending", date: "2025-09-20", location: "New York" },
      { status: "In Transit", date: "2025-09-21", location: "Chicago" },
    ],
  },
  DEF9876543: {
    id: "DEF9876543",
    status: "Delivered",
    origin: "London, UK",
    destination: "Paris, France",
    estimatedDelivery: "2025-09-22",
    events: [
      { status: "Pending", date: "2025-09-18", location: "London" },
      { status: "In Transit", date: "2025-09-19", location: "Calais" },
      { status: "Out for Delivery", date: "2025-09-21", location: "Paris" },
      { status: "Delivered", date: "2025-09-22", location: "Paris" },
    ],
  },
  GHI1122334: {
    id: "GHI1122334",
    status: "Out for Delivery",
    origin: "Berlin, Germany",
    destination: "Rome, Italy",
    estimatedDelivery: "2025-09-28",
    events: [
      { status: "Pending", date: "2025-09-24", location: "Berlin" },
      { status: "In Transit", date: "2025-09-25", location: "Munich" },
      { status: "Out for Delivery", date: "2025-09-27", location: "Rome" },
    ],
  },
  JKL5566778: {
    id: "JKL5566778",
    status: "Cancelled",
    origin: "Tokyo, Japan",
    destination: "Seoul, South Korea",
    estimatedDelivery: "2025-10-05",
    events: [
      { status: "Pending", date: "2025-09-26", location: "Tokyo" },
      { status: "Cancelled", date: "2025-09-27", location: "Tokyo" },
    ],
  },
}

const statusOrder: ShipmentStatus[] = ["Pending", "In Transit", "Out for Delivery", "Delivered"]

const getStatusIcon = (status: ShipmentStatus, isActive: boolean, isCompleted: boolean) => {
  if (status === "Cancelled") return <XCircleIcon className="h-6 w-6 text-destructive" />
  if (isCompleted) return <CheckCircleIcon className="h-6 w-6 text-primary" />
  if (isActive) return <TruckIcon className="h-6 w-6 text-accent" />
  return <PackageIcon className="h-6 w-6 text-muted-foreground" />
}

export function TrackingDetails() {
  const searchParams = useSearchParams()
  const initialTrackingId = searchParams.get("id") || ""
  const [trackingId, setTrackingId] = useState(initialTrackingId)
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialTrackingId) {
      handleTrackShipment(initialTrackingId)
    }
  }, [initialTrackingId])

  const handleTrackingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingId(e.target.value)
    setError(null)
  }

  const handleTrackShipment = (idToTrack: string) => {
    if (!idToTrack) {
      setError("Please enter a tracking ID.")
      setShipment(null)
      return
    }
    const foundShipment = mockShipments[idToTrack.toUpperCase()]
    if (foundShipment) {
      setShipment(foundShipment)
      setError(null)
    } else {
      setShipment(null)
      setError("Shipment not found. Please check the tracking ID.")
    }
  }

  const currentStatusIndex = shipment ? statusOrder.indexOf(shipment.status) : -1

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-3xl rounded-xl bg-card p-8 shadow-2xl glass-effect"
    >
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold gradient-text">Track Your Shipment</CardTitle>
        <p className="text-muted-foreground">Enter your tracking ID to get real-time updates.</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <motion.div whileFocus={{ scale: 1.01 }} whileHover={{ scale: 1.01 }} className="flex-1 w-full">
            <Input
              type="text"
              placeholder="Enter Tracking ID"
              className="h-12 w-full rounded-lg border-2 bg-background/80 px-4 text-foreground shadow-lg transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/50"
              value={trackingId}
              onChange={handleTrackingChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleTrackShipment(trackingId)
                }
              }}
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => handleTrackShipment(trackingId)}
              className="gradient-primary h-12 w-full rounded-lg px-6 text-lg font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-auto"
            >
              Track
            </Button>
          </motion.div>
        </div>
        {error && <p className="mt-4 text-center text-destructive">{error}</p>}

        {shipment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8"
          >
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-2xl font-bold text-foreground"
            >
              Shipment Details: {shipment.id}
            </motion.h3>
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="show"
              className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <motion.p variants={itemVariants}>
                <span className="font-semibold text-muted-foreground">Origin:</span> {shipment.origin}
              </motion.p>
              <motion.p variants={itemVariants}>
                <span className="font-semibold text-muted-foreground">Destination:</span> {shipment.destination}
              </motion.p>
              <motion.p variants={itemVariants}>
                <span className="font-semibold text-muted-foreground">Current Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    shipment.status === "Delivered"
                      ? "text-green-500"
                      : shipment.status === "Cancelled"
                        ? "text-destructive"
                        : "text-primary"
                  }`}
                >
                  {shipment.status}
                </span>
              </motion.p>
              <motion.p variants={itemVariants}>
                <span className="font-semibold text-muted-foreground">Estimated Delivery:</span>{" "}
                {shipment.estimatedDelivery}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8"
            >
              <h4 className="mb-4 text-xl font-bold text-foreground">Tracking Progress</h4>
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-border" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%` }}
                  transition={{ delay: 0.8, duration: 1.0, ease: "easeOut" }}
                  className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-primary"
                />
                {statusOrder.map((status, index) => {
                  const isCompleted = index <= currentStatusIndex
                  const isActive = index === currentStatusIndex
                  const isCancelled = shipment.status === "Cancelled"

                  return (
                    <motion.div
                      key={status}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index + 0.9, duration: 0.5 }}
                      className="relative z-10 flex flex-col items-center"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background shadow-md transition-all duration-300 ${
                          isCancelled
                            ? "border-destructive text-destructive"
                            : isCompleted
                              ? "border-primary text-primary"
                              : "border-muted-foreground text-muted-foreground"
                        }`}
                      >
                        {getStatusIcon(status, isActive, isCompleted)}
                      </div>
                      <p
                        className={`mt-2 text-center text-sm ${
                          isCancelled
                            ? "text-destructive"
                            : isCompleted
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {status}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-8"
            >
              <h4 className="mb-4 text-xl font-bold text-foreground">Shipment History</h4>
              <div className="space-y-4">
                {shipment.events.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index + 1.3, duration: 0.5 }}
                    className="flex items-start gap-4 rounded-lg bg-muted/50 p-4 shadow-sm"
                  >
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                        event.status === "Delivered"
                          ? "bg-green-100 text-green-600"
                          : event.status === "Cancelled"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-primary/10 text-primary"
                      }`}
                    >
                      {getStatusIcon(event.status, false, event.status === "Delivered")}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{event.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date} at {event.location}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </CardContent>
    </motion.div>
  )
}
