"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Search, Grid, List, X, ChevronDown, Sparkles, TrendingUp, Award } from "lucide-react"
import { fetchCars } from "@/utils"
import { fuels, yearsOfProduction } from "@/constants"
import Hero from "@/components/Hero"
import SearchBar from "@/components/SearchBar"
import CustomFilter from "@/components/CustomFilter"
import CarCard from "@/components/CarCard"
import ShowMore from "@/components/ShowMore"

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

      <div className="py-12 px-6 max-w-7xl mx-auto" id="discover">
        {/* Enhanced Header Section */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-6 border border-blue-100">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Discover Your Perfect Ride
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Premium Car{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Collection
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover our curated selection of luxury vehicles, from sports cars to electric SUVs. Find the perfect car
            for your next adventure.
          </p>
        </header>

        {/* Search and Filters */}
        <section
          className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100"
          role="search"
          aria-label="Car search and filters"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <label htmlFor="car-search" className="block text-sm font-semibold text-gray-700 mb-3">
                Search for your dream car
              </label>
              <SearchBar onSearch={handleSearch} />
            </div>

            <div className="flex-shrink-0">
              <fieldset>
                <legend className="block text-sm font-semibold text-gray-700 mb-3">Filter options</legend>
                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
                  <CustomFilter
                    title="fuel"
                    options={fuels}
                    setFilter={(value: string) => updateSearchParams("fuel", value)}
                  />
                  <CustomFilter
                    title="year"
                    options={yearsOfProduction}
                    setFilter={(value: string) => {
                      const yearValue = value ? Number.parseInt(value) : undefined
                      updateSearchParams("year", yearValue)
                    }}
                  />
                </div>
              </fieldset>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100" role="status" aria-label="Active search filters">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {searchParams.manufacturer && (
                  <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {searchParams.manufacturer}
                    <button
                      onClick={() => updateSearchParams("manufacturer", "")}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                      aria-label={`Remove ${searchParams.manufacturer} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchParams.model && (
                  <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {searchParams.model}
                    <button
                      onClick={() => updateSearchParams("model", "")}
                      className="hover:bg-green-200 rounded-full p-0.5"
                      aria-label={`Remove ${searchParams.model} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchParams.fuel && (
                  <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {searchParams.fuel}
                    <button
                      onClick={() => updateSearchParams("fuel", "")}
                      className="hover:bg-purple-200 rounded-full p-0.5"
                      aria-label={`Remove ${searchParams.fuel} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchParams.year && (
                  <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    {searchParams.year}
                    <button
                      onClick={() => updateSearchParams("year", undefined)}
                      className="hover:bg-orange-200 rounded-full p-0.5"
                      aria-label={`Remove ${searchParams.year} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button onClick={clearAllFilters} className="text-sm text-gray-500 hover:text-gray-700 underline">
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
              <span className="text-gray-700 font-medium" role="status" aria-live="polite">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
                      aria-hidden="true"
                    ></div>
                    Searching...
                  </span>
                ) : (
                  `${sortedCars.length} cars available`
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative">
              <label htmlFor="sort-select" className="sr-only">
                Sort cars by
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "price" | "year" | "mpg")}
                className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="price">Price: Low to High</option>
                <option value="year">Year: Newest First</option>
                <option value="mpg">Fuel Efficiency</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                aria-hidden="true"
              />
            </div>

            <div className="flex bg-gray-100 rounded-xl p-1" role="tablist" aria-label="View mode">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid" ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"
                }`}
                role="tab"
                aria-selected={viewMode === "grid"}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list" ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"
                }`}
                role="tab"
                aria-selected={viewMode === "list"}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20" role="status" aria-live="polite">
            <div className="relative mb-8">
              <div
                className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
                aria-hidden="true"
              ></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Finding your perfect car</h2>
            <p className="text-gray-600">Please wait while we search our premium collection...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20" role="alert">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-red-500" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Cars Grid/List */}
        {!loading && !error && !isDataEmpty && (
          <section role="main" aria-label="Car catalog">
            <div
              className={`
              ${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "flex flex-col gap-6"
              }
            `}
            >
              {sortedCars.map((car, index) => (
                <CarCard key={`${car.make}-${car.model}-${car.year}-${index}`} car={car} index={index} />
              ))}
            </div>

            {sortedCars.length >= (searchParams.limit || 12) && (
              <div className="mt-16 text-center">
                <ShowMore
                  pageNumber={Math.floor((searchParams.limit || 12) / 12)}
                  isNext={sortedCars.length >= (searchParams.limit || 12)}
                  onShowMore={handleShowMore}
                />
              </div>
            )}
          </section>
        )}

        {/* Empty State */}
        {!loading && !error && isDataEmpty && (
          <div className="text-center py-20" role="status">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-16 h-16 text-gray-400" aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">No cars found</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any cars matching your criteria. Try adjusting your search filters or explore our full
              collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={clearAllFilters}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="bg-white text-gray-700 px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Back to Top
              </button>
            </div>
          </div>
        )}
      </div>

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
