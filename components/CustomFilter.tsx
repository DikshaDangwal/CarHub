"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { updateSearchParams } from "@/utils"

interface Option {
  title: string
  value: string
}

interface CustomFilterProps {
  title: string
  options: Option[]
  setFilter?: (value: string) => void
}

const CustomFilter = ({ title, options, setFilter }: CustomFilterProps) => {
  const [selected, setSelected] = useState(options[0])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleUpdateParams = (option: Option) => {
    setSelected(option)
    setIsOpen(false)

    if (setFilter) {
      setFilter(option.value.toLowerCase())
    } else {
      const newPathName = updateSearchParams(title, option.value.toLowerCase())
      router.push(newPathName)
    }
  }

  return (
    <div className="w-fit" ref={dropdownRef}>
      <div className="relative">
        <button
          className="flex items-center justify-between min-w-[127px] px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <span className="flex-1 text-left capitalize">{selected.title}</span>
          <ChevronDown className={`ml-2 h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {options.map((option) => (
              <button
                key={option.title}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-900"
                onClick={() => handleUpdateParams(option)}
              >
                <span className="capitalize">{option.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { CustomFilter }
export default CustomFilter
