import { type NextRequest, NextResponse } from "next/server"
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
      hybrid: "gas",
    }
    const mappedFuel = fuelMap[fuel.toLowerCase()] || fuel.toLowerCase()
    params.append("fuel_type", mappedFuel)
  }

  // Set a reasonable limit
  const apiLimit = Math.min(limit || 10, 50)
  params.append("limit", apiLimit.toString())

  const apiUrl = `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?${params.toString()}`

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const result = await response.json()
    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error("API fetch error:", error)
    return []
  }
}

// Mock data fallback
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
  ]

  // Apply filters
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const filters: FilterProps = {
    manufacturer: searchParams.get("manufacturer") || "",
    year: searchParams.get("year") ? Number.parseInt(searchParams.get("year")!) : undefined,
    model: searchParams.get("model") || "",
    limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10,
    fuel: searchParams.get("fuel") || "",
  }

  try {
    // Try to fetch from real API first
    const cars = await fetchCarsFromAPI(filters)

    if (cars.length > 0) {
      return NextResponse.json({ cars, success: true, source: "api" })
    } else {
      // Fallback to mock data
      const mockCars = getMockCars(filters)
      return NextResponse.json({ cars: mockCars, success: true, source: "mock" })
    }
  } catch (error) {
    console.error("Error fetching cars:", error)
    // Return mock data on error
    const mockCars = getMockCars(filters)
    return NextResponse.json({ cars: mockCars, success: true, source: "mock", error: error.message })
  }
}
