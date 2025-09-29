"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, Navigation, Building2 } from "lucide-react"

interface Branch {
  id: string
  name: string
  type: "main" | "partner" | "hub"
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  hours: string
  services: string[]
  coordinates?: { lat: number; lng: number }
}

export function BranchDirectory({ initialQuery = "" }: { initialQuery?: string }) {
  const [searchQuery] = useState(initialQuery)
  const [selectedState] = useState<string>("all")
  const [selectedType] = useState<string>("all")

  const branches: Branch[] = [
    {
      id: "trichy-1",
      name: "FastFlyer Trichy Branch",
      type: "main",
      address: "41 Rayyan Complex, Tanjore Road",
      city: "Trichy",
      state: "Tamil Nadu",
      pincode: "620008",
      phone: "+91 86672 94376",
      email: "trichy@fastflyer.com",
      hours: "9:00 AM – 9:00 PM",
      services: ["Express Delivery", "Document Courier"],
    },
  ]

  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      const matchesSearch =
        searchQuery === "" ||
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.pincode.includes(searchQuery)

      const matchesState = selectedState === "all" || branch.state === selectedState
      const matchesType = selectedType === "all" || branch.type === selectedType

      return matchesSearch && matchesState && matchesType
    })
  }, [searchQuery, selectedState, selectedType, branches])

  const getBranchTypeColor = () => "bg-red-600 text-white"

  const getBranchTypeLabel = (type: Branch["type"]) => {
    switch (type) {
      case "main":
        return "Main Branch"
      case "partner":
        return "Partner Location"
      case "hub":
        return "Distribution Hub"
      default:
        return "Branch"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBranches.map((branch) => (
          <Card key={branch.id} className="glass-effect rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{branch.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {branch.city}, {branch.state}
                  </CardDescription>
                </div>
                <Badge className={getBranchTypeColor()}>{getBranchTypeLabel(branch.type)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div className="text-sm">
                    <p>{branch.address}</p>
                    <p>
                      {branch.city}, {branch.state} - {branch.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${branch.phone}`} className="text-sm hover:text-primary">
                    {branch.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{branch.hours}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Navigation className="w-4 h-4 mr-1" />
                  Get Directions
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
