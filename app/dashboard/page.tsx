"use client"

import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Car, Heart, Settings, User, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth()

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const profileCompletion = () => {
    if (!userProfile) return 0
    const fields = [
      userProfile.first_name,
      userProfile.last_name,
      userProfile.phone,
      userProfile.address,
      userProfile.city,
      userProfile.bio,
    ]
    const completed = fields.filter(Boolean).length
    return Math.round((completed / fields.length) * 100)
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {userProfile?.first_name || user?.email}!</p>
          </div>

          {/* Profile Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={userProfile?.profile_image_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">
                      {getInitials(userProfile?.full_name || user?.email || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{userProfile?.full_name || "Complete your profile"}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{user?.email}</span>
                      {userProfile?.email_verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    {userProfile?.phone && (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{userProfile.phone}</span>
                      </div>
                    )}
                    {(userProfile?.city || userProfile?.state) && (
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {[userProfile.city, userProfile.state].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                    {userProfile?.bio && <p className="text-gray-600 mt-2 text-sm">{userProfile.bio}</p>}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href="/profile">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>Complete your profile to get the most out of CarHub</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{profileCompletion()}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion()}%` }}
                    ></div>
                  </div>
                  {profileCompletion() < 100 && (
                    <Link href="/profile">
                      <Button size="sm" className="w-full">
                        Complete Profile
                      </Button>
                    </Link>
                  )}
                  {profileCompletion() === 100 && (
                    <Badge variant="default" className="w-full justify-center">
                      Profile Complete!
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Favorite Cars</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cars Viewed</p>
                    <p className="text-2xl font-bold">47</p>
                  </div>
                  <Car className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bookings</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <CalendarDays className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Member Since</p>
                    <p className="text-sm font-bold">
                      {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : "Today"}
                    </p>
                  </div>
                  <User className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions with CarHub</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Heart className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Added BMW M3 to favorites</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Viewed Tesla Model S details</p>
                      <p className="text-sm text-gray-600">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CalendarDays className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Booked test drive for Audi A4</p>
                      <p className="text-sm text-gray-600">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/cars">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                      <Car className="h-6 w-6" />
                      Browse Cars
                    </Button>
                  </Link>
                  <Link href="/booking">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                      <CalendarDays className="h-6 w-6" />
                      Book Test Drive
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                      <Settings className="h-6 w-6" />
                      Settings
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                      <User className="h-6 w-6" />
                      Help & Support
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
