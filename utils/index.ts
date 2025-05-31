import type { CarProps, FilterProps } from "@/types"

export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50
  const mileageFactor = 0.1
  const ageFactor = 0.05

  const mileageRate = city_mpg * mileageFactor
  const ageRate = (new Date().getFullYear() - year) * ageFactor

  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate

  return rentalRatePerDay.toFixed(0)
}

export const updateSearchParams = (type: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set(type, value)
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`
  return newPathname
}

export const deleteSearchParams = (type: string) => {
  const newSearchParams = new URLSearchParams(window.location.search)
  newSearchParams.delete(type.toLowerCase())
  const newPathname = `${window.location.pathname}?${newSearchParams.toString()}`
  return newPathname
}

// Optimized mock data function
function getMockCars(filters: FilterProps) {
  const mockCars = [
    {
      city_mpg: 23,
      class: "luxury",
      combination_mpg: 26,
      cylinders: 6,
      displacement: 3.0,
      drive: "awd",
      fuel_type: "gas",
      highway_mpg: 31,
      make: "bmw",
      model: "m3",
      transmission: "a",
      year: 2023,
    },
    {
      city_mpg: 19,
      class: "luxury",
      combination_mpg: 22,
      cylinders: 8,
      displacement: 4.0,
      drive: "awd",
      fuel_type: "gas",
      highway_mpg: 25,
      make: "mercedes-benz",
      model: "amg",
      transmission: "a",
      year: 2023,
    },
    {
      city_mpg: 17,
      class: "sports",
      combination_mpg: 19,
      cylinders: 8,
      displacement: 5.2,
      drive: "awd",
      fuel_type: "gas",
      highway_mpg: 22,
      make: "lamborghini",
      model: "huracan",
      transmission: "a",
      year: 2022,
    },
    {
      city_mpg: 16,
      class: "sports",
      combination_mpg: 18,
      cylinders: 8,
      displacement: 3.9,
      drive: "rwd",
      fuel_type: "gas",
      highway_mpg: 22,
      make: "ferrari",
      model: "roma",
      transmission: "a",
      year: 2022,
    },
    {
      city_mpg: 24,
      class: "suv",
      combination_mpg: 26,
      cylinders: 4,
      displacement: 2.0,
      drive: "awd",
      fuel_type: "gas",
      highway_mpg: 30,
      make: "audi",
      model: "q5",
      transmission: "a",
      year: 2023,
    },
    {
      city_mpg: 19,
      class: "suv",
      combination_mpg: 22,
      cylinders: 6,
      displacement: 3.0,
      drive: "awd",
      fuel_type: "gas",
      highway_mpg: 26,
      make: "porsche",
      model: "cayenne",
      transmission: "a",
      year: 2023,
    },
    {
      city_mpg: 120,
      class: "sedan",
      combination_mpg: 115,
      cylinders: 0,
      displacement: 0,
      drive: "awd",
      fuel_type: "electricity",
      highway_mpg: 110,
      make: "tesla",
      model: "model 3",
      transmission: "a",
      year: 2023,
    },
    {
      city_mpg: 105,
      class: "suv",
      combination_mpg: 100,
      cylinders: 0,
      displacement: 0,
      drive: "awd",
      fuel_type: "electricity",
      highway_mpg: 95,
      make: "tesla",
      model: "model y",
      transmission: "a",
      year: 2023,
    },
    {
      city_mpg: 23,
      class: "compact car",
      combination_mpg: 26,
      cylinders: 4,
      displacement: 2.0,
      drive: "fwd",
      fuel_type: "gas",
      highway_mpg: 31,
      make: "toyota",
      model: "camry",
      transmission: "a",
      year: 2022,
    },
    {
      city_mpg: 28,
      class: "compact car",
      combination_mpg: 32,
      cylinders: 4,
      displacement: 1.8,
      drive: "fwd",
      fuel_type: "gas",
      highway_mpg: 36,
      make: "honda",
      model: "civic",
      transmission: "a",
      year: 2023,
    },
  ]

  // Apply filters efficiently
  return mockCars
    .filter((car) => {
      if (filters.manufacturer && !car.make.toLowerCase().includes(filters.manufacturer.toLowerCase())) {
        return false
      }
      if (filters.model && !car.model.toLowerCase().includes(filters.model.toLowerCase())) {
        return false
      }
      if (filters.year && car.year !== filters.year) {
        return false
      }
      if (filters.fuel && car.fuel_type.toLowerCase() !== filters.fuel.toLowerCase()) {
        return false
      }
      return true
    })
    .slice(0, filters.limit || 10)
}

// Simplified fetch function
export async function fetchCars(filters: FilterProps) {
  // Simulate API delay for realistic experience
  await new Promise((resolve) => setTimeout(resolve, 200))
  return getMockCars(filters)
}

// Optimized image generation with faster fallback
export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  // Return placeholder immediately instead of trying external API
  return `/placeholder.svg?height=160&width=300`
}

// User authentication utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}
