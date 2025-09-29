"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface JoinUsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ApplicationData {
  name: string
  age: string
  contact: string
  email: string // Added email field to ApplicationData interface
  city: string
  skills: string
  submittedAt: string
}

export function JoinUsModal({ isOpen, onClose }: JoinUsModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    email: "", // Added email field to form state
    city: "",
    skills: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const eligibilityCriteria = [
    "Minimum age: 18 years",
    "Valid government ID proof required",
    "Basic Computer knowledge",
    "Ability to work flexible hours",
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.age.trim()) newErrors.age = "Age is required"
    else if (Number.parseInt(formData.age) < 18) newErrors.age = "Must be at least 18 years old"
    if (!formData.contact.trim()) newErrors.contact = "Contact number is required"
    else if (!/^\d{10}$/.test(formData.contact.replace(/\D/g, "")))
      newErrors.contact = "Valid 10-digit phone number required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email address required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.skills.trim()) newErrors.skills = "Skills/Experience is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Save application to localStorage
    const applicationData: ApplicationData = {
      ...formData,
      submittedAt: new Date().toISOString(),
    }

    const existingApplications = JSON.parse(localStorage.getItem("fastflyer_applications") || "[]")
    existingApplications.push(applicationData)
    localStorage.setItem("fastflyer_applications", JSON.stringify(existingApplications))

    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", age: "", contact: "", email: "", city: "", skills: "" }) // Added email to form reset
      setErrors({})
      onClose()
    }, 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Join FastFlyer Team</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {!isSubmitted ? (
              <>
                {/* Eligibility Criteria */}
                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Eligibility Criteria
                  </h3>
                  <ul className="space-y-2">
                    {eligibilityCriteria.map((criteria, index) => (
                      <li key={index} className="text-red-700 flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Application Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`${errors.name ? "border-red-500" : ""}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className={`${errors.age ? "border-red-500" : ""}`}
                      placeholder="Enter your age"
                      min="18"
                      max="65"
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                    <Input
                      type="tel"
                      value={formData.contact}
                      onChange={(e) => handleInputChange("contact", e.target.value)}
                      className={`${errors.contact ? "border-red-500" : ""}`}
                      placeholder="Enter your 10-digit mobile number"
                    />
                    {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`${errors.email ? "border-red-500" : ""}`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={`${errors.city ? "border-red-500" : ""}`}
                      placeholder="Enter your city"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills & Experience *</label>
                    <Textarea
                      value={formData.skills}
                      onChange={(e) => handleInputChange("skills", e.target.value)}
                      className={`${errors.skills ? "border-red-500" : ""} min-h-[100px]`}
                      placeholder="Describe your relevant skills, experience, and why you want to join FastFlyer"
                    />
                    {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                      Submit Application
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Submitted Successfully!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for your interest in joining FastFlyer. We will review your application and contact you
                  soon.
                </p>
                <p className="text-sm text-gray-500">This window will close automatically in a few seconds.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
