import type { MouseEventHandler } from "react"

export interface CarProps {
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

export interface FilterProps {
  manufacturer?: string
  year?: number
  model?: string
  limit?: number
  fuel?: string
}

export interface HomeProps {
  searchParams: FilterProps
}

export interface CustomButtonProps {
  isDisabled?: boolean
  btnType?: "button" | "submit"
  containerStyles?: string
  textStyles?: string
  title: string
  rightIcon?: string
  handleClick?: MouseEventHandler<HTMLButtonElement>
}

export interface OptionProps {
  title: string
  value: string
}

export interface CustomFilterProps {
  title: string
  options: OptionProps[]
  setFilter: (value: string) => void
}

export interface ShowMoreProps {
  pageNumber: number
  isNext: boolean
  onShowMore: () => void
}

export interface SearchManuFacturerProps {
  manufacturer: string
  setManufacturer: (manufacturer: string) => void
}
