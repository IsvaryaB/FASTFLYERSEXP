"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogOut, Package, Plus } from "lucide-react"

interface Order {
  id: string
  customerName: string
  origin: string
  destination: string
  status: "pending" | "picked-up" | "in-transit" | "delivered" | "cancelled"
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [newOrderId, setNewOrderId] = useState("")
  const [newCustomerName, setNewCustomerName] = useState("")
  const [newOrigin, setNewOrigin] = useState("")
  const [newDestination, setNewDestination] = useState("")
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [newStatus, setNewStatus] = useState<Order["status"]>("pending")
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Check authentication
    const adminAuth = localStorage.getItem("adminAuth")
    if (adminAuth !== "true") {
      router.push("/admin/login")
      return
    }
    setIsAuthenticated(true)

    // Load existing orders from localStorage
    const savedOrders = localStorage.getItem("adminOrders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }

  const addOrder = () => {
    if (!newOrderId || !newCustomerName || !newOrigin || !newDestination) {
      setMessage("Please fill in all fields")
      return
    }

    const newOrder: Order = {
      id: newOrderId,
      customerName: newCustomerName,
      origin: newOrigin,
      destination: newDestination,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    const updatedOrders = [...orders, newOrder]
    setOrders(updatedOrders)
    localStorage.setItem("adminOrders", JSON.stringify(updatedOrders))

    // Reset form
    setNewOrderId("")
    setNewCustomerName("")
    setNewOrigin("")
    setNewDestination("")
    setMessage("Order added successfully!")
  }

  const updateOrderStatus = () => {
    if (!selectedOrderId || !newStatus) {
      setMessage("Please select an order and status")
      return
    }

    const updatedOrders = orders.map((order) =>
      order.id === selectedOrderId ? { ...order, status: newStatus } : order,
    )
    setOrders(updatedOrders)
    localStorage.setItem("adminOrders", JSON.stringify(updatedOrders))
    setMessage("Order status updated successfully!")
    setSelectedOrderId("")
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "picked-up":
        return "bg-blue-500"
      case "in-transit":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage orders and track shipments</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">All Orders</TabsTrigger>
            <TabsTrigger value="add">Add Order</TabsTrigger>
            <TabsTrigger value="update">Update Status</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Management
                </CardTitle>
                <CardDescription>View and manage all orders ({orders.length} total)</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono">{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.origin}</TableCell>
                        <TableCell>{order.destination}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Order
                </CardTitle>
                <CardDescription>Create a new order entry in the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderId">Order ID</Label>
                    <Input
                      id="orderId"
                      placeholder="FF-2024-001"
                      value={newOrderId}
                      onChange={(e) => setNewOrderId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      placeholder="John Doe"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin</Label>
                    <Input
                      id="origin"
                      placeholder="Mumbai, 400001"
                      value={newOrigin}
                      onChange={(e) => setNewOrigin(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      placeholder="Delhi, 110001"
                      value={newDestination}
                      onChange={(e) => setNewDestination(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={addOrder} className="w-full">
                  Add Order
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="update">
            <Card>
              <CardHeader>
                <CardTitle>Update Order Status</CardTitle>
                <CardDescription>Change the status of existing orders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="selectOrder">Select Order</Label>
                  <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an order to update" />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.id} - {order.customerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selectStatus">New Status</Label>
                  <Select value={newStatus} onValueChange={(value: Order["status"]) => setNewStatus(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="picked-up">Picked Up</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={updateOrderStatus} className="w-full">
                  Update Status
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
