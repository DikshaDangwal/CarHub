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
  LogOut,
  Bell,
  Search,
  MapPin,
  Star,
  Trash2,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalBookings: number
  activeRentals: number
  totalSpent: number
  favoriteVehicles: number
  memberSince: string
  loyaltyPoints: number
}

interface Activity {
  id: string
  type: "booking" | "payment" | "favorite" | "review" | "profile"
  description: string
  timestamp: string
  icon: any
  color: string
}

interface ActiveRental {
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

interface FavoriteCar {
  id: string
  make: string
  model: string
  year: number
  image: string
  pricePerDay: number
  rating: number
  location: string
}

export default function Dashboard() {
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 12,
    activeRentals: 1,
    totalSpent: 2450,
    favoriteVehicles: 5,
    memberSince: "January 2023",
    loyaltyPoints: 1250,
  })

  const [recentActivity, setRecentActivity] = useState<Activity[]>([
    {
      id: "1",
      type: "booking",
      description: "Booked BMW M3 for weekend trip",
      timestamp: "2 hours ago",
      icon: Car,
      color: "text-blue-600",
    },
    {
      id: "2",
      type: "favorite",
      description: "Added Tesla Model 3 to favorites",
      timestamp: "1 day ago",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      id: "3",
      type: "payment",
      description: "Payment processed for Mercedes rental",
      timestamp: "3 days ago",
      icon: CreditCard,
      color: "text-green-600",
    },
    {
      id: "4",
      type: "review",
      description: "Left review for Audi Q5 rental",
      timestamp: "1 week ago",
      icon: Star,
      color: "text-purple-600",
    },
  ])

  const [activeRentals, setActiveRentals] = useState<ActiveRental[]>([
    {
      id: "rental_1",
      carMake: "BMW",
      carModel: "M3",
      carYear: 2023,
      carImage: "/placeholder.svg?height=100&width=150",
      startDate: "2024-01-20",
      endDate: "2024-01-25",
      location: "New York, NY",
      totalAmount: 450,
      status: "active",
    },
  ])

  const [favoriteCars, setFavoriteCars] = useState<FavoriteCar[]>([
    {
      id: "fav_1",
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      image: "/placeholder.svg?height=100&width=150",
      pricePerDay: 89,
      rating: 4.8,
      location: "Los Angeles, CA",
    },
    {
      id: "fav_2",
      make: "Mercedes",
      model: "C-Class",
      year: 2023,
      image: "/placeholder.svg?height=100&width=150",
      pricePerDay: 120,
      rating: 4.9,
      location: "Miami, FL",
    },
  ])

  useEffect(() => {
    setMounted(true)
    const checkAuth = () => {
      const mockUser = {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        memberSince: "2023",
        totalBookings: 12,
        favoriteVehicles: 5,
        totalSpent: 2450,
      }
      setUser(mockUser)
      setLoading(false)
    }

    const timer = setTimeout(checkAuth, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSignOut = () => {
    setUser(null)
    router.push("/")
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    })
  }

  const handleRemoveFavorite = (id: string) => {
    setFavoriteCars(favoriteCars.filter((car) => car.id !== id))
    setStats({ ...stats, favoriteVehicles: stats.favoriteVehicles - 1 })
    toast({
      title: "Removed from Favorites",
      description: "Car has been removed from your favorites.",
    })
  }

  const handleExtendRental = (id: string) => {
    toast({
      title: "Rental Extension",
      description: "Rental extension request has been submitted.",
    })
  }

  const handleCancelRental = (id: string) => {
    setActiveRentals(activeRentals.filter((rental) => rental.id !== id))
    setStats({ ...stats, activeRentals: stats.activeRentals - 1 })
    toast({
      title: "Rental Cancelled",
      description: "Your rental has been successfully cancelled.",
    })
  }

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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard</p>
          <Button onClick={() => router.push("/auth/signin")} className="w-full">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-600">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Rentals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeRentals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalSpent}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.loyaltyPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rentals">Active Rentals</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.slice(0, 4).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                          <activity.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Active Rentals Tab */}
          <TabsContent value="rentals">
            <Card>
              <CardHeader>
                <CardTitle>Active Rentals</CardTitle>
              </CardHeader>
              <CardContent>
                {activeRentals.length > 0 ? (
                  <div className="space-y-4">
                    {activeRentals.map((rental) => (
                      <div key={rental.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Image
                              src={rental.carImage || "/placeholder.svg"}
                              alt={`${rental.carMake} ${rental.carModel}`}
                              width={150}
                              height={100}
                              className="rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-lg">
                                {rental.carMake} {rental.carModel} {rental.carYear}
                              </h3>
                              <p className="text-gray-600 flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {rental.location}
                              </p>
                              <p className="text-gray-600 flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {rental.startDate} to {rental.endDate}
                              </p>
                              <Badge className="mt-2">
                                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">${rental.totalAmount}</div>
                            <div className="space-x-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => handleExtendRental(rental.id)}>
                                Extend
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleCancelRental(rental.id)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No active rentals</p>
                    <Button className="mt-4" onClick={() => router.push("/")}>
                      Browse Cars
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Cars</CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteCars.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoriteCars.map((car) => (
                      <div key={car.id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={car.image || "/placeholder.svg"}
                            alt={`${car.make} ${car.model}`}
                            width={150}
                            height={100}
                            className="rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {car.make} {car.model} {car.year}
                            </h3>
                            <p className="text-gray-600 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {car.location}
                            </p>
                            <div className="flex items-center mt-1">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              <span className="text-sm">{car.rating}</span>
                            </div>
                            <div className="text-lg font-bold text-green-600 mt-2">${car.pricePerDay}/day</div>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRemoveFavorite(car.id)}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No favorite cars yet</p>
                    <Button className="mt-4" onClick={() => router.push("/")}>
                      Browse Cars
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className={`p-3 rounded-full bg-gray-100 ${activity.color}`}>
                        <activity.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
