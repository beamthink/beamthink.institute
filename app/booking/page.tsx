"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Music, CreditCard, Check } from "lucide-react"
import Link from "next/link"

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedInstrument, setSelectedInstrument] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [lessonType, setLessonType] = useState("")

  const instruments = [
    { id: "piano", name: "Piano", price: 75, description: "Classical and contemporary piano lessons" },
    { id: "guitar", name: "Guitar", price: 65, description: "Acoustic and electric guitar instruction" },
    { id: "viola", name: "Viola", price: 80, description: "Classical viola technique and repertoire" },
    { id: "harp", name: "Harp", price: 90, description: "Celtic and classical harp lessons" },
  ]

  const locations = [
    { id: "home-studio", name: "Home Studio", address: "123 Music Lane, City", available: true },
    { id: "community-center", name: "Community Center", address: "456 Arts Ave, City", available: true },
    { id: "student-home", name: "Student's Home", address: "Your location", available: true, extra: "+$20" },
  ]

  const availableTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

  const lessonPackages = [
    { id: "single", name: "Single Lesson", sessions: 1, price: 75, discount: 0 },
    { id: "package-4", name: "4-Lesson Package", sessions: 4, price: 280, discount: 20 },
    { id: "package-8", name: "8-Lesson Package", sessions: 8, price: 520, discount: 60 },
    { id: "monthly", name: "Monthly Subscription", sessions: "Unlimited", price: 299, discount: 0, subscription: true },
  ]

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleBooking = () => {
    // Simulate booking process
    alert("Booking confirmed! You will receive a confirmation email shortly.")
    window.location.href = "/client/dashboard"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">wlanvi</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-purple-600">
                Home
              </Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-purple-600">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${step > stepNumber ? "bg-purple-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Instrument</span>
            <span>Schedule</span>
            <span>Package</span>
            <span>Payment</span>
          </div>
        </div>

        {/* Step 1: Instrument Selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Instrument</CardTitle>
              <CardDescription>Select the instrument you'd like to learn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {instruments.map((instrument) => (
                  <div
                    key={instrument.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedInstrument === instrument.id
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSelectedInstrument(instrument.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{instrument.name}</h3>
                      <Badge variant="secondary">${instrument.price}/lesson</Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{instrument.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleNext} disabled={!selectedInstrument}>
                  Next: Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Schedule Selection */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Schedule Your Lesson</CardTitle>
              <CardDescription>Choose your preferred date, time, and location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Location</Label>
                <div className="grid gap-3">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedLocation === location.id
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                      onClick={() => setSelectedLocation(location.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{location.name}</h4>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {location.address}
                          </p>
                        </div>
                        {location.extra && <Badge variant="outline">{location.extra}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <Label htmlFor="date" className="text-base font-semibold">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-2"
                />
              </div>

              {/* Time Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Available Times</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="justify-center"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!selectedLocation || !selectedDate || !selectedTime}>
                  Next: Package
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Package Selection */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Package</CardTitle>
              <CardDescription>Select a lesson package that works for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessonPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`p-6 border rounded-lg cursor-pointer transition-all ${
                      lessonType === pkg.id
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setLessonType(pkg.id)}
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        ${pkg.price}
                        {pkg.subscription && <span className="text-base">/month</span>}
                      </div>
                      <p className="text-gray-600 mb-4">
                        {typeof pkg.sessions === "number" ? `${pkg.sessions} lessons` : pkg.sessions}
                      </p>
                      {pkg.discount > 0 && (
                        <Badge variant="secondary" className="mb-2">
                          Save ${pkg.discount}
                        </Badge>
                      )}
                      {pkg.subscription && (
                        <div className="text-sm text-gray-600">
                          <p>• Unlimited lessons</p>
                          <p>• Priority booking</p>
                          <p>• Cancel anytime</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!lessonType}>
                  Next: Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Complete your booking with secure payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Booking Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Instrument:</span>
                    <span className="capitalize">{selectedInstrument}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span>
                      {selectedDate} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span>{locations.find((l) => l.id === selectedLocation)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <span>{lessonPackages.find((p) => p.id === lessonType)?.name}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${lessonPackages.find((p) => p.id === lessonType)?.price}</span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label htmlFor="notes">Special Notes (Optional)</Label>
                  <Textarea id="notes" placeholder="Any special requests or information for your teacher..." rows={3} />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleBooking} className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Complete Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
