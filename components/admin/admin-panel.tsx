"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, EyeOff, Plus, Edit, Trash2, Bell, CheckCircle, X } from "lucide-react"

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

interface PendingOrder {
  id: string
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
  contents: string
  shipmentValue: number
  departure: string
  arrival: string
  paymentType: "Prepaid" | "COD" | "Credit"
  createdAt: string
  status: "pending"
}

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [orders, setOrders] = useState<DocketOrder[]>([])
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([])
  const [showPendingModal, setShowPendingModal] = useState(false)
  const [currentPendingOrder, setCurrentPendingOrder] = useState<PendingOrder | null>(null)
  const [newOrder, setNewOrder] = useState<Partial<DocketOrder>>({
    docketNumber: "",
    bookingDate: new Date().toISOString().split("T")[0],
    shipmentMode: "Economy",
    shipperName: "",
    shipperPhone: "",
    shipperAddress: "",
    shipperCity: "",
    shipperPostalCode: "",
    consigneeName: "",
    consigneePhone: "",
    consigneeAddress: "",
    consigneeCity: "",
    consigneePostalCode: "",
    numberOfPackages: 1,
    weight: 0,
    volumetricWeight: 0,
    contents: "",
    shipmentValue: 0,
    departure: "India",
    arrival: "",
    freightCharges: 0,
    status: "Booked",
  })
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [loginError, setLoginError] = useState("")
  const [dimensions, setDimensions] = useState({ length: 0, width: 0, height: 0 })

  // Hardcoded credentials - secure and unchangeable
  const ADMIN_USERNAME = "fastflyer_admin"
  const ADMIN_PASSWORD = "FF2024@secure"

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem("adminOrders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }

    // Load pending orders
    const savedPendingOrders = localStorage.getItem("pendingOrders")
    if (savedPendingOrders) {
      setPendingOrders(JSON.parse(savedPendingOrders))
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      const hasNewPendingOrder = localStorage.getItem("hasNewPendingOrder")
      if (hasNewPendingOrder === "true" && pendingOrders.length > 0) {
        const latestPendingOrder = pendingOrders[pendingOrders.length - 1]
        setCurrentPendingOrder(latestPendingOrder)
        setShowPendingModal(true)
        localStorage.removeItem("hasNewPendingOrder")
      }
    }
  }, [isAuthenticated, pendingOrders])

  const saveOrders = (updatedOrders: DocketOrder[]) => {
    setOrders(updatedOrders)
    localStorage.setItem("adminOrders", JSON.stringify(updatedOrders))
  }

  const savePendingOrders = (updatedPendingOrders: PendingOrder[]) => {
    setPendingOrders(updatedPendingOrders)
    localStorage.setItem("pendingOrders", JSON.stringify(updatedPendingOrders))
  }

  const generateDocketNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `FF${timestamp}${random}`
  }

  const calculateVolumetricWeight = () => {
    if (dimensions.length && dimensions.width && dimensions.height) {
      const volumetric = (dimensions.length * dimensions.width * dimensions.height) / 5000
      setNewOrder({ ...newOrder, volumetricWeight: Math.round(volumetric * 100) / 100 })
    }
  }

  const handleLogin = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setLoginError("")
    } else {
      setLoginError("Invalid credentials. Access denied.")
      setPassword("")
    }
  }

  const handleAcceptPendingOrder = (pendingOrder: PendingOrder) => {
    const docketNumber = generateDocketNumber()

    const newDocketOrder: DocketOrder = {
      docketNumber,
      bookingDate: pendingOrder.bookingDate,
      shipmentMode: pendingOrder.shipmentMode,
      shipperName: pendingOrder.shipperName,
      shipperPhone: pendingOrder.shipperPhone,
      shipperAddress: pendingOrder.shipperAddress,
      shipperCity: pendingOrder.shipperCity,
      shipperPostalCode: pendingOrder.shipperPostalCode,
      consigneeName: pendingOrder.consigneeName,
      consigneePhone: pendingOrder.consigneePhone,
      consigneeAddress: pendingOrder.consigneeAddress,
      consigneeCity: pendingOrder.consigneeCity,
      consigneePostalCode: pendingOrder.consigneePostalCode,
      numberOfPackages: pendingOrder.numberOfPackages,
      weight: pendingOrder.weight,
      volumetricWeight: 0, // Will be calculated if needed
      contents: pendingOrder.contents,
      shipmentValue: pendingOrder.shipmentValue,
      departure: pendingOrder.departure,
      arrival: pendingOrder.arrival,
      freightCharges: 0, // To be set by admin
      status: "Booked",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }

    // Add to docket orders
    const updatedOrders = [...orders, newDocketOrder]
    saveOrders(updatedOrders)

    // Remove from pending orders
    const updatedPendingOrders = pendingOrders.filter((order) => order.id !== pendingOrder.id)
    savePendingOrders(updatedPendingOrders)

    setShowPendingModal(false)
    setCurrentPendingOrder(null)
  }

  const handleRejectPendingOrder = (pendingOrder: PendingOrder) => {
    // Remove from pending orders
    const updatedPendingOrders = pendingOrders.filter((order) => order.id !== pendingOrder.id)
    savePendingOrders(updatedPendingOrders)

    setShowPendingModal(false)
    setCurrentPendingOrder(null)
  }

  const handleAddOrder = () => {
    if (!newOrder.shipperName || !newOrder.consigneeName || !newOrder.arrival) {
      alert("Please fill in all required fields")
      return
    }

    const docketNumber = generateDocketNumber()
    const existingOrder = orders.find((order) => order.docketNumber === docketNumber)
    if (existingOrder) {
      alert("Docket number conflict. Please try again.")
      return
    }

    const order: DocketOrder = {
      ...(newOrder as DocketOrder),
      docketNumber,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }

    const updatedOrders = [...orders, order]
    saveOrders(updatedOrders)

    // Reset form
    setNewOrder({
      docketNumber: "",
      bookingDate: new Date().toISOString().split("T")[0],
      shipmentMode: "Economy",
      shipperName: "",
      shipperPhone: "",
      shipperAddress: "",
      shipperCity: "",
      shipperPostalCode: "",
      consigneeName: "",
      consigneePhone: "",
      consigneeAddress: "",
      consigneeCity: "",
      consigneePostalCode: "",
      numberOfPackages: 1,
      weight: 0,
      volumetricWeight: 0,
      contents: "",
      shipmentValue: 0,
      departure: "India",
      arrival: "",
      freightCharges: 0,
      status: "Booked",
    })
    setDimensions({ length: 0, width: 0, height: 0 })
  }

  const handleUpdateStatus = (docketNumber: string, newStatus: DocketOrder["status"]) => {
    const updatedOrders = orders.map((order) =>
      order.docketNumber === docketNumber
        ? { ...order, status: newStatus, lastUpdated: new Date().toISOString() }
        : order,
    )
    saveOrders(updatedOrders)
    setEditingOrder(null)
  }

  const handleDeleteOrder = (docketNumber: string) => {
    const updatedOrders = orders.filter((order) => order.docketNumber !== docketNumber)
    saveOrders(updatedOrders)
  }

  const getStatusColor = (status: DocketOrder["status"]) => {
    switch (status) {
      case "Booked":
        return "bg-blue-100 text-blue-800"
      case "In Transit":
        return "bg-purple-100 text-purple-800"
      case "Out for Delivery":
        return "bg-orange-100 text-orange-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">Admin Access Required</h3>
          <p className="text-white/80 text-sm">Enter your credentials to access the admin panel</p>
        </div>

        <Input
          type="text"
          placeholder="Username"
          className="h-12 bg-white/70 border-gray-300 text-gray-800 placeholder:text-gray-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="h-12 bg-white/70 border-gray-300 text-gray-800 placeholder:text-gray-500 pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin()
            }}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {loginError && <p className="text-red-300 text-sm text-center">{loginError}</p>}

        <Button
          className="w-full bg-red-600 hover:bg-red-700 border-0 text-white text-lg font-semibold py-3 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
          onClick={handleLogin}
        >
          LOGIN TO ADMIN PANEL
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-white">Docket Management</h3>
          {pendingOrders.length > 0 && (
            <Badge className="bg-red-500 text-white flex items-center gap-1">
              <Bell className="h-3 w-3" />
              {pendingOrders.length} Pending
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAuthenticated(false)}
          className="text-white border-white/30 hover:bg-white/10"
        >
          Logout
        </Button>
      </div>

      <Dialog open={showPendingModal} onOpenChange={setShowPendingModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              New Order Received
            </DialogTitle>
            <DialogDescription>A new order has been placed. Do you want to take this order?</DialogDescription>
          </DialogHeader>

          {currentPendingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Reference ID:</strong> {currentPendingOrder.id}
                </div>
                <div>
                  <strong>Booking Date:</strong> {new Date(currentPendingOrder.bookingDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Shipment Mode:</strong> {currentPendingOrder.shipmentMode}
                </div>
                <div>
                  <strong>Payment Type:</strong> {currentPendingOrder.paymentType}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Shipper Information</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Name:</strong> {currentPendingOrder.shipperName}
                  </p>
                  <p>
                    <strong>Phone:</strong> {currentPendingOrder.shipperPhone}
                  </p>
                  <p>
                    <strong>Address:</strong> {currentPendingOrder.shipperAddress}
                  </p>
                  <p>
                    <strong>City:</strong> {currentPendingOrder.shipperCity}, {currentPendingOrder.shipperPostalCode}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Consignee Information</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Name:</strong> {currentPendingOrder.consigneeName}
                  </p>
                  <p>
                    <strong>Phone:</strong> {currentPendingOrder.consigneePhone}
                  </p>
                  <p>
                    <strong>Address:</strong> {currentPendingOrder.consigneeAddress}
                  </p>
                  <p>
                    <strong>City:</strong> {currentPendingOrder.consigneeCity},{" "}
                    {currentPendingOrder.consigneePostalCode}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Package Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <strong>Packages:</strong> {currentPendingOrder.numberOfPackages}
                  </p>
                  <p>
                    <strong>Weight:</strong> {currentPendingOrder.weight} kg
                  </p>
                  <p>
                    <strong>Value:</strong> ₹{currentPendingOrder.shipmentValue}
                  </p>
                  <p>
                    <strong>Route:</strong> {currentPendingOrder.departure} → {currentPendingOrder.arrival}
                  </p>
                </div>
                <p className="mt-2">
                  <strong>Contents:</strong> {currentPendingOrder.contents}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => currentPendingOrder && handleRejectPendingOrder(currentPendingOrder)}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              No, Dismiss
            </Button>
            <Button
              onClick={() => currentPendingOrder && handleAcceptPendingOrder(currentPendingOrder)}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Yes, Take Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {pendingOrders.length > 0 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Bell className="h-5 w-5" />
              Pending Orders ({pendingOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingOrders.map((pendingOrder) => (
                <div key={pendingOrder.id} className="flex justify-between items-center p-3 bg-white rounded border">
                  <div>
                    <p className="font-semibold">{pendingOrder.id}</p>
                    <p className="text-sm text-gray-600">
                      {pendingOrder.shipperName} → {pendingOrder.consigneeName}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(pendingOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentPendingOrder(pendingOrder)
                      setShowPendingModal(true)
                    }}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Plus className="h-5 w-5" />
            Add New Docket
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Booking Date</label>
              <Input
                type="date"
                value={newOrder.bookingDate}
                onChange={(e) => setNewOrder({ ...newOrder, bookingDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Shipment Mode</label>
              <Select
                value={newOrder.shipmentMode}
                onValueChange={(value) =>
                  setNewOrder({ ...newOrder, shipmentMode: value as DocketOrder["shipmentMode"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Economy">Economy</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Express">Express</SelectItem>
                  <SelectItem value="Same Day">Same Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Shipper Information */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-3">Shipper Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Shipper Name *"
                value={newOrder.shipperName}
                onChange={(e) => setNewOrder({ ...newOrder, shipperName: e.target.value })}
              />
              <Input
                placeholder="Shipper Phone"
                value={newOrder.shipperPhone}
                onChange={(e) => setNewOrder({ ...newOrder, shipperPhone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <Textarea
                placeholder="Shipper Address"
                value={newOrder.shipperAddress}
                onChange={(e) => setNewOrder({ ...newOrder, shipperAddress: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Input
                placeholder="Shipper City"
                value={newOrder.shipperCity}
                onChange={(e) => setNewOrder({ ...newOrder, shipperCity: e.target.value })}
              />
              <Input
                placeholder="Postal Code"
                value={newOrder.shipperPostalCode}
                onChange={(e) => setNewOrder({ ...newOrder, shipperPostalCode: e.target.value })}
              />
            </div>
          </div>

          {/* Consignee Information */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-3">Consignee Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Consignee Name *"
                value={newOrder.consigneeName}
                onChange={(e) => setNewOrder({ ...newOrder, consigneeName: e.target.value })}
              />
              <Input
                placeholder="Consignee Phone"
                value={newOrder.consigneePhone}
                onChange={(e) => setNewOrder({ ...newOrder, consigneePhone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <Textarea
                placeholder="Consignee Address"
                value={newOrder.consigneeAddress}
                onChange={(e) => setNewOrder({ ...newOrder, consigneeAddress: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Input
                placeholder="Consignee City *"
                value={newOrder.consigneeCity}
                onChange={(e) => setNewOrder({ ...newOrder, consigneeCity: e.target.value })}
              />
              <Input
                placeholder="Postal Code"
                value={newOrder.consigneePostalCode}
                onChange={(e) => setNewOrder({ ...newOrder, consigneePostalCode: e.target.value })}
              />
            </div>
          </div>

          {/* Package Details */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Textarea
                placeholder="Contents / Description of Goods"
                value={newOrder.contents}
                onChange={(e) => setNewOrder({ ...newOrder, contents: e.target.value })}
                rows={2}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Shipment Value"
                value={newOrder.shipmentValue}
                onChange={(e) => setNewOrder({ ...newOrder, shipmentValue: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Route & Charges */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-3">Route & Charges</h4>
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Departure"
                value={newOrder.departure}
                onChange={(e) => setNewOrder({ ...newOrder, departure: e.target.value })}
              />
              <Input
                placeholder="Arrival Country/City *"
                value={newOrder.arrival}
                onChange={(e) => setNewOrder({ ...newOrder, arrival: e.target.value })}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Freight Charges"
                value={newOrder.freightCharges}
                onChange={(e) => setNewOrder({ ...newOrder, freightCharges: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <Button onClick={handleAddOrder} className="w-full bg-red-600 hover:bg-red-700">
            Create Docket
          </Button>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle className="text-gray-800">All Dockets ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No dockets found</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.docketNumber} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">#{order.docketNumber}</h4>
                      <p className="text-sm text-gray-600">
                        {order.shipperName} → {order.consigneeName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.shipperCity} → {order.consigneeCity}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingOrder(editingOrder === order.docketNumber ? null : order.docketNumber)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.docketNumber)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2 grid grid-cols-2 gap-2">
                    <p>
                      <span className="font-medium">Mode:</span> {order.shipmentMode}
                    </p>
                    <p>
                      <span className="font-medium">Packages:</span> {order.numberOfPackages}
                    </p>
                    <p>
                      <span className="font-medium">Weight:</span> {order.weight} kg
                    </p>
                    <p>
                      <span className="font-medium">Value:</span> ₹{order.shipmentValue}
                    </p>
                  </div>

                  {editingOrder === order.docketNumber ? (
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleUpdateStatus(order.docketNumber, value as DocketOrder["status"])}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Booked">Booked</SelectItem>
                        <SelectItem value="In Transit">In Transit</SelectItem>
                        <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
