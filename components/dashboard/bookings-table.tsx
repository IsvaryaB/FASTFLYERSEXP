"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type BookingStatus = "Pending" | "In Transit" | "Out for Delivery" | "Delivered" | "Cancelled"

interface Booking {
  id: string
  trackingId: string
  customerName: string
  origin: string
  destination: string
  status: BookingStatus
  bookingDate: string
  serviceSpeed: string
}

const mockBookings: Booking[] = [
  {
    id: "1",
    trackingId: "ABC1234567",
    customerName: "Alice Smith",
    origin: "New York",
    destination: "Los Angeles",
    status: "In Transit",
    bookingDate: "2025-09-20",
    serviceSpeed: "Express",
  },
  {
    id: "2",
    trackingId: "DEF9876543",
    customerName: "Bob Johnson",
    origin: "London",
    destination: "Paris",
    status: "Delivered",
    bookingDate: "2025-09-18",
    serviceSpeed: "Standard",
  },
  {
    id: "3",
    trackingId: "GHI1122334",
    customerName: "Charlie Brown",
    origin: "Berlin",
    destination: "Rome",
    status: "Out for Delivery",
    bookingDate: "2025-09-24",
    serviceSpeed: "Same Day",
  },
  {
    id: "4",
    trackingId: "JKL5566778",
    customerName: "Diana Prince",
    origin: "Tokyo",
    destination: "Seoul",
    status: "Cancelled",
    bookingDate: "2025-09-26",
    serviceSpeed: "Express",
  },
  {
    id: "5",
    trackingId: "MNO9988776",
    customerName: "Eve Adams",
    origin: "Sydney",
    destination: "Auckland",
    status: "Pending",
    bookingDate: "2025-09-28",
    serviceSpeed: "Standard",
  },
]

export function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "All">("All")
  const [filterDate, setFilterDate] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")

  const handleStatusChange = (value: BookingStatus | "All") => {
    setFilterStatus(value)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleUpdateStatus = (id: string, newStatus: BookingStatus) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) => (booking.id === id ? { ...booking, status: newStatus } : booking)),
    )
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filterStatus === "All" || booking.status === filterStatus
    const matchesDate = !filterDate || booking.bookingDate === filterDate
    const matchesSearch =
      !searchTerm ||
      booking.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesDate && matchesSearch
  })

  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500 hover:bg-green-600"
      case "In Transit":
        return "bg-blue-500 hover:bg-blue-600"
      case "Out for Delivery":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Cancelled":
        return "bg-destructive hover:bg-destructive/80"
      case "Pending":
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="rounded-xl bg-card p-6 shadow-2xl glass-effect"
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold gradient-text">All Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mb-6 flex flex-col gap-4 md:flex-row md:items-center"
        >
          <motion.div
            variants={itemVariants}
            whileFocus={{ scale: 1.01 }}
            whileHover={{ scale: 1.01 }}
            className="flex-1"
          >
            <Input
              placeholder="Search by ID or Customer"
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 rounded-lg border-2 bg-background/80 px-4 text-foreground shadow-sm"
            />
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }}>
            <Select onValueChange={handleStatusChange} value={filterStatus}>
              <SelectTrigger className="w-[180px] rounded-lg border-2 bg-background/80 shadow-sm">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div variants={itemVariants} whileFocus={{ scale: 1.01 }} whileHover={{ scale: 1.01 }}>
            <Input
              type="date"
              value={filterDate}
              onChange={handleDateChange}
              className="w-[180px] rounded-lg border-2 bg-background/80 px-4 text-foreground shadow-sm"
            />
          </motion.div>
        </motion.div>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.5, duration: 0.5 }}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(var(--muted), 0.5)" }}
                >
                  <TableCell className="font-medium">{booking.trackingId}</TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>{booking.origin}</TableCell>
                  <TableCell>{booking.destination}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                  </TableCell>
                  <TableCell>{booking.bookingDate}</TableCell>
                  <TableCell>{booking.serviceSpeed}</TableCell>
                  <TableCell>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Select
                        onValueChange={(value: BookingStatus) => handleUpdateStatus(booking.id, value)}
                        value={booking.status}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOrder.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredBookings.length === 0 && (
          <p className="mt-4 text-center text-muted-foreground">No bookings found matching your criteria.</p>
        )}
      </CardContent>
    </motion.div>
  )
}

const statusOrder: BookingStatus[] = ["Pending", "In Transit", "Out for Delivery", "Delivered", "Cancelled"]
