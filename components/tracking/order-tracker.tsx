"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, MapPin, Clock, CheckCircle, User, Calendar, Weight, FileText } from "lucide-react"

interface DocketOrder {
  docketNumber: string
  bookingDate: string
  shipmentMode: "Economy" | "Standard" | "Express" | "Same Day"
  shipperName: string
  shipperPhone: string
  shipperAddress: string
  shipperCity: string
  shipperPostalCode: string
  consigneeName: string
  consigneePhone: string
  consigneeAddress: string
  consigneeCity: string
  consigneePostalCode: string
  numberOfPackages: number
  weight: number
  volumetricWeight: number
  contents: string
  shipmentValue: number
  departure: string
  arrival: string
  freightCharges: number
  status: "Booked" | "In Transit" | "Out for Delivery" | "Delivered" | "Cancelled"
  createdAt: string
  lastUpdated: string
}

export function OrderTracker() {
  const [trackingId, setTrackingId] = useState("")
  const [order, setOrder] = useState<DocketOrder | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const trackOrder = () => {
    if (!trackingId.trim()) {
      setError("Please enter a docket number")
      return
    }

    setIsLoading(true)
    setError("")

    // Get orders from localStorage (admin-created orders)
    const savedOrders = localStorage.getItem("adminOrders")
    if (savedOrders) {
      const orders: DocketOrder[] = JSON.parse(savedOrders)
      const foundOrder = orders.find((o) => o.docketNumber.toLowerCase() === trackingId.toLowerCase())

      if (foundOrder) {
        setOrder(foundOrder)
      } else {
        setError("Docket not found. Please check your docket number.")
        setOrder(null)
      }
    } else {
      setError("Docket not found. Please check your docket number.")
      setOrder(null)
    }

    setIsLoading(false)
  }

  const getStatusIcon = (status: DocketOrder["status"]) => {
    switch (status) {
      case "Booked":
        return <Clock className="w-5 h-5" />
      case "In Transit":
        return <Package className="w-5 h-5" />
      case "Out for Delivery":
        return <MapPin className="w-5 h-5" />
      case "Delivered":
        return <CheckCircle className="w-5 h-5" />
      case "Cancelled":
        return <Package className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: DocketOrder["status"]) => {
    switch (status) {
      case "Booked":
        return "bg-blue-500"
      case "In Transit":
        return "bg-purple-500"
      case "Out for Delivery":
        return "bg-orange-500"
      case "Delivered":
        return "bg-green-500"
      case "Cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusDescription = (status: DocketOrder["status"]) => {
    switch (status) {
      case "Booked":
        return "Your shipment has been booked and is being processed."
      case "In Transit":
        return "Your package is on its way to the destination."
      case "Out for Delivery":
        return "Your package is out for delivery and will arrive soon."
      case "Delivered":
        return "Your package has been successfully delivered."
      case "Cancelled":
        return "This shipment has been cancelled."
      default:
        return "Status unknown."
    }
  }

  const maskName = (name: string) => {
    if (!name) return ""
    const parts = name.split(" ")
    if (parts.length === 1) {
      return parts[0].charAt(0) + ". " + parts[0].slice(-1)
    }
    return parts[0].charAt(0) + ". " + parts[parts.length - 1]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Shipment</CardTitle>
          <CardDescription>Enter your docket number to get real-time updates on your shipment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter docket number (e.g., FF123456789)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && trackOrder()}
            />
            <Button onClick={trackOrder} disabled={isLoading}>
              {isLoading ? "Tracking..." : "Track"}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {order && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              Shipment Details
            </CardTitle>
            <CardDescription>Docket Number: {order.docketNumber}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Shipment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Booking Date</h4>
                  <p>{new Date(order.bookingDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Shipment Mode</h4>
                  <p>{order.shipmentMode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Route</h4>
                  <p>
                    {order.shipperCity} → {order.consigneeCity}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Consignee</h4>
                  <p>{maskName(order.consigneeName)}</p>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-lg mb-3">Package Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <h5 className="font-semibold text-sm text-muted-foreground">Number of Packages</h5>
                    <p>{order.numberOfPackages}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <h5 className="font-semibold text-sm text-muted-foreground">Weight</h5>
                    <p>{order.weight} kg</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <h5 className="font-semibold text-sm text-muted-foreground">Contents</h5>
                    <p className="truncate">{order.contents || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <h5 className="font-semibold text-sm text-muted-foreground">Last Updated</h5>
                    <p>{new Date(order.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                <span className="text-sm text-muted-foreground">
                  Updated: {new Date(order.lastUpdated).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{getStatusDescription(order.status)}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
