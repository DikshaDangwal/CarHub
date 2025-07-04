"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Car,
  Calendar,
  CreditCard,
  Settings,
  User,
  Bell,
  Search,
  Star,
  TrendingUp,
  Clock,
  Heart,
  Eye,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"

interface DashboardStats {
  totalBookings: number
  activeRentals: number
  totalSpent: number
  favoriteVehicles: number
  memberSince: string
  loyaltyPoints: number
}

interface SuggestedCar {
  id: string
  make: string
  model: string
  year: number
  image: string
  pricePerDay: number
  rating: number
  category: string
  features: string[]
}

interface ActiveBooking {
  id: string
  carMake: string
  carModel: string
  carYear: number
  carImage: string
  startDate: string
  endDate: string
  location: string
  totalAmount: number
  status: "active" | "upcoming"
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [dashboardLoading, setDashboardLoading] = useState(true)

  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    activeRentals: 0,
    totalSpent: 0,
    favoriteVehicles: 0,
    memberSince: "",
    loyaltyPoints: 0,
  })

  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])
  const [suggestedCars, setSuggestedCars] = useState<SuggestedCar[]>([])
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && mounted) {
      generateSampleData(user.id)
      setDashboardLoading(false)
    }
  }, [user, mounted])

  const generateSampleData = (userId: string) => {
    // Generate a deterministic "random" number based on user ID
    const hashCode = (str: string) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
      }
      return Math.abs(hash)
    }

    const userHash = hashCode(userId)

    // Set member since date (use user creation date or default)
    const joinDate = user?.created_at ? new Date(user.created_at) : new Date()
    const memberSince = joinDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

    // Generate realistic stats based on user hash
    const totalBookings = (userHash % 20) + 1 // 1-20 bookings
    const activeRentals = userHash % 3 // 0-2 active rentals
    const totalSpent = totalBookings * 150 + (userHash % 1000) // Average $150 per booking + random amount
    const favoriteVehicles = Math.floor(totalBookings * 0.8) // 80% of bookings become favorites
    const loyaltyPoints = totalSpent * 10 // 10 points per dollar spent

    setStats({
      totalBookings,
      activeRentals,
      totalSpent,
      favoriteVehicles,
      loyaltyPoints,
      memberSince,
    })

    // Generate recently viewed cars
    const carBrands = ["BMW", "Tesla", "Mercedes", "Audi", "Porsche", "Toyota", "Honda", "Ford", "Chevrolet", "Lexus"]
    const carModels = {
      BMW: ["M3", "X5", "i8", "5 Series", "3 Series"],
      Tesla: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
      Mercedes: ["C-Class", "E-Class", "S-Class", "GLC", "AMG GT"],
      Audi: ["A4", "Q5", "e-tron", "R8", "A6"],
      Porsche: ["911", "Cayenne", "Taycan", "Macan", "Panamera"],
      Toyota: ["Camry", "RAV4", "Corolla", "Highlander", "Prius"],
      Honda: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey"],
      Ford: ["F-150", "Mustang", "Explorer", "Escape", "Edge"],
      Chevrolet: ["Silverado", "Camaro", "Equinox", "Tahoe", "Malibu"],
      Lexus: ["RX", "ES", "NX", "IS", "GX"],
    }

    const recentlyViewedCars = []
    const viewedBrands = new Set()

    for (let i = 0; i < 3; i++) {
      const brandIndex = (userHash + i) % carBrands.length
      const brand = carBrands[brandIndex]
      viewedBrands.add(brand)

      const modelIndex = (userHash + i * 3) % carModels[brand as keyof typeof carModels].length
      const model = carModels[brand as keyof typeof carModels][modelIndex]

      recentlyViewedCars.push({
        id: `car_${i}`,
        make: brand,
        model: model,
        year: 2023 - (i % 3),
        image: `/placeholder.svg?height=200&width=300`,
        pricePerDay: 80 + (userHash % 100) + i * 10,
        rating: 4.5 + ((i * 0.1) % 0.5),
        viewedAt: i === 0 ? "2 hours ago" : i === 1 ? "1 day ago" : "3 days ago",
      })
    }

    setRecentlyViewed(recentlyViewedCars)

    // Generate suggested cars (from brands not recently viewed)
    const suggestedCarsList = []
    const remainingBrands = carBrands.filter((brand) => !viewedBrands.has(brand))

    for (let i = 0; i < 3; i++) {
      const brandIndex = (userHash + i * 7) % remainingBrands.length
      const brand = remainingBrands[brandIndex] || carBrands[(userHash + i * 11) % carBrands.length]

      const modelIndex = (userHash + i * 5) % carModels[brand as keyof typeof carModels].length
      const model = carModels[brand as keyof typeof carModels][modelIndex]

      const categories = ["SUV", "Sedan", "Luxury", "Sports", "Electric", "Compact"]
      const features = [
        "Leather Seats",
        "Panoramic Roof",
        "Premium Sound",
        "Navigation",
        "Heated Seats",
        "Backup Camera",
        "Bluetooth",
        "Cruise Control",
        "Keyless Entry",
        "Remote Start",
        "AWD",
        "Third Row Seating",
      ]

      // Select 3 random features
      const carFeatures = []
      for (let j = 0; j < 3; j++) {
        const featureIndex = (userHash + i * 3 + j * 5) % features.length
        carFeatures.push(features[featureIndex])
      }

      suggestedCarsList.push({
        id: `suggested_${i}`,
        make: brand,
        model: model,
        year: 2023 - (i % 2),
        image: `/placeholder.svg?height=200&width=300`,
        pricePerDay: 85 + (userHash % 120) + i * 15,
        rating: 4.6 + ((i * 0.1) % 0.4),
        category: categories[(userHash + i * 4) % categories.length],
        features: carFeatures,
      })
    }

    setSuggestedCars(suggestedCarsList)

    // Generate active bookings if there are any
    if (activeRentals > 0) {
      const activeBookingsList = []

      for (let i = 0; i < activeRentals; i++) {
        const brandIndex = (userHash + i * 13) % carBrands.length
        const brand = carBrands[brandIndex]

        const modelIndex = (userHash + i * 17) % carModels[brand as keyof typeof carModels].length
        const model = carModels[brand as keyof typeof carModels][modelIndex]

        const locations = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Miami, FL", "Seattle, WA"]
        const locationIndex = (userHash + i * 7) % locations.length

        // Current date
        const today = new Date()

        // For active booking, start date is in the past, end date is in the future
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - (((userHash + i) % 3) + 1)) // 1-3 days ago

        const endDate = new Date(today)
        endDate.setDate(today.getDate() + (((userHash + i * 3) % 7) + 1)) // 1-7 days from now

        activeBookingsList.push({
          id: `booking_${i}`,
          carMake: brand,
          carModel: model,
          carYear: 2023 - (i % 2),
          carImage: `/placeholder.svg?height=200&width=300`,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          location: locations[locationIndex],
          totalAmount: 100 + (userHash % 400) + i * 50,
          status: "active",
        })
      }

      setActiveBookings(activeBookingsList)
    }
  }

  const getUserDisplayName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(" ")[0]
    }
    if (user?.email) {
      return user.email.split("@")[0]
    }
    return "User"
  }

  if (!mounted) {
    return null
  }

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to view your dashboard.</p>
          <div className="flex flex-col space-y-3">
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/signup">Create an Account</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {getUserDisplayName()}! 👋</h1>
              <p className="text-gray-600 mt-2">Here's what's happening with your account today.</p>
              <p className="text-sm text-gray-500 mt-1">Member since {stats.memberSince}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button asChild>
                <Link href="/cars">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Cars
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                </div>
                <div className="p-3 bg-blue-400 rounded-full">
                  <Car className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Rentals</p>
                  <p className="text-3xl font-bold">{stats.activeRentals}</p>
                </div>
                <div className="p-3 bg-green-400 rounded-full">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Spent</p>
                  <p className="text-3xl font-bold">${stats.totalSpent.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-400 rounded-full">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Loyalty Points</p>
                  <p className="text-3xl font-bold">{stats.loyaltyPoints.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-orange-400 rounded-full">
                  <Star className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Active Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeBookings.length > 0 ? (
                  <div className="space-y-4">
                    {activeBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative w-20 h-16 overflow-hidden rounded-lg flex-shrink-0">
                              <Image
                                src={booking.carImage || "/placeholder.svg"}
                                alt={`${booking.carMake} ${booking.carModel}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {booking.carMake} {booking.carModel} {booking.carYear}
                              </h3>
                              <p className="text-gray-600 flex items-center text-sm">
                                <MapPin className="w-4 h-4 mr-1" />
                                {booking.location}
                              </p>
                              <p className="text-gray-600 flex items-center text-sm">
                                <Clock className="w-4 h-4 mr-1" />
                                {booking.startDate} to {booking.endDate}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">${booking.totalAmount}</div>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No active bookings</p>
                    <Button className="mt-4" asChild>
                      <Link href="/cars">Browse Cars</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recently Viewed Cars */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Recently Viewed Cars
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentlyViewed.map((car) => (
                    <div key={car.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                        <Image
                          src={car.image || "/placeholder.svg"}
                          alt={`${car.make} ${car.model}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {car.make} {car.model} {car.year}
                          </h3>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm">{car.rating.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Viewed {car.viewedAt}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">${car.pricePerDay}/day</div>
                          <Button size="sm" variant="outline" className="mt-2">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* User Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="relative mx-auto h-20 w-20 mb-4">
                    <Image
                      src={user?.user_metadata?.avatar_url || "/placeholder.svg?height=80&width=80"}
                      alt="Profile"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{user?.user_metadata?.full_name || getUserDisplayName()}</h3>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Joined {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                  </p>
                  <Button className="mt-4 w-full" asChild>
                    <Link href="/profile">Edit Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Cars */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Suggested for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestedCars.map((car) => (
                    <div key={car.id} className="border rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={car.image || "/placeholder.svg"}
                            alt={`${car.make} ${car.model}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {car.make} {car.model}
                          </h4>
                          <div className="flex items-center mt-1">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span className="text-xs">{car.rating.toFixed(1)}</span>
                          </div>
                          <div className="text-sm font-bold text-green-600">${car.pricePerDay}/day</div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Suggestions
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/cars">
                    <Search className="w-4 h-4 mr-2" />
                    Browse Cars
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Bookings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
