"use client"

import Image from "next/image"
import CustomButton from "./CustomButton"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users } from "lucide-react"

const Hero = () => {
  const handleScroll = () => {
    const nextSection = document.getElementById("discover")
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="hero relative min-h-screen flex items-center bg-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image src="/hero-bg.png" alt="Hero Background" fill className="object-cover opacity-10" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-purple-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 sm:px-16 py-20">
        {/* Left Content */}
        <div className="flex-1 lg:pr-10 z-20">
          <motion.div
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            #1 Car Rental Platform
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Find, book, rent a car—
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              quick and super easy!
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Streamline your car rental experience with our effortless booking process. Choose from thousands of vehicles
            worldwide.
          </p>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">500+</p>
                <p className="text-sm text-gray-600">Locations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">50K+</p>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">24/7</p>
                <p className="text-sm text-gray-600">Support</p>
              </div>
            </div>
          </motion.div>

          <CustomButton
            title="Explore Cars"
            containerStyles="bg-primary-blue text-white rounded-full mt-4"
            handleClick={handleScroll}
          />
        </div>

        {/* Right Content - Car Image */}
        <motion.div
          className="flex-1 relative mt-10 lg:mt-0 z-10"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="relative w-full h-[400px] lg:h-[500px]">
            <Image src="/hero.png" alt="hero" fill className="object-contain" priority />

            {/* Floating Cards */}
            <motion.div
              className="absolute top-10 left-0 bg-white rounded-2xl shadow-lg p-4 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Instant Booking</p>
                  <p className="text-sm text-gray-600">Book in 30 seconds</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-10 right-0 bg-white rounded-2xl shadow-lg p-4 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">$</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Best Prices</p>
                  <p className="text-sm text-gray-600">Starting from $29/day</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero
