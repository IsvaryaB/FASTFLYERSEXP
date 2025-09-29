"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  // Basic Info
  bookingDate: z.string().min(1, "Booking date is required"),
  shipmentMode: z.enum(["Economy", "Standard", "Express", "Same Day"]),

  // Shipper Information
  shipperName: z.string().min(1, "Shipper name is required"),
  shipperPhone: z.string().min(1, "Shipper phone is required"),
  shipperAddress: z.string().min(1, "Shipper address is required"),
  shipperCity: z.string().min(1, "Shipper city is required"),
  shipperPostalCode: z.string().min(1, "Shipper postal code is required"),
  shipperCountry: z.string().min(1, "Shipper country is required"),

  // Consignee Information
  consigneeName: z.string().min(1, "Consignee name is required"),
  consigneePhone: z.string().min(1, "Consignee phone is required"),
  consigneeAddress: z.string().min(1, "Consignee address is required"),
  consigneeCity: z.string().min(1, "Consignee city is required"),
  consigneePostalCode: z.string().min(1, "Consignee postal code is required"),
  consigneeCountry: z.string().min(1, "Consignee country is required"),

  // Package Details (trimmed down)
  contents: z.string().min(1, "Contents / Description of Goods is required"),

  // Route Information
  departure: z.string().min(1, "Departure location is required"),
  arrival: z.string().min(1, "Arrival location is required"),

  // Payment Type
  paymentType: z.enum(["Prepaid", "COD", "Credit"]),
})

interface PendingOrder {
  id: string
  bookingDate: string
  shipmentMode: "Economy" | "Standard" | "Express" | "Same Day"
  shipperName: string
  shipperPhone: string
  shipperAddress: string
  shipperCity: string
  shipperPostalCode: string
  shipperCountry: string
  consigneeName: string
  consigneePhone: string
  consigneeAddress: string
  consigneeCity: string
  consigneePostalCode: string
  consigneeCountry: string
  contents: string
  departure: string
  arrival: string
  paymentType: "Prepaid" | "COD" | "Credit"
  createdAt: string
  status: "pending"
}

export function BookingForm() {
  const router = useRouter()
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      bookingDate: new Date().toISOString().split("T")[0],
      shipmentMode: "Standard",
      shipperName: "",
      shipperPhone: "",
      shipperAddress: "",
      shipperCity: "",
      shipperPostalCode: "",
      shipperCountry: "",
      consigneeName: "",
      consigneePhone: "",
      consigneeAddress: "",
      consigneeCity: "",
      consigneePostalCode: "",
      consigneeCountry: "",
      contents: "",
      departure: "India",
      arrival: "",
      paymentType: "Prepaid",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      const pendingOrderId = `PO${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`

      const pendingOrder = {
        id: pendingOrderId,
        bookingDate: values.bookingDate,
        shipmentMode: values.shipmentMode,
        shipperName: values.shipperName,
        shipperPhone: values.shipperPhone,
        shipperAddress: values.shipperAddress,
        shipperCity: values.shipperCity,
        shipperPostalCode: values.shipperPostalCode,
        shipperCountry: values.shipperCountry,
        consigneeName: values.consigneeName,
        consigneePhone: values.consigneePhone,
        consigneeAddress: values.consigneeAddress,
        consigneeCity: values.consigneeCity,
        consigneePostalCode: values.consigneePostalCode,
        consigneeCountry: values.consigneeCountry,
        contents: values.contents,
        departure: values.departure,
        arrival: values.arrival,
        paymentType: values.paymentType,
        createdAt: new Date().toISOString(),
        status: "pending",
      } as PendingOrder

      const existingPendingOrders = JSON.parse(localStorage.getItem("pendingOrders") || "[]")
      existingPendingOrders.push(pendingOrder)
      localStorage.setItem("pendingOrders", JSON.stringify(existingPendingOrders))

      localStorage.setItem("hasNewPendingOrder", "true")

      setTrackingId(pendingOrderId)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting order:", error)
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-xl bg-card p-8 text-center shadow-2xl glass-effect"
      >
        <h2 className="text-3xl font-bold text-primary gradient-text">Order Submitted!</h2>
        <p className="mt-4 text-lg text-foreground">Your shipment request has been submitted for approval.</p>
        <p className="mt-2 text-xl font-semibold text-accent">Reference ID: {trackingId}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          You will receive a docket number once your order is approved by our team.
        </p>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="mt-6 w-full text-lg hover-lift bg-transparent"
            onClick={() => {
              setIsSubmitted(false)
              setTrackingId(null)
              form.reset()
            }}
          >
            Submit Another Order
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-4xl rounded-xl bg-card p-8 shadow-2xl glass-effect"
    >
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold gradient-text">Book a New Shipment</CardTitle>
        <p className="text-muted-foreground">Fill out the complete details below to book your courier.</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} initial="hidden" animate="show">
                  <FormField
                    control={form.control}
                    name="bookingDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div variants={itemVariants} initial="hidden" animate="show">
                  <FormField
                    control={form.control}
                    name="shipmentMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipment Mode</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select shipment mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Economy">Economy</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Express">Express</SelectItem>
                            <SelectItem value="Same Day">Same Day</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>
            </div>

            {/* Shipper Information */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-4">Shipper Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="shipperName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipper Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter shipper name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipperPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipper Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter shipper phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="shipperAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipper Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter complete shipper address" {...field} className="min-h-[80px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <FormField
                  control={form.control}
                  name="shipperCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipper Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter shipper country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipperCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipper City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter shipper city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipperPostalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipper Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter postal code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Consignee Information */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-4">Consignee Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="consigneeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consignee Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter consignee name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consigneePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consignee Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter consignee phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="consigneeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consignee Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter complete consignee address" {...field} className="min-h-[80px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <FormField
                  control={form.control}
                  name="consigneeCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consignee Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter consignee country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consigneeCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consignee City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter consignee city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consigneePostalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consignee Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter postal code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Package Details */}
            <FormField
              control={form.control}
              name="contents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contents / Description of Goods</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contents / description of goods" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Route & Payment */}
            <div className="pb-6">
              <h3 className="text-xl font-semibold mb-4">Route & Payment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="departure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter departure location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arrival"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter arrival location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Prepaid">Prepaid</SelectItem>
                          <SelectItem value="COD">Cash on Delivery (COD)</SelectItem>
                          <SelectItem value="Credit">Credit</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="gradient-primary w-full text-lg hover-lift">
              Submit Order for Approval
            </Button>
          </form>
        </Form>
      </CardContent>
    </motion.div>
  )
}
