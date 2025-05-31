"use client"
import Image from "next/image"
import { X } from "lucide-react"
import { generateCarImageUrl } from "@/utils"

interface CarDetailsProps {
  isOpen: boolean
  closeModal: () => void
  car: any
}

const CarDetails = ({ isOpen, closeModal, car }: CarDetailsProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={closeModal} />

        {/* Modal panel */}
        <div className="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <button
            type="button"
            className="absolute top-2 right-2 w-10 h-10 rounded-full bg-primary-blue-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            onClick={closeModal}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex-1 flex flex-col gap-3">
            <div className="relative w-full h-40 bg-pattern bg-cover bg-center rounded-lg">
              <Image
                src={generateCarImageUrl(car) || "/placeholder.svg"}
                alt="car model"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative w-full h-24 bg-primary-blue-100 rounded-lg">
                <Image
                  src={generateCarImageUrl(car, "29") || "/placeholder.svg"}
                  alt="car model"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <div className="flex-1 relative w-full h-24 bg-primary-blue-100 rounded-lg">
                <Image
                  src={generateCarImageUrl(car, "33") || "/placeholder.svg"}
                  alt="car model"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <div className="flex-1 relative w-full h-24 bg-primary-blue-100 rounded-lg">
                <Image
                  src={generateCarImageUrl(car, "13") || "/placeholder.svg"}
                  alt="car model"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <h2 className="font-semibold text-xl capitalize">
              {car.make} {car.model}
            </h2>

            <div className="mt-3 flex flex-wrap gap-4">
              {Object.entries(car).map(([key, value]) => (
                <div className="flex justify-between gap-5 w-full text-right" key={key}>
                  <h4 className="text-grey capitalize">{key.split("_").join(" ")}</h4>
                  <p className="text-black-100 font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetails
