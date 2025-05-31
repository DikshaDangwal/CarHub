import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database operations for cars
export interface CarData {
  id?: number
  make: string
  model: string
  year: number
  fuel_type?: string
  transmission?: string
  drive?: string
  city_mpg?: number
  highway_mpg?: number
  combination_mpg?: number
  cylinders?: number
  displacement?: number
  class?: string
}

// Insert a new car
export async function insertCar(carData: CarData) {
  const { data, error } = await supabase.from("cars").insert([carData]).select()

  if (error) {
    console.error("Error inserting car:", error)
    throw error
  }

  return data
}

// Update an existing car
export async function updateCar(id: number, carData: Partial<CarData>) {
  const { data, error } = await supabase.from("cars").update(carData).eq("id", id).select()

  if (error) {
    console.error("Error updating car:", error)
    throw error
  }

  return data
}

// Delete a car
export async function deleteCar(id: number) {
  const { data, error } = await supabase.from("cars").delete().eq("id", id)

  if (error) {
    console.error("Error deleting car:", error)
    throw error
  }

  return data
}

// Get all cars with optional filters
export async function getCars(filters?: {
  make?: string
  model?: string
  year?: number
  fuel_type?: string
  limit?: number
}) {
  let query = supabase.from("cars").select("*")

  if (filters?.make) {
    query = query.ilike("make", `%${filters.make}%`)
  }

  if (filters?.model) {
    query = query.ilike("model", `%${filters.model}%`)
  }

  if (filters?.year) {
    query = query.eq("year", filters.year)
  }

  if (filters?.fuel_type) {
    query = query.eq("fuel_type", filters.fuel_type)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching cars:", error)
    throw error
  }

  return data
}

// Get a single car by ID
export async function getCarById(id: number) {
  const { data, error } = await supabase.from("cars").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching car:", error)
    throw error
  }

  return data
}
