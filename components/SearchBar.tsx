"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Search, MapPin } from "lucide-react"
import SearchManufacturer from "./SearchManufacturer"

interface SearchBarProps {
  onSearch?: (manufacturer: string, model: string) => void
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [manufacturer, setManufacturer] = useState("")
  const [model, setModel] = useState("")

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (manufacturer.trim() === "" && model.trim() === "") {
        return alert("Please provide some input")
      }

      if (onSearch) {
        onSearch(manufacturer.toLowerCase(), model.toLowerCase())
      }
    },
    [manufacturer, model, onSearch],
  )

  return (
    <form className="w-full" onSubmit={handleSearch} role="search" aria-label="Search for cars">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Manufacturer Search */}
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </div>
          <SearchManufacturer manufacturer={manufacturer} setManufacturer={setManufacturer} />
        </div>

        {/* Model Search */}
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <MapPin className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </div>
          <label htmlFor="model-input" className="sr-only">
            Car model
          </label>
          <input
            id="model-input"
            type="text"
            name="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Enter car model (e.g., Camry, M3, Model S)"
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
            aria-describedby="model-hint"
          />
          <div id="model-hint" className="sr-only">
            Enter the specific model of the car you're looking for
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Search for cars"
        >
          <Search className="w-5 h-5" aria-hidden="true" />
          <span className="hidden sm:inline">Search Cars</span>
          <span className="sm:hidden">Search</span>
        </button>
      </div>
    </form>
  )
}

export { SearchBar }
export default SearchBar
