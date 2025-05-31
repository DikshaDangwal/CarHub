"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Book,
  CreditCard,
  Car,
  Shield,
  Phone,
  ChevronRight,
  HelpCircle,
  FileText,
  Users,
  Settings,
} from "lucide-react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    {
      icon: Book,
      title: "Booking & Reservations",
      description: "Learn how to book, modify, and cancel reservations",
      articles: 12,
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: CreditCard,
      title: "Payment & Billing",
      description: "Payment methods, billing, and refund information",
      articles: 8,
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Car,
      title: "Vehicle Information",
      description: "Car features, pickup/return, and vehicle care",
      articles: 15,
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Shield,
      title: "Insurance & Protection",
      description: "Coverage options and protection plans",
      articles: 6,
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Users,
      title: "Account Management",
      description: "Profile settings, preferences, and account security",
      articles: 9,
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Settings,
      title: "Technical Support",
      description: "App issues, website problems, and troubleshooting",
      articles: 7,
      color: "bg-gray-100 text-gray-600",
    },
  ]

  const popularArticles = [
    {
      title: "How to book a car rental",
      category: "Booking",
      readTime: "3 min read",
      views: "15.2k views",
    },
    {
      title: "What to do if your car breaks down",
      category: "Support",
      readTime: "5 min read",
      views: "8.7k views",
    },
    {
      title: "Understanding rental insurance options",
      category: "Insurance",
      readTime: "7 min read",
      views: "12.1k views",
    },
    {
      title: "Cancellation and refund policy",
      category: "Billing",
      readTime: "4 min read",
      views: "9.8k views",
    },
    {
      title: "Adding additional drivers",
      category: "Booking",
      readTime: "2 min read",
      views: "6.3k views",
    },
  ]

  const quickActions = [
    {
      icon: Phone,
      title: "Call Support",
      description: "Speak with our team",
      action: "1-800-CARHUB",
      color: "bg-blue-600",
    },
    {
      icon: FileText,
      title: "Submit Ticket",
      description: "Get help via email",
      action: "Create Ticket",
      color: "bg-green-600",
    },
    {
      icon: HelpCircle,
      title: "Live Chat",
      description: "Chat with an agent",
      action: "Start Chat",
      color: "bg-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How can we <span className="text-blue-600">help</span> you?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to your questions, get support, and learn how to make the most of CarHub.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-4 text-lg"
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div
                  className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 mb-4">{action.description}</p>
                <p className="text-blue-600 font-medium">{action.action}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Help Categories */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Badge variant="secondary">{category.articles} articles</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Popular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Popular Articles</h2>
          <div className="max-w-4xl mx-auto">
            {popularArticles.map((article, index) => (
              <Card key={index} className="mb-4 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Badge variant="outline">{article.category}</Badge>
                        <span>{article.readTime}</span>
                        <span>{article.views}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Contact Support
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Schedule a Call
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
