"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, Filter, Grid, List, Star, Heart, Fuel, Settings, Users, MapPin, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import CarDetailsModal from "./CarDetailsModal"

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

const demoCarData: Car[] = [
  {
    id: "1",
    make: "BMW",
    model: "M3",
    year: 2023,
    type: "Sedan",
    pricePerDay: 120,
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 5,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
    rating: 4.8,
    reviews: 124,
    features: ["Sport Mode", "Premium Sound", "Navigation", "Leather Seats"],
    location: "New York, NY",
    available: true,
  },
  {
    id: "2",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    type: "Electric",
    pricePerDay: 89,
    fuelType: "Electric",
    transmission: "Automatic",
    seats: 5,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop",
    rating: 4.9,
    reviews: 89,
    features: ["Autopilot", "Supercharging", "Premium Interior", "Glass Roof"],
    location: "Los Angeles, CA",
    available: true,
  },
  {
    id: "3",
    make: "Mercedes",
    model: "C-Class",
    year: 2023,
    type: "Luxury",
    pricePerDay: 110,
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 5,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop",
    rating: 4.7,
    reviews: 156,
    features: ["Luxury Interior", "Advanced Safety", "Premium Sound", "Ambient Lighting"],
    location: "Miami, FL",
    available: true,
  },
  {
    id: "4",
    make: "Audi",
    model: "Q5",
    year: 2023,
    type: "SUV",
    pricePerDay: 95,
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 7,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop",
    rating: 4.6,
    reviews: 98,
    features: ["AWD", "Panoramic Roof", "Premium Interior", "Cargo Space"],
    location: "Chicago, IL",
    available: true,
  },
  {
    id: "5",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    type: "Sedan",
    pricePerDay: 65,
    fuelType: "Hybrid",
    transmission: "Automatic",
    seats: 5,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop",
    rating: 4.5,
    reviews: 203,
    features: ["Fuel Efficient", "Reliable", "Safety Features", "Spacious"],
    location: "Seattle, WA",
    available: true,
  },
  {
    id: "6",
    make: "Porsche",
    model: "Cayenne",
    year: 2023,
    type: "Luxury",
    pricePerDay: 180,
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 5,
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=250&fit=crop",
    rating: 4.9,
    reviews: 67,
    features: ["Sport Mode", "Premium Sound", "Panoramic Roof", "Performance"],
    location: "San Francisco, CA",
    available: false,
  },
  {
    id: "7",
    make: "Honda",
    model: "Civic",
    year: 2023,
    type: "Hatchback",
    pricePerDay: 55,
    fuelType: "Gasoline",
    transmission: "Manual",
    seats: 5,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=250&fit=crop",
    rating: 4.4,
    reviews: 145,
    features: ["Fuel Efficient", "Compact", "Reliable", "Manual Transmission"],
    location: "Austin, TX",
    available: true,
  },
  {
    id: "8",
    make: "Lamborghini",
    model: "Huracan",
    year: 2023,
    type: "Coupe",
    pricePerDay: 350,
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 2,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop",
    rating: 5.0,
    reviews: 23,
    features: ["Supercar", "Track Mode", "Carbon Fiber", "V10 Engine"],
    location: "Las Vegas, NV",
    available: true,
  },
]

export default function CarCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("All")
  const [selectedFuelType, setSelectedFuelType] = useState<string>("All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 400])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"price" | "rating" | "name">("price")
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const carTypes = ["All", "SUV", "Sedan", "Hatchback", "Coupe", "Convertible", "Electric", "Luxury"]
  const fuelTypes = ["All", "Gasoline", "Electric", "Hybrid", "Diesel"]

  const filteredAndSortedCars = useMemo(() => {
    const filtered = demoCarData.filter((car) => {
      const matchesSearch =
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === "All" || car.type === selectedType
      const matchesFuelType = selectedFuelType === "All" || car.fuelType === selectedFuelType
      const matchesPrice = car.pricePerDay >= priceRange[0] && car.pricePerDay <= priceRange[1]

      return matchesSearch && matchesType && matchesFuelType && matchesPrice
    })

    // Sort cars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.pricePerDay - b.pricePerDay
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.make.localeCompare(b.make)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedType, selectedFuelType, priceRange, sortBy])

  const toggleFavorite = (carId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add cars to your favorites.",
        variant: "destructive",
      })
      return
    }
    setFavorites((prev) => (prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]))
    toast({
      title: favorites.includes(carId) ? "Removed from favorites" : "Added to favorites",
      description: favorites.includes(carId)
        ? "Car removed from your favorites list."
        : "Car added to your favorites list.",
    })
  }

  const handleViewDetails = (car: Car) => {
    setSelectedCar(car)
    setIsModalOpen(true)
  }

  const handleBookNow = (car: Car) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book a car.",
        variant: "destructive",
      })
      router.push("/auth/signin")
      return
    }

    if (!car.available) {
      toast({
        title: "Car unavailable",
        description: "This car is currently not available for booking.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically redirect to a booking page or open a booking modal
    toast({
      title: "Booking initiated",
      description: `Starting booking process for ${car.make} ${car.model}`,
    })

    // For demo purposes, we'll just show a success message
    // In a real app, you'd redirect to a booking page
    router.push(`/booking?car=${car.id}`)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedType("All")
    setSelectedFuelType("All")
    setPriceRange([0, 400])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Car Catalog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover our premium collection of vehicles. From luxury sedans to electric cars, find the perfect ride for
          your next adventure.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Cars</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by make or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Car Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Car Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {carTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Fuel Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
            <select
              value={selectedFuelType}
              onChange={(e) => setSelectedFuelType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <input
              type="range"
              min="0"
              max="400"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-4">
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "price" | "rating" | "name")}
                className="p-1 border border-gray-300 rounded text-sm"
              >
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow" : ""}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing {filteredAndSortedCars.length} of {demoCarData.length} cars
        </p>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {searchTerm && `"${searchTerm}"`}
            {selectedType !== "All" && ` • ${selectedType}`}
            {selectedFuelType !== "All" && ` • ${selectedFuelType}`}
          </span>
        </div>
      </div>

      {/* Car Grid/List */}
      {filteredAndSortedCars.length > 0 ? (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredAndSortedCars.map((car) => (
            <Card
              key={car.id}
              className={`overflow-hidden hover:shadow-lg transition-shadow ${
                !car.available ? "opacity-60" : ""
              } ${viewMode === "list" ? "flex" : ""}`}
            >
              <div className={viewMode === "list" ? "flex w-full" : ""}>
                <div className={`relative ${viewMode === "list" ? "w-48 h-32" : "h-48"}`}>
                  <Image
                    src={car.image || "/placeholder.svg"}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(car.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(car.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                      }`}
                    />
                  </button>
                  {!car.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="secondary">Not Available</Badge>
                    </div>
                  )}
                  <Badge className="absolute bottom-2 left-2 bg-blue-600">{car.type}</Badge>
                </div>

                <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className={viewMode === "list" ? "flex justify-between h-full" : ""}>
                    <div className={viewMode === "list" ? "flex-1" : ""}>
                      <h3 className="font-semibold text-lg mb-1">
                        {car.make} {car.model} {car.year}
                      </h3>
                      <div className="flex items-center mb-2">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{car.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({car.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {car.location}
                      </div>

                      <div className={`grid grid-cols-2 gap-2 text-sm ${viewMode === "list" ? "mb-0" : "mb-3"}`}>
                        <div className="flex items-center">
                          <Fuel className="w-4 h-4 mr-1 text-gray-400" />
                          {car.fuelType}
                        </div>
                        <div className="flex items-center">
                          <Settings className="w-4 h-4 mr-1 text-gray-400" />
                          {car.transmission}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-gray-400" />
                          {car.seats} seats
                        </div>
                      </div>

                      {viewMode === "list" && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {car.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={`${viewMode === "list" ? "text-right ml-4" : "mt-3"}`}>
                      <div className="text-2xl font-bold text-green-600 mb-2">${car.pricePerDay}/day</div>
                      <div className="space-y-2">
                        <Button className="w-full" disabled={!car.available} onClick={() => handleBookNow(car)}>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {car.available ? "Book Now" : "Unavailable"}
                        </Button>
                        <Button variant="outline" className="w-full" size="sm" onClick={() => handleViewDetails(car)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </div>
      )}

      {/* Car Details Modal */}
      <CarDetailsModal
        car={selectedCar}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCar(null)
        }}
        onBook={handleBookNow}
      />
    </div>
  )
}
