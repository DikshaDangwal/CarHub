"use client"

import Image from "next/image"

interface ButtonProps {
  isDisabled?: boolean
  btnType?: "button" | "submit"
  containerStyles?: string
  textStyles?: string
  title: string
  rightIcon?: string
  handleClick?: () => void
}

const CustomButton = ({
  isDisabled,
  btnType,
  containerStyles,
  textStyles,
  title,
  rightIcon,
  handleClick,
}: ButtonProps) => (
  <button
    disabled={isDisabled}
    type={btnType || "button"}
    className={`custom-btn ${containerStyles}`}
    onClick={handleClick}
  >
    <span
      className={`flex-1 whitespace-normal text-center md:text-left truncate transition-all duration-200 px-1 md:px-2 ${textStyles}`}
    >
      {title}
    </span>
    {rightIcon && (
      <div className="relative w-6 h-6">
        <Image src={rightIcon || "/placeholder.svg"} alt="arrow_left" fill className="object-contain" />
      </div>
    )}
  </button>
)

export default CustomButton
