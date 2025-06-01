"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Car,
  Calendar,
  CreditCard,
  Settings,
  User,
  Bell,
  Search,
  MapPin,
  Star,
  TrendingUp,
  Clock,
  Heart,
  Eye,
  Plus,
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

interface RecentlyViewed {
  id: string
  make: string
  model: string
  year: number
  image: string
  pricePerDay: number
  rating: number
  viewedAt: string
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
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 12,
    activeRentals: 1,
    totalSpent: 2450,
    favoriteVehicles: 5,
    memberSince: "January 2023",
    loyaltyPoints: 1250,
  })

  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewed[]>([
    {
      id: "1",
      make: "BMW",
      model: "M3",
      year: 2023,
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop",
      pricePerDay: 120,
      rating: 4.8,
      viewedAt: "2 hours ago",
    },
    {
      id: "2",
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300&h=200&fit=crop",
      pricePerDay: 89,
      rating: 4.9,
      viewedAt: "1 day ago",
    },
    {
      id: "3",
      make: "Mercedes",
      model: "C-Class",
      year: 2023,
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&h=200&fit=crop",
      pricePerDay: 110,
      rating: 4.7,
      viewedAt: "2 days ago",
    },
  ])

  const [suggestedCars, setSuggestedCars] = useState<SuggestedCar[]>([
    {
      id: "1",
      make: "Audi",
      model: "Q5",
      year: 2023,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=300&h=200&fit=crop",
      pricePerDay: 95,
      rating: 4.6,
      category: "SUV",
      features: ["AWD", "Premium Interior", "Advanced Safety"],
    },
    {
      id: "2",
      make: "Porsche",
      model: "Cayenne",
      year: 2023,
      image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=300&h=200&fit=crop",
      pricePerDay: 180,
      rating: 4.9,
      category: "Luxury SUV",
      features: ["Sport Mode", "Premium Sound", "Panoramic Roof"],
    },
    {
      id: "3",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop",
      pricePerDay: 65,
      rating: 4.5,
      category: "Sedan",
      features: ["Fuel Efficient", "Reliable", "Comfortable"],
    },
  ])

  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([
    {
      id: "booking_1",
      carMake: "BMW",
      carModel: "M3",
      carYear: 2023,
      carImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop",
      startDate: "2024-01-20",
      endDate: "2024-01-25",
      location: "New York, NY",
      totalAmount: 450,
      status: "active",
    },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (userProfile?.created_at) {
      const joinDate = new Date(userProfile.created_at)
      setStats((prev) => ({
        ...prev,
        memberSince: joinDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      }))
    }
  }, [userProfile])

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userProfile?.first_name || "User"}! 👋
              </h1>
              <p className="text-gray-600 mt-2">Here's what's happening with your account today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Booking
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
                  <p className="text-3xl font-bold">${stats.totalSpent}</p>
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
                  <p className="text-3xl font-bold">{stats.loyaltyPoints}</p>
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Image
                              src={booking.carImage || "/placeholder.svg"}
                              alt={`${booking.carMake} ${booking.carModel}`}
                              width={80}
                              height={60}
                              className="rounded-lg object-cover"
                            />
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
                    <Button className="mt-4" onClick={() => router.push("/")}>
                      Browse Cars
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
                      <Image
                        src={car.image || "/placeholder.svg"}
                        alt={`${car.make} ${car.model}`}
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {car.make} {car.model} {car.year}
                          </h3>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm">{car.rating}</span>
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
                      src={userProfile?.profile_image_url || "/placeholder.svg?height=80&width=80"}
                      alt="Profile"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{userProfile?.full_name || "User"}</h3>
                  <p className="text-gray-600 text-sm">{userProfile?.email}</p>
                  <p className="text-gray-500 text-xs mt-2">Member since {stats.memberSince}</p>
                  <Button className="mt-4 w-full" onClick={() => router.push("/profile")}>
                    Edit Profile
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
                        <Image
                          src={car.image || "/placeholder.svg"}
                          alt={`${car.make} ${car.model}`}
                          width={60}
                          height={45}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {car.make} {car.model}
                          </h4>
                          <div className="flex items-center mt-1">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span className="text-xs">{car.rating}</span>
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
                <Button onClick={() => router.push("/")} className="w-full justify-start" variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Cars
                </Button>
                <Button onClick={() => router.push("/profile")} className="w-full justify-start" variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
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
