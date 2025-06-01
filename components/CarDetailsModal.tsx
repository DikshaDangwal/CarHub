"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Heart, Fuel, Settings, Users, MapPin, Calendar, CreditCard, Shield, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface Car {
  id: string
  make: string
  model: string
  year: number
  type: "SUV" | "Sedan" | "Hatchback" | "Coupe" | "Convertible" | "Electric" | "Luxury"
  pricePerDay: number
  fuelType: "Gasoline" | "Electric" | "Hybrid" | "Diesel"
  transmission: "Automatic" | "Manual"
  seats: number
  image: string
  rating: number
  reviews: number
  features: string[]
  location: string
  available: boolean
}

interface CarDetailsModalProps {
  car: Car | null
  isOpen: boolean
  onClose: () => void
  onBook: (car: Car) => void
}

export default function CarDetailsModal({ car, isOpen, onClose, onBook }: CarDetailsModalProps) {
  const [selectedDates, setSelectedDates] = useState({ pickup: "", dropoff: "" })
  const [isFavorite, setIsFavorite] = useState(false)

  if (!car) return null

  const handleBookNow = () => {
    onBook(car)
    onClose()
  }

  const calculateTotal = () => {
    if (!selectedDates.pickup || !selectedDates.dropoff) return 0
    const pickup = new Date(selectedDates.pickup)
    const dropoff = new Date(selectedDates.dropoff)
    const days = Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days * car.pricePerDay : 0
  }

  const totalDays = calculateTotal() / car.pricePerDay || 1
  const totalPrice = calculateTotal() || car.pricePerDay

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {car.make} {car.model} {car.year}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Images and Details */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src={car.image || "/placeholder.svg"}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              </button>
              <Badge className="absolute bottom-3 left-3 bg-blue-600">{car.type}</Badge>
            </div>

            {/* Car Specifications */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Fuel className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{car.fuelType}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{car.transmission}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{car.seats} seats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{car.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature, index) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rating and Reviews */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3">Rating & Reviews</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span className="text-lg font-semibold">{car.rating}</span>
                  </div>
                  <span className="text-gray-500">({car.reviews} reviews)</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Verified reviews</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Top rated vehicle</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-4">
            {/* Pricing */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600">${car.pricePerDay}</div>
                  <div className="text-gray-500">per day</div>
                </div>

                {!car.available && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-800 text-sm font-medium">This vehicle is currently unavailable</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Date Selection */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3">Select Dates</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        value={selectedDates.pickup}
                        onChange={(e) => setSelectedDates((prev) => ({ ...prev, pickup: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        value={selectedDates.dropoff}
                        onChange={(e) => setSelectedDates((prev) => ({ ...prev, dropoff: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        min={selectedDates.pickup || new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            {selectedDates.pickup && selectedDates.dropoff && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-3">Booking Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Daily rate</span>
                      <span>${car.pricePerDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Number of days</span>
                      <span>{totalDays}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">${totalPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleBookNow}
                className="w-full"
                size="lg"
                disabled={!car.available || !selectedDates.pickup || !selectedDates.dropoff}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {car.available ? "Book Now" : "Unavailable"}
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Heart className="w-4 h-4 mr-2" />
                Add to Favorites
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Free cancellation up to 24 hours before pickup</p>
              <p>• Comprehensive insurance included</p>
              <p>• 24/7 roadside assistance</p>
              <p>• Fuel policy: Return with same level</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
