"use client"

import { useState, useEffect } from "react"
import { getCars, type CarData } from "../../lib/supabase"
import DatabaseCarCard from "../../components/DatabaseCarCard"
import CustomFilter from "../../components/CustomFilter"
import { fuels, yearsOfProduction } from "../../constants"

export default function DatabaseCarsPage() {
  const [cars, setCars] = useState<CarData[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    year: undefined as number | undefined,
    fuel_type: "",
    limit: 20,
  })

  useEffect(() => {
    fetchCars()
  }, [filters])

  const fetchCars = async () => {
    setLoading(true)
    try {
      const data = await getCars(filters)
      setCars(data || [])
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <main className="overflow-hidden">
      <div className="mt-12 padding-x padding-y max-width">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Database Cars</h1>
          <p>Cars stored in our database</p>
        </div>

        <div className="home__filters">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search make..."
              value={filters.make}
              onChange={(e) => updateFilter("make", e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Search model..."
              value={filters.model}
              onChange={(e) => updateFilter("model", e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="home__filter-container">
            <CustomFilter
              title="fuel"
              options={fuels}
              setFilter={(value: string) => updateFilter("fuel_type", value)}
            />
            <CustomFilter
              title="year"
              options={yearsOfProduction}
              setFilter={(value: string) => updateFilter("year", Number.parseInt(value) || undefined)}
            />
          </div>
        </div>

        {loading ? (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Loading...</h2>
          </div>
        ) : cars.length > 0 ? (
          <section>
            <div className="home__cars-wrapper">
              {cars.map((car) => (
                <DatabaseCarCard key={car.id} car={car} />
              ))}
            </div>
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">No cars found</h2>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </main>
  )
}
