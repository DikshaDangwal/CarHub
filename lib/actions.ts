"use server"

import type { FilterProps } from "@/types"

// Server-side API fetch function (only runs on server)
async function fetchCarsFromAPI(filters: FilterProps) {
  const { manufacturer, year, model, limit, fuel } = filters

  // Using your RapidAPI key securely on server-side only
  const headers = {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY || "f52d2fd002msh0fb0d3a370b0bd8p187433jsn376db9d338fd",
    "X-RapidAPI-Host": "cars-by-api-ninjas.p.rapidapi.com",
  }

  // Build query parameters more carefully
  const params = new URLSearchParams()

  if (manufacturer && manufacturer.trim()) {
    params.append("make", manufacturer.trim().toLowerCase())
  }

  if (model && model.trim()) {
    params.append("model", model.trim().toLowerCase())
  }

  if (year && year > 1990 && year <= new Date().getFullYear()) {
    params.append("year", year.toString())
  }

  if (fuel && fuel.trim()) {
    // Map fuel types to API expected values
    const fuelMap: { [key: string]: string } = {
      gas: "gas",
      gasoline: "gas",
      electric: "electricity",
      electricity: "electricity",
      hybrid: "gas", // API doesn't have hybrid, fallback to gas
    }
    const mappedFuel = fuelMap[fuel.toLowerCase()] || fuel.toLowerCase()
    params.append("fuel_type", mappedFuel)
  }

  // Set a reasonable limit
  const apiLimit = Math.min(limit || 10, 50) // API might have limits
  params.append("limit", apiLimit.toString())

  const apiUrl = `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?${params.toString()}`

  console.log("API Request URL:", apiUrl)
  console.log("API Headers:", headers)

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: headers,
    })

    console.log("API Response Status:", response.status)
    console.log("API Response Headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const result = await response.json()
    console.log("API Response Data:", result)

    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error("API fetch error:", error)
    // Return empty array to trigger fallback
    return []
  }
}

// Mock data function (fallback)
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
    {
      city_mpg: 22,
      class: "midsize car",
      combination_mpg: 28,
      cylinders: 4,
      displacement: 2.0,
      drive: "awd",
      fuel_type: "gas",
      highway_mpg: 32,
      make: "subaru",
      model: "outback",
      transmission: "a",
      year: 2022,
    },
    {
      city_mpg: 20,
      class: "compact car",
      combination_mpg: 25,
      cylinders: 4,
      displacement: 2.0,
      drive: "fwd",
      fuel_type: "gas",
      highway_mpg: 28,
      make: "volkswagen",
      model: "jetta",
      transmission: "a",
      year: 2021,
    },
    {
      city_mpg: 21,
      class: "luxury",
      combination_mpg: 24,
      cylinders: 6,
      displacement: 3.0,
      drive: "awd",
      fuel_type: "gas",
      highway_mpg: 28,
      make: "lexus",
      model: "es",
      transmission: "a",
      year: 2023,
    },
    {
      city_mpg: 18,
      class: "sports",
      combination_mpg: 20,
      cylinders: 8,
      displacement: 4.0,
      drive: "rwd",
      fuel_type: "gas",
      highway_mpg: 24,
      make: "chevrolet",
      model: "corvette",
      transmission: "a",
      year: 2023,
    },
    {
      city_mpg: 25,
      class: "suv",
      combination_mpg: 28,
      cylinders: 4,
      displacement: 2.0,
      drive: "awd",
      fuel_type: "gas",
      highway_mpg: 32,
      make: "mazda",
      model: "cx-5",
      transmission: "a",
      year: 2023,
    },
    {
      city_mpg: 22,
      class: "pickup",
      combination_mpg: 25,
      cylinders: 6,
      displacement: 3.5,
      drive: "4wd",
      fuel_type: "gas",
      highway_mpg: 29,
      make: "ford",
      model: "f-150",
      transmission: "a",
      year: 2023,
    },
  ]

  // Apply filters to mock data
  let filteredCars = mockCars

  if (filters.manufacturer && filters.manufacturer.trim() !== "") {
    filteredCars = filteredCars.filter((car) => car.make.toLowerCase().includes(filters.manufacturer!.toLowerCase()))
  }

  if (filters.model && filters.model.trim() !== "") {
    filteredCars = filteredCars.filter((car) => car.model.toLowerCase().includes(filters.model!.toLowerCase()))
  }

  if (filters.year) {
    filteredCars = filteredCars.filter((car) => car.year === filters.year)
  }

  if (filters.fuel && filters.fuel.trim() !== "") {
    filteredCars = filteredCars.filter((car) => car.fuel_type.toLowerCase() === filters.fuel!.toLowerCase())
  }

  if (filters.limit) {
    filteredCars = filteredCars.slice(0, filters.limit)
  }

  return filteredCars
}

// Main server action for fetching cars
export async function fetchCarsAction(filters: FilterProps) {
  console.log("Fetching cars server-side")

  try {
    // For the main page, let's use mock data for now to ensure stability
    // The API can be tested on the dedicated /api-cars page
    console.log("Using mock data for main page stability")
    return getMockCars(filters)

    // Uncomment below to try real API (but it might cause 400 errors)
    /*
    const apiCars = await fetchCarsFromAPI(filters)

    if (apiCars.length > 0) {
      console.log(`Fetched ${apiCars.length} cars from RapidAPI`)
      return apiCars
    } else {
      console.log("No cars from API, using mock data")
      return getMockCars(filters)
    }
    */
  } catch (error) {
    console.error("Error in fetchCarsAction:", error)
    // Always fallback to mock data
    return getMockCars(filters)
  }
}

// Separate action for testing API (used in /api-cars page)
export async function fetchRealCarsAction(filters: FilterProps) {
  console.log("Fetching real cars from API")

  try {
    const apiCars = await fetchCarsFromAPI(filters)

    if (apiCars.length > 0) {
      console.log(`Fetched ${apiCars.length} cars from RapidAPI`)
      return { cars: apiCars, source: "api" }
    } else {
      console.log("No cars from API, using mock data")
      return { cars: getMockCars(filters), source: "mock" }
    }
  } catch (error) {
    console.error("Error in fetchRealCarsAction:", error)
    return { cars: getMockCars(filters), source: "mock", error: error.message }
  }
}
