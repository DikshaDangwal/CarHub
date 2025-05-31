"use client"

import { useState } from "react"
import { fetchCars } from "@/utils"

export default function TestAPIPage() {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testAPI = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetchCars({
        manufacturer: "toyota",
        year: 2022,
        model: "camry",
        limit: 5,
        fuel_type: "",
      })

      setCars(result)
      console.log("API Response:", result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cars")
      console.error("API Error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">API Test Page</h1>

          <div className="mb-6">
            <button
              onClick={testAPI}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Testing API..." : "Test RapidAPI Connection"}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-red-800 font-semibold mb-2">API Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {cars.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="text-green-800 font-semibold mb-2">API Success!</h3>
              <p className="text-green-700">Successfully fetched {cars.length} cars from RapidAPI</p>
            </div>
          )}

          {cars.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API Response Data:</h3>
              <div className="bg-gray-100 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-sm text-gray-800">{JSON.stringify(cars, null, 2)}</pre>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Environment Check:</h4>
            <p className="text-blue-800">RAPID_API_KEY: {process.env.RAPID_API_KEY ? "✅ Configured" : "❌ Missing"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
