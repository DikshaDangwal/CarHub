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
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"

interface DashboardStats {
  totalBookings: number
  activeRentals: number
  totalSpent: number
  favoriteVehicles: number
  memberSince: string
  loyaltyPoints: number
}

interface RecentActivity {
  id: string
  type: "booking" | "view" | "favorite"
  carMake: string
  carModel: string
  carYear: number
  timestamp: string
  amount?: number
}

export default function Dashboard() {
  const { user, userProfile, loading } = useAuth()
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
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (userProfile) {
      // Calculate member since date
      const joinDate = new Date(userProfile.created_at)
      const memberSince = joinDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })

      // Fetch user statistics
      fetchUserStats()

      setStats((prev) => ({
        ...prev,
        memberSince,
      }))
    }
  }, [userProfile])

  const fetchUserStats = async () => {
    if (!user) return

    try {
      setDashboardLoading(true)

      // Fetch bookings count (you can implement this table later)
      // For now, we'll use sample data based on user creation date
      const accountAge = userProfile?.created_at
        ? Math.floor((Date.now() - new Date(userProfile.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0

      // Generate realistic stats based on account age
      const totalBookings = Math.max(0, Math.floor(accountAge / 30) * 2) // 2 bookings per month
      const activeRentals = Math.random() > 0.7 ? 1 : 0 // 30% chance of active rental
      const totalSpent = totalBookings * 150 + Math.floor(Math.random() * 500) // Average $150 per booking
      const favoriteVehicles = Math.floor(totalBookings * 0.8) // 80% of bookings become favorites
      const loyaltyPoints = totalSpent * 10 // 10 points per dollar spent

      setStats((prev) => ({
        ...prev,
        totalBookings,
        activeRentals,
        totalSpent,
        favoriteVehicles,
        loyaltyPoints,
      }))

      // Generate recent activity
      const activities: RecentActivity[] = []
      for (let i = 0; i < Math.min(5, totalBookings + 3); i++) {
        const types: ("booking" | "view" | "favorite")[] = ["booking", "view", "favorite"]
        const cars = [
          { make: "BMW", model: "M3", year: 2023 },
          { make: "Tesla", model: "Model 3", year: 2023 },
          { make: "Mercedes", model: "C-Class", year: 2023 },
          { make: "Audi", model: "Q5", year: 2023 },
          { make: "Porsche", model: "Cayenne", year: 2023 },
        ]

        const randomCar = cars[Math.floor(Math.random() * cars.length)]
        const randomType = types[Math.floor(Math.random() * types.length)]
        const daysAgo = Math.floor(Math.random() * 30)

        activities.push({
          id: `activity_${i}`,
          type: randomType,
          carMake: randomCar.make,
          carModel: randomCar.model,
          carYear: randomCar.year,
          timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
          amount: randomType === "booking" ? Math.floor(Math.random() * 300) + 100 : undefined,
        })
      }

      setRecentActivity(activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setDashboardLoading(false)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return time.toLocaleDateString()
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="w-4 h-4 text-green-600" />
      case "view":
        return <Eye className="w-4 h-4 text-blue-600" />
      case "favorite":
        return <Heart className="w-4 h-4 text-red-600" />
      default:
        return <Car className="w-4 h-4 text-gray-600" />
    }
  }

  if (!mounted) {
    return null
  }

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {userProfile.first_name || userProfile.full_name || "User"}! 👋
                </h1>
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
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-white rounded-full">{getActivityIcon(activity.type)}</div>
                            <div>
                              <h3 className="font-medium">
                                {activity.type === "booking" && "Booked "}
                                {activity.type === "view" && "Viewed "}
                                {activity.type === "favorite" && "Favorited "}
                                {activity.carMake} {activity.carModel} {activity.carYear}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatTimeAgo(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                          {activity.amount && (
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">${activity.amount}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No recent activity</p>
                      <Button className="mt-4" asChild>
                        <Link href="/cars">Start Browsing Cars</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Account Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
                        <p className="text-lg font-semibold text-green-600">
                          {userProfile.email_verified ? "Verified" : "Pending Verification"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Favorite Vehicles</h3>
                        <p className="text-lg font-semibold">{stats.favoriteVehicles} cars</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Average Booking</h3>
                        <p className="text-lg font-semibold">
                          ${stats.totalBookings > 0 ? Math.round(stats.totalSpent / stats.totalBookings) : 0}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Next Reward</h3>
                        <p className="text-lg font-semibold">{Math.max(0, 10000 - stats.loyaltyPoints)} points away</p>
                      </div>
                    </div>
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
                        src={userProfile.profile_image_url || "/placeholder.svg?height=80&width=80"}
                        alt="Profile"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg">{userProfile.full_name || "User"}</h3>
                    <p className="text-gray-600 text-sm">{userProfile.email}</p>
                    {userProfile.phone && <p className="text-gray-500 text-sm">{userProfile.phone}</p>}
                    <p className="text-gray-500 text-xs mt-2">
                      Joined {new Date(userProfile.created_at).toLocaleDateString()}
                    </p>
                    <Button className="mt-4 w-full" asChild>
                      <Link href="/profile">Edit Profile</Link>
                    </Button>
                  </div>
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
    </ProtectedRoute>
  )
}
