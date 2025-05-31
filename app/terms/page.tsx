"use client"

import { motion } from "framer-motion"
import Logo from "@/components/Logo"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="mb-8">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign Up
            </Link>
            <Logo className="mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using CarHub's services, you accept and agree to be bound by the terms and provision of
              this agreement.
            </p>

            <h2>2. Vehicle Rental Agreement</h2>
            <p>
              All vehicle rentals are subject to availability and our rental policies. You must be at least 21 years old
              with a valid driver's license to rent a vehicle.
            </p>

            <h2>3. Payment and Fees</h2>
            <p>
              Payment is required at the time of booking. Additional fees may apply for late returns, damage, or
              additional services.
            </p>

            <h2>4. Cancellation Policy</h2>
            <p>
              Cancellations made 24 hours before the rental period will receive a full refund. Cancellations made within
              24 hours may be subject to fees.
            </p>

            <h2>5. Liability and Insurance</h2>
            <p>
              Renters are responsible for any damage to the vehicle during the rental period. Insurance options are
              available at the time of booking.
            </p>

            <h2>6. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@carhub.com" className="text-blue-600 hover:text-blue-500">
                legal@carhub.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
