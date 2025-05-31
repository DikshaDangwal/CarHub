"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, MapPin, Fuel, Users, AntennaIcon as Transmission } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Car {
  id: number
  make: string
  model: string
  year: number
  price: number
  image: string
  fuel_type: string
  transmission: string
  seats: number
  rating: number
  location: string
  available: boolean
}

const mockCars: Car[] = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2023,
    price: 45,
    image: "/placeholder.svg?height=200&width=300",
    fuel_type: "Hybrid",
    transmission: "Automatic",
    seats: 5,
    rating: 4.8,
    location: "Downtown",
    available: true,
  },
  {
    id: 2,
    make: "BMW",
    model: "X5",
    year: 2023,
    price: 89,
    image: "/placeholder.svg?height=200&width=300",
    fuel_type: "Gasoline",
    transmission: "Automatic",
    seats: 7,
    rating: 4.9,
    location: "Airport",
    available: true,
  },
  {
    id: 3,
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 65,
    image: "/placeholder.svg?height=200&width=300",
    fuel_type: "Electric",
    transmission: "Automatic",
    seats: 5,
    rating: 4.7,
    location: "City Center",
    available: true,
  },
  {
    id: 4,
    make: "Mercedes",
    model: "C-Class",
    year: 2023,
    price: 75,
    image: "/placeholder.svg?height=200&width=300",
    fuel_type: "Gasoline",
    transmission: "Automatic",
    seats: 5,
    rating: 4.8,
    location: "Downtown",
    available: false,
  },
]

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>(mockCars)
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFuelType, setSelectedFuelType] = useState("all")
  const [selectedTransmission, setSelectedTransmission] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  useEffect(() => {
    let filtered = cars

    if (searchTerm) {
      filtered = filtered.filter(
        (car) =>
          car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedFuelType !== "all") {
      filtered = filtered.filter((car) => car.fuel_type === selectedFuelType)
    }

    if (selectedTransmission !== "all") {
      filtered = filtered.filter((car) => car.transmission === selectedTransmission)
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      filtered = filtered.filter((car) => car.price >= min && car.price <= max)
    }

    setFilteredCars(filtered)
  }, [searchTerm, selectedFuelType, selectedTransmission, priceRange, cars])

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect <span className="text-blue-600">Ride</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our extensive collection of premium vehicles. From economy to luxury, find the perfect car for your
            journey.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
              <SelectTrigger>
                <SelectValue placeholder="Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fuel Types</SelectItem>
                <SelectItem value="Gasoline">Gasoline</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTransmission} onValueChange={setSelectedTransmission}>
              <SelectTrigger>
                <SelectValue placeholder="Transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transmissions</SelectItem>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-50">$0 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100-200">$100 - $200</SelectItem>
                <SelectItem value="200-500">$200+</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-blue-600 hover:bg-blue-700">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-600">
            Showing {filteredCars.length} of {cars.length} cars
          </p>
        </motion.div>

        {/* Cars Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {filteredCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <Image
                    src={car.image || "/placeholder.svg"}
                    alt={`${car.make} ${car.model}`}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {!car.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="secondary" className="bg-red-500 text-white">
                        Not Available
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white text-gray-900">⭐ {car.rating}</Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-gray-600">{car.year}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">${car.price}</p>
                      <p className="text-sm text-gray-600">per day</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4" />
                      {car.fuel_type}
                    </div>
                    <div className="flex items-center gap-2">
                      <Transmission className="w-4 h-4" />
                      {car.transmission}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {car.seats} seats
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {car.location}
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={!car.available}>
                    {car.available ? "Book Now" : "Unavailable"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredCars.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-600 text-lg">No cars found matching your criteria.</p>
            <Button
              className="mt-4"
              onClick={() => {
                setSearchTerm("")
                setSelectedFuelType("all")
                setSelectedTransmission("all")
                setPriceRange("all")
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
