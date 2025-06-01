"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Calendar, CreditCard, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

// This would typically come from your database
const getCarById = (id: string) => {
  const cars = [
    {
      id: "1",
      make: "BMW",
      model: "M3",
      year: 2023,
      pricePerDay: 120,
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
    },
    {
      id: "2",
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      pricePerDay: 89,
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop",
    },
    // Add other cars...
  ]
  return cars.find((car) => car.id === id)
}

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, userProfile } = useAuth()
  const { toast } = useToast()

  const carId = searchParams.get("car")
  const [car, setCar] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [bookingData, setBookingData] = useState({
    pickupDate: "",
    dropoffDate: "",
    pickupLocation: "",
    dropoffLocation: "",
    driverLicense: "",
    emergencyContact: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    if (carId) {
      const foundCar = getCarById(carId)
      setCar(foundCar)
    }
  }, [carId, user, router])

  const calculateTotal = () => {
    if (!bookingData.pickupDate || !bookingData.dropoffDate || !car) return 0
    const pickup = new Date(bookingData.pickupDate)
    const dropoff = new Date(bookingData.dropoffDate)
    const days = Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days * car.pricePerDay : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Here you would typically send the booking data to your backend
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      toast({
        title: "Booking confirmed!",
        description: "Your car rental has been successfully booked. Check your email for confirmation.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Car not found</h2>
          <Button onClick={() => router.push("/cars")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cars
          </Button>
        </div>
      </div>
    )
  }

  const totalDays = calculateTotal() / car.pricePerDay || 1
  const totalPrice = calculateTotal() || car.pricePerDay

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">Fill in the details below to confirm your car rental</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={userProfile?.first_name || ""} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={userProfile?.last_name || ""} disabled className="bg-gray-50" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={userProfile?.email || ""} disabled className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={userProfile?.phone || ""} disabled className="bg-gray-50" />
                  </div>
                </CardContent>
              </Card>

              {/* Rental Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Rental Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickupDate">Pickup Date</Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        value={bookingData.pickupDate}
                        onChange={(e) => setBookingData((prev) => ({ ...prev, pickupDate: e.target.value }))}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dropoffDate">Drop-off Date</Label>
                      <Input
                        id="dropoffDate"
                        type="date"
                        value={bookingData.dropoffDate}
                        onChange={(e) => setBookingData((prev) => ({ ...prev, dropoffDate: e.target.value }))}
                        min={bookingData.pickupDate || new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickupLocation">Pickup Location</Label>
                      <Input
                        id="pickupLocation"
                        placeholder="Enter pickup address"
                        value={bookingData.pickupLocation}
                        onChange={(e) => setBookingData((prev) => ({ ...prev, pickupLocation: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dropoffLocation">Drop-off Location</Label>
                      <Input
                        id="dropoffLocation"
                        placeholder="Enter drop-off address"
                        value={bookingData.dropoffLocation}
                        onChange={(e) => setBookingData((prev) => ({ ...prev, dropoffLocation: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="driverLicense">Driver's License Number</Label>
                    <Input
                      id="driverLicense"
                      placeholder="Enter your driver's license number"
                      value={bookingData.driverLicense}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, driverLicense: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      placeholder="Emergency contact phone number"
                      value={bookingData.emergencyContact}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, emergencyContact: e.target.value }))}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Car Details */}
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                    <img
                      src={car.image || "/placeholder.svg"}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-gray-600">{car.year}</p>
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Daily rate</span>
                    <span>${car.pricePerDay}</span>
                  </div>
                  {bookingData.pickupDate && bookingData.dropoffDate && (
                    <>
                      <div className="flex justify-between">
                        <span>Number of days</span>
                        <span>{totalDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes & fees</span>
                        <span>${Math.round(totalPrice * 0.1)}</span>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">
                    $
                    {bookingData.pickupDate && bookingData.dropoffDate
                      ? totalPrice + Math.round(totalPrice * 0.1)
                      : car.pricePerDay}
                  </span>
                </div>

                {/* Additional Info */}
                <div className="text-sm text-gray-600 space-y-1 pt-4">
                  <p>• Free cancellation up to 24 hours</p>
                  <p>• Comprehensive insurance included</p>
                  <p>• 24/7 roadside assistance</p>
                  <p>• Fuel policy: Return with same level</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
