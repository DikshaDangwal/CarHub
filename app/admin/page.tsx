"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { insertCar, updateCar, deleteCar, getCars, type CarData } from "../../lib/supabase"

export default function AdminPage() {
  const [cars, setCars] = useState<CarData[]>([])
  const [loading, setLoading] = useState(false)
  const [editingCar, setEditingCar] = useState<CarData | null>(null)
  const [formData, setFormData] = useState<CarData>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    fuel_type: "",
    transmission: "",
    drive: "",
    city_mpg: 0,
    highway_mpg: 0,
    combination_mpg: 0,
    cylinders: 0,
    displacement: 0,
    class: "",
  })

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    setLoading(true)
    try {
      const data = await getCars()
      setCars(data || [])
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingCar) {
        await updateCar(editingCar.id!, formData)
      } else {
        await insertCar(formData)
      }

      await fetchCars()
      resetForm()
    } catch (error) {
      console.error("Error saving car:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (car: CarData) => {
    setEditingCar(car)
    setFormData(car)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this car?")) {
      setLoading(true)
      try {
        await deleteCar(id)
        await fetchCars()
      } catch (error) {
        console.error("Error deleting car:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setEditingCar(null)
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      fuel_type: "",
      transmission: "",
      drive: "",
      city_mpg: 0,
      highway_mpg: 0,
      combination_mpg: 0,
      cylinders: 0,
      displacement: 0,
      class: "",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("mpg") || name === "year" || name === "cylinders" || name === "displacement"
          ? Number(value)
          : value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Car Database Admin</h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Make</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="gas">Gas</option>
                  <option value="electricity">Electricity</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Transmission</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Transmission</option>
                  <option value="a">Automatic</option>
                  <option value="m">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Drive</label>
                <select
                  name="drive"
                  value={formData.drive}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Drive</option>
                  <option value="fwd">FWD</option>
                  <option value="rwd">RWD</option>
                  <option value="awd">AWD</option>
                  <option value="4wd">4WD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">City MPG</label>
                <input
                  type="number"
                  name="city_mpg"
                  value={formData.city_mpg}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Highway MPG</label>
                <input
                  type="number"
                  name="highway_mpg"
                  value={formData.highway_mpg}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cylinders</label>
                <input
                  type="number"
                  name="cylinders"
                  value={formData.cylinders}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : editingCar ? "Update Car" : "Add Car"}
                  </button>

                  {editingCar && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Cars List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fuel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MPG
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cars.map((car) => (
                    <tr key={car.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {car.make} {car.model}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.fuel_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.city_mpg}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEdit(car)} className="text-blue-600 hover:text-blue-900 mr-4">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(car.id!)} className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
