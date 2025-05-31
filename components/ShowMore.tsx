"use client"

import { useRouter } from "next/navigation"
import CustomButton from "./CustomButton"
import { updateSearchParams } from "@/utils"

interface ShowMoreProps {
  pageNumber: number
  isNext: boolean
  onShowMore?: () => void
}

const ShowMore = ({ pageNumber, isNext, onShowMore }: ShowMoreProps) => {
  const router = useRouter()

  const handleNavigation = () => {
    if (onShowMore) {
      onShowMore()
    } else {
      // Calculate the new limit based on the page number and navigation type
      const newLimit = (pageNumber + 1) * 10

      // Update the "limit" search parameter in the URL with the new value
      const newPathname = updateSearchParams("limit", `${newLimit}`)

      router.push(newPathname)
    }
  }

  return (
    <div className="w-full flex justify-end mt-10">
      {!isNext && (
        <CustomButton
          btnType="button"
          title="Show More"
          containerStyles="bg-primary-blue rounded-full text-white"
          handleClick={handleNavigation}
        />
      )}
    </div>
  )
}

export { ShowMore }
export default ShowMore
