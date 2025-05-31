"use client"

import { useState, memo } from "react"
import Image from "next/image"
import { Heart, Eye, Fuel, Gauge, Settings, Zap } from "lucide-react"
import { calculateCarRent } from "@/utils"
import CarDetails from "./CarDetails"

interface CarProps {
  city_mpg: number
  class: string
  combination_mpg: number
  cylinders: number
  displacement: number
  drive: string
  fuel_type: string
  highway_mpg: number
  make: string
  model: string
  transmission: string
  year: number
}

interface CarCardProps {
  car: CarProps
  index?: number
}

const CarCard = memo(({ car, index = 0 }: CarCardProps) => {
  const [isLiked, setIsLiked] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const carRent = calculateCarRent(car.city_mpg, car.year)

  // Enhanced image selection with real demo images
  const getCarImage = () => {
    const carKey = `${car.make.toLowerCase()}-${car.model.toLowerCase().replace(/\s+/g, "-")}`

    // Demo car images mapping
    const imageMap: { [key: string]: string } = {
      "bmw-m3": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
      "mercedes-benz-amg": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop",
      "lamborghini-huracan": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop",
      "ferrari-roma": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=250&fit=crop",
      "tesla-model-3": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop",
      "tesla-model-y": "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=250&fit=crop",
      "audi-q5": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop",
      "porsche-cayenne": "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=250&fit=crop",
      "toyota-camry": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop",
      "honda-civic": "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=250&fit=crop",
      "subaru-outback": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop",
      "volkswagen-jetta": "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=250&fit=crop",
      "lexus-es": "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=250&fit=crop",
      "chevrolet-corvette": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop",
      "mazda-cx-5": "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=250&fit=crop",
      "ford-f-150": "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=250&fit=crop",
    }

    // Fallback images by car class
    const classFallbacks: { [key: string]: string } = {
      luxury: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
      sports: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop",
      suv: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop",
      sedan: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop",
      "compact car": "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=250&fit=crop",
      "midsize car": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop",
      pickup: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=250&fit=crop",
    }

    return (
      imageMap[carKey] ||
      classFallbacks[car.class.toLowerCase()] ||
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=250&fit=crop"
    )
  }

  // Optimized transmission display
  const getTransmissionDisplay = (transmission: string) => {
    const transmissionMap: { [key: string]: string } = {
      a: "Automatic",
      m: "Manual",
      am: "Auto/Manual",
    }
    return transmissionMap[transmission.toLowerCase()] || "Automatic"
  }

  // Optimized drive display
  const getDriveDisplay = (drive: string) => {
    const driveMap: { [key: string]: string } = {
      fwd: "Front-Wheel Drive",
      rwd: "Rear-Wheel Drive",
      awd: "All-Wheel Drive",
      "4wd": "Four-Wheel Drive",
    }
    return driveMap[drive.toLowerCase()] || "All-Wheel Drive"
  }

  // Optimized fuel icon
  const getFuelIcon = (fuelType: string) => {
    return fuelType === "electricity" ? (
      <Zap className="w-4 h-4" aria-hidden="true" />
    ) : (
      <Fuel className="w-4 h-4" aria-hidden="true" />
    )
  }

  // Calculate rating based on car specs
  const getCarRating = () => {
    let rating = 3
    if (car.city_mpg > 25) rating += 0.5
    if (car.year >= 2022) rating += 0.5
    if (car.fuel_type === "electricity") rating += 1
    if (car.class === "luxury" || car.class === "sports") rating += 0.5
    return Math.min(5, rating)
  }

  const rating = getCarRating()

  return (
    <>
      <article
        className="car-card group"
        style={{ animationDelay: `${index * 50}ms` }}
        role="article"
        aria-label={`${car.make} ${car.model} - $${carRent} per day`}
      >
        <div className="car-card__content">
          <div className="car-card__content-title">
            <h3 className="car-card__content-title-text">
              {car.make} {car.model}
            </h3>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`car-card__heart ${isLiked ? "car-card__heart--liked" : ""}`}
              aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={isLiked}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Rating */}
          <div
            className="flex items-center gap-1 mb-3"
            role="img"
            aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}
          >
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
            <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
          </div>

          <div className="car-card__price">
            <span className="car-card__price-dollar">$</span>
            <span className="car-card__price-day">{carRent}</span>
            <span className="car-card__price-text">/day</span>
          </div>
        </div>

        <div className="relative w-full h-40 my-3">
          <Image
            src={getCarImage() || "/placeholder.svg"}
            alt={`${car.make} ${car.model} ${car.year}`}
            fill
            priority={index < 4}
            className="object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Quick View Overlay */}
          <div className="car-card__overlay">
            <button
              onClick={() => setShowDetails(true)}
              className="car-card__overlay-btn"
              aria-label={`Quick view details for ${car.make} ${car.model}`}
            >
              <Eye className="w-5 h-5 mr-2" aria-hidden="true" />
              Quick View
            </button>
          </div>
        </div>

        <div className="relative flex w-full mt-2">
          {/* Car Specifications */}
          <div className="car-card__group">
            <div className="car-card__group-flex">
              <div className="car-card__icon-container">
                <Settings className="w-4 h-4" aria-hidden="true" />
              </div>
              <p className="car-card__icon-text">{getTransmissionDisplay(car.transmission)}</p>
            </div>

            <div className="car-card__group-flex">
              <div className="car-card__icon-container">
                <Gauge className="w-4 h-4" aria-hidden="true" />
              </div>
              <p className="car-card__icon-text">{getDriveDisplay(car.drive)}</p>
            </div>

            <div className="car-card__group-flex">
              <div className="car-card__icon-container">{getFuelIcon(car.fuel_type)}</div>
              <p className="car-card__icon-text">
                {car.fuel_type === "electricity" ? `${car.city_mpg} MPGe` : `${car.city_mpg} MPG`}
              </p>
            </div>
          </div>

          <div className="car-card__btn-container">
            <button
              className="car-card__btn"
              onClick={() => setShowDetails(true)}
              aria-label={`View more details for ${car.make} ${car.model}`}
            >
              <span className="flex-1">View More</span>
              <div className="relative w-6 h-6 ml-2">
                <Image src="/right-arrow.svg" alt="" fill className="object-contain" aria-hidden="true" />
              </div>
            </button>
          </div>
        </div>
      </article>

      {/* Car Details Modal */}
      <CarDetails isOpen={showDetails} closeModal={() => setShowDetails(false)} car={car} />
    </>
  )
})

CarCard.displayName = "CarCard"

export { CarCard }
export default CarCard
