"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Sparkles, TrendingUp, Award } from "lucide-react"
import { fetchCars } from "@/utils"
import Hero from "@/components/Hero"
import CarCatalog from "@/components/CarCatalog"

interface SearchParams {
  manufacturer?: string
  year?: number
  model?: string
  limit?: number
  fuel?: string
}

interface Car {
  city_mpg: number
  class: string
  combination_mpg: number
  cylinders: number
  displacement: number
  drive: string
  fuel_type: string
  highway_mpg: number
  make: string
  model: string
  transmission: string
  year: number
}

export default function Home() {
  const [allCars, setAllCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"price" | "year" | "mpg">("price")
  const [searchParams, setSearchParams] = useState<SearchParams>({
    manufacturer: "",
    year: undefined,
    fuel: "",
    limit: 12,
    model: "",
  })

  const calculateCarRent = useCallback((city_mpg: number, year: number) => {
    const basePricePerDay = 50
    const mileageFactor = 0.1
    const ageFactor = 0.05
    const mileageRate = city_mpg * mileageFactor
    const ageRate = (new Date().getFullYear() - year) * ageFactor
    const rentalRatePerDay = basePricePerDay + mileageRate + ageRate
    return rentalRatePerDay.toFixed(0)
  }, [])

  // Memoize sorted cars to prevent unnecessary re-sorting
  const sortedCars = useMemo(() => {
    if (!allCars.length) return []

    return [...allCars].sort((a, b) => {
      switch (sortBy) {
        case "year":
          return b.year - a.year
        case "mpg":
          return b.city_mpg - a.city_mpg
        case "price":
        default:
          return (
            Number.parseInt(calculateCarRent(a.city_mpg, a.year)) -
            Number.parseInt(calculateCarRent(b.city_mpg, b.year))
          )
      }
    })
  }, [allCars, sortBy, calculateCarRent])

  // Optimized search function with debouncing effect
  const fetchAllCars = useCallback(async (params: SearchParams) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchCars(params)
      setAllCars(Array.isArray(result) ? result : [])
    } catch (error) {
      console.error("Error fetching cars:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch cars")
      setAllCars([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAllCars(searchParams)
    }, 300) // Debounce API calls

    return () => clearTimeout(timeoutId)
  }, [searchParams, fetchAllCars])

  const updateSearchParams = useCallback((key: string, value: string | number | undefined) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const clearAllFilters = useCallback(() => {
    setSearchParams({
      manufacturer: "",
      year: undefined,
      fuel: "",
      limit: 12,
      model: "",
    })
  }, [])

  const handleSearch = useCallback(
    (manufacturer: string, model: string) => {
      updateSearchParams("manufacturer", manufacturer)
      updateSearchParams("model", model)
    },
    [updateSearchParams],
  )

  const handleShowMore = useCallback(() => {
    updateSearchParams("limit", (searchParams.limit || 12) + 12)
  }, [searchParams.limit, updateSearchParams])

  const hasActiveFilters = useMemo(
    () => !!(searchParams.manufacturer || searchParams.year || searchParams.fuel || searchParams.model),
    [searchParams],
  )

  const isDataEmpty = !Array.isArray(sortedCars) || sortedCars.length < 1

  return (
    <main className="overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <Hero />

      {/* Optimized Stats Section */}
      <section className="py-16 bg-white border-t border-gray-100" role="complementary" aria-label="Statistics">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Premium Vehicles</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50K+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">24/7</h3>
              <p className="text-gray-600">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Car Catalog Section */}
      <section className="py-16 bg-gray-50">
        <CarCatalog />
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white" role="complementary">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to find your perfect car?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who found their dream car with us.
          </p>
          <button
            onClick={() => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Your Search
          </button>
        </div>
      </section>
    </main>
  )
}
