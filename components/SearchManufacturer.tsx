"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"
import { manufacturers } from "@/constants"

interface SearchManufacturerProps {
  manufacturer: string
  setManuFacturer: (manufacturer: string) => void
}

const SearchManufacturer = ({ manufacturer, setManuFacturer }: SearchManufacturerProps) => {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredManufacturers =
    query === ""
      ? manufacturers
      : manufacturers.filter((item) =>
          item.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, "")),
        )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="search-manufacturer" ref={dropdownRef}>
      <div className="relative">
        <div className="search-manufacturer__input">
          <Search className="search-manufacturer__icon" />
          <input
            className="search-manufacturer__input-field"
            placeholder="Volkswagen..."
            value={query || manufacturer}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {isOpen && (
          <div className="search-manufacturer__options">
            {filteredManufacturers.length === 0 ? (
              <div className="search-manufacturer__option">
                <span className="text-gray-500">No manufacturers found</span>
              </div>
            ) : (
              filteredManufacturers.map((item) => (
                <button
                  key={item}
                  className="search-manufacturer__option"
                  onClick={() => {
                    setManuFacturer(item)
                    setQuery("")
                    setIsOpen(false)
                  }}
                >
                  {item}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchManufacturer
