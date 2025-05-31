"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Camera, Edit, X, Plus, Trash2, CreditCard, MapPin, Calendar, User, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  driverLicense: string
  birthDate: string
  preferredCarType: string
  avatar: string
  memberSince: string
  totalBookings: number
  totalSpent: number
  favoriteVehicles: number
}

interface PaymentMethod {
  id: string
  type: "credit" | "debit" | "paypal"
  cardNumber: string
  expiryDate: string
  cardholderName: string
  isDefault: boolean
}

interface RentalHistory {
  id: string
  carMake: string
  carModel: string
  carYear: number
  carImage: string
  startDate: string
  endDate: string
  totalAmount: number
  status: "completed" | "active" | "cancelled" | "upcoming"
  location: string
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  const [profile, setProfile] = useState<UserProfile>({
    id: "user_123",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    driverLicense: "DL12345678",
    birthDate: "1990-01-15",
    preferredCarType: "SUV",
    avatar: "/placeholder.svg?height=200&width=200",
    memberSince: "January 2023",
    totalBookings: 12,
    totalSpent: 2450,
    favoriteVehicles: 5,
  })

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      type: "credit",
      cardNumber: "**** **** **** 4242",
      expiryDate: "12/25",
      cardholderName: "John Doe",
      isDefault: true,
    },
    {
      id: "pm_2",
      type: "paypal",
      cardNumber: "john.doe@example.com",
      expiryDate: "",
      cardholderName: "John Doe",
      isDefault: false,
    },
  ])

  const [rentalHistory, setRentalHistory] = useState<RentalHistory[]>([
    {
      id: "rental_1",
      carMake: "BMW",
      carModel: "M3",
      carYear: 2023,
      carImage: "/placeholder.svg?height=60&width=100",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      totalAmount: 450,
      status: "completed",
      location: "New York, NY",
    },
    {
      id: "rental_2",
      carMake: "Tesla",
      carModel: "Model 3",
      carYear: 2023,
      carImage: "/placeholder.svg?height=60&width=100",
      startDate: "2024-02-10",
      endDate: "2024-02-15",
      totalAmount: 520,
      status: "upcoming",
      location: "Los Angeles, CA",
    },
  ])

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: "credit" as "credit" | "debit" | "paypal",
    cardNumber: "",
    expiryDate: "",
    cardholderName: "",
    cvv: "",
  })

  const [showAddPayment, setShowAddPayment] = useState(false)

  const handleProfileUpdate = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddPaymentMethod = async () => {
    if (!newPaymentMethod.cardNumber || !newPaymentMethod.cardholderName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: newPaymentMethod.type,
      cardNumber:
        newPaymentMethod.type === "paypal"
          ? newPaymentMethod.cardNumber
          : `**** **** **** ${newPaymentMethod.cardNumber.slice(-4)}`,
      expiryDate: newPaymentMethod.expiryDate,
      cardholderName: newPaymentMethod.cardholderName,
      isDefault: paymentMethods.length === 0,
    }

    setPaymentMethods([...paymentMethods, newMethod])
    setNewPaymentMethod({
      type: "credit",
      cardNumber: "",
      expiryDate: "",
      cardholderName: "",
      cvv: "",
    })
    setShowAddPayment(false)

    toast({
      title: "Payment Method Added",
      description: "Your payment method has been successfully added.",
    })
  }

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
    toast({
      title: "Payment Method Removed",
      description: "Payment method has been successfully removed.",
    })
  }

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
    toast({
      title: "Default Payment Updated",
      description: "Default payment method has been updated.",
    })
  }

  const handleCancelRental = (id: string) => {
    setRentalHistory(rentalHistory.map((rental) => (rental.id === id ? { ...rental, status: "cancelled" } : rental)))
    toast({
      title: "Rental Cancelled",
      description: "Your rental has been successfully cancelled.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "upcoming":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={profile.avatar || "/placeholder.svg"}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-gray-600">Member since {profile.memberSince}</p>

              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{profile.totalBookings}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${profile.totalSpent}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{profile.favoriteVehicles}</div>
                  <div className="text-sm text-gray-600">Favorites</div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              className="flex items-center gap-2"
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </motion.div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="rentals">Rental History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="driverLicense">Driver's License</Label>
                    <Input
                      id="driverLicense"
                      value={profile.driverLicense}
                      onChange={(e) => setProfile({ ...profile, driverLicense: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={profile.birthDate}
                      onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button onClick={handleProfileUpdate} disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Methods
                  </CardTitle>
                  <Button onClick={() => setShowAddPayment(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {method.type === "paypal"
                            ? "PayPal"
                            : `${method.type.charAt(0).toUpperCase() + method.type.slice(1)} Card`}
                          {method.isDefault && (
                            <Badge variant="secondary" className="ml-2">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{method.cardNumber}</div>
                        {method.expiryDate && <div className="text-sm text-gray-600">Expires: {method.expiryDate}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => handleSetDefaultPayment(method.id)}>
                          Set Default
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleDeletePaymentMethod(method.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Payment Method Form */}
                {showAddPayment && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium mb-4">Add New Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number / Email</Label>
                        <Input
                          id="cardNumber"
                          value={newPaymentMethod.cardNumber}
                          onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardNumber: e.target.value })}
                          placeholder={newPaymentMethod.type === "paypal" ? "email@example.com" : "1234 5678 9012 3456"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          value={newPaymentMethod.cardholderName}
                          onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardholderName: e.target.value })}
                        />
                      </div>
                      {newPaymentMethod.type !== "paypal" && (
                        <>
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              value={newPaymentMethod.expiryDate}
                              onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiryDate: e.target.value })}
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              value={newPaymentMethod.cvv}
                              onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cvv: e.target.value })}
                              placeholder="123"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setShowAddPayment(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddPaymentMethod}>Add Payment Method</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rental History Tab */}
          <TabsContent value="rentals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Rental History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rentalHistory.map((rental) => (
                    <div key={rental.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Image
                            src={rental.carImage || "/placeholder.svg"}
                            alt={`${rental.carMake} ${rental.carModel}`}
                            width={100}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium">
                              {rental.carMake} {rental.carModel} {rental.carYear}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {rental.location}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {rental.startDate} to {rental.endDate}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${rental.totalAmount}</div>
                          <Badge className={getStatusColor(rental.status)}>
                            {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                          </Badge>
                          {rental.status === "upcoming" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => handleCancelRental(rental.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-600">Receive booking confirmations and updates</div>
                      </div>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">SMS Notifications</div>
                        <div className="text-sm text-gray-600">Receive text messages for urgent updates</div>
                      </div>
                      <input type="checkbox" className="toggle" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Profile Visibility</div>
                        <div className="text-sm text-gray-600">Allow others to see your profile</div>
                      </div>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
