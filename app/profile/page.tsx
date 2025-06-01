"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, Shield, Star } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function Profile() {
  const { user, userProfile, loading, updateProfile, signOut } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState("")
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    bio: "",
    city: "",
    state: "",
    country: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        phone: userProfile.phone || "",
        bio: userProfile.bio || "",
        city: userProfile.city || "",
        state: userProfile.state || "",
        country: userProfile.country || "",
      })
    }
  }, [userProfile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setMessage("")

    try {
      const updates = {
        ...formData,
        full_name: `${formData.first_name} ${formData.last_name}`.trim(),
      }

      await updateProfile(updates)
      setMessage("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      setMessage("Error updating profile. Please try again.")
      console.error("Profile update error:", error)
    } finally {
      setUpdating(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setMessage("")
    // Reset form data to original values
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        phone: userProfile.phone || "",
        bio: userProfile.bio || "",
        city: userProfile.city || "",
        state: userProfile.state || "",
        country: userProfile.country || "",
      })
    }
  }

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return null
  }

  const joinDate = new Date(userProfile.created_at)
  const accountAge = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
              </div>
              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Button>
                ) : (
                  <Button onClick={cancelEdit} variant="outline" className="flex items-center space-x-2">
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {message && (
            <Alert
              className={`mb-6 ${message.includes("Error") ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
            >
              <AlertDescription className={message.includes("Error") ? "text-red-700" : "text-green-700"}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="relative mx-auto h-32 w-32 mb-4">
                      <Image
                        src={userProfile.profile_image_url || "/placeholder.svg?height=128&width=128"}
                        alt="Profile"
                        fill
                        className="rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-1">{userProfile.full_name || "User"}</h2>

                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-600 text-sm">{userProfile.email}</p>
                    </div>

                    {userProfile.phone && (
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <p className="text-gray-600 text-sm">{userProfile.phone}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-500 text-xs">
                        Joined{" "}
                        {joinDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex justify-center space-x-2 mb-4">
                      <Badge
                        variant={userProfile.email_verified ? "default" : "secondary"}
                        className="flex items-center space-x-1"
                      >
                        <Shield className="w-3 h-3" />
                        <span>{userProfile.email_verified ? "Verified" : "Unverified"}</span>
                      </Badge>
                      {accountAge > 30 && (
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>Trusted Member</span>
                        </Badge>
                      )}
                    </div>

                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Account Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Account Age</span>
                    <span className="font-medium">{accountAge} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Completion</span>
                    <span className="font-medium">
                      {Math.round(
                        (Object.values({
                          first_name: userProfile.first_name,
                          last_name: userProfile.last_name,
                          phone: userProfile.phone,
                          bio: userProfile.bio,
                          city: userProfile.city,
                        }).filter(Boolean).length /
                          5) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="font-medium">
                      {userProfile.updated_at ? new Date(userProfile.updated_at).toLocaleDateString() : "Never"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="first_name">First Name *</Label>
                          <Input
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="last_name">Last Name *</Label>
                          <Input
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="New York"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State/Province</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="NY"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="United States"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Tell us about yourself..."
                          className="mt-1"
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" onClick={cancelEdit}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={updating} className="flex items-center space-x-2">
                          {updating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Save Changes</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">First Name</h3>
                          <p className="text-gray-900">{userProfile.first_name || "Not provided"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Last Name</h3>
                          <p className="text-gray-900">{userProfile.last_name || "Not provided"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                          <p className="text-gray-900">{userProfile.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                          <p className="text-gray-900">{userProfile.phone || "Not provided"}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>Location</span>
                        </h3>
                        <p className="text-gray-900">
                          {[userProfile.city, userProfile.state, userProfile.country].filter(Boolean).join(", ") ||
                            "Not provided"}
                        </p>
                      </div>

                      {userProfile.bio && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                          <p className="text-gray-900 leading-relaxed">{userProfile.bio}</p>
                        </div>
                      )}

                      {(!userProfile.first_name || !userProfile.last_name || !userProfile.phone) && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-blue-800 text-sm">
                            <strong>Complete your profile:</strong> Add missing information to get the most out of your
                            account.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
