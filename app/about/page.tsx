"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import {
  Shield,
  Zap,
  Clock,
  Users,
  Award,
  Smartphone,
  Globe,
  CreditCard,
  Headphones,
  CheckCircle,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "50,000+" },
    { icon: Globe, label: "Cities Worldwide", value: "500+" },
    { icon: Award, label: "Years Experience", value: "15+" },
    { icon: Clock, label: "24/7 Support", value: "Always" },
  ]

  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Experience",
      description: "Book, manage, and unlock cars directly from your smartphone with our intuitive mobile app.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description:
        "Multi-layer security with encrypted payments, verified users, and comprehensive insurance coverage.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Find and book your perfect car in under 60 seconds with our streamlined booking process.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Access thousands of vehicles across 500+ cities worldwide with consistent quality standards.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: CreditCard,
      title: "Flexible Payments",
      description: "Multiple payment options including digital wallets, credit cards, and buy-now-pay-later solutions.",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support with real humans ready to help whenever you need assistance.",
      color: "bg-indigo-100 text-indigo-600",
    },
  ]

  const benefits = [
    "No hidden fees or surprise charges",
    "Free cancellation up to 24 hours",
    "Comprehensive insurance included",
    "Contactless pickup and return",
    "Real-time vehicle tracking",
    "Loyalty rewards program",
  ]

  const techStack = [
    { name: "React & Next.js", description: "Modern web framework for optimal performance" },
    { name: "AI-Powered Matching", description: "Smart algorithms to find your perfect car" },
    { name: "Real-time Analytics", description: "Live tracking and instant notifications" },
    { name: "Cloud Infrastructure", description: "99.9% uptime with global CDN" },
    { name: "Mobile APIs", description: "Native iOS and Android applications" },
    { name: "Blockchain Security", description: "Decentralized identity verification" },
  ]

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              The Future of <span className="text-blue-600">Car Sharing</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Experience seamless car rentals powered by cutting-edge technology, comprehensive safety measures, and
              unmatched customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-3">
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3">
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the innovative features that make CarHub the leading car sharing platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Choose CarHub?</h2>
              <p className="text-lg text-gray-600 mb-8">
                We've reimagined car rentals from the ground up, focusing on transparency, convenience, and customer
                satisfaction.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button className="mt-8" size="lg">
                Get Started Today
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="CarHub App Interface"
                  width={500}
                  height={400}
                  className="rounded-xl shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powered by Innovation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform leverages the latest technologies to deliver a seamless experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{tech.name}</h3>
                      <p className="text-sm text-gray-600">{tech.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience the Future?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join millions of satisfied customers who have made CarHub their go-to car sharing platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Browse Cars Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600"
              >
                Download App
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
