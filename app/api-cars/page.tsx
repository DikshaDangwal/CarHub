import { fetchCarsAction } from "@/lib/actions"
import { CarCard } from "@/components/CarCard"
import { SearchBar } from "@/components/SearchBar"
import { CustomFilter } from "@/components/CustomFilter"
import { ShowMore } from "@/components/ShowMore"
import { fuels, yearsOfProduction } from "@/constants"
import type { FilterProps } from "@/types"

interface SearchParams {
  manufacturer?: string
  year?: string
  fuel?: string
  limit?: string
  model?: string
}

export default async function ApiCarsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const filters: FilterProps = {
    manufacturer: searchParams.manufacturer || "",
    year: searchParams.year ? Number.parseInt(searchParams.year) : undefined,
    model: searchParams.model || "",
    limit: searchParams.limit ? Number.parseInt(searchParams.limit) : 10,
    fuel: searchParams.fuel || "",
  }

  const allCars = await fetchCarsAction(filters)
  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars

  return (
    <main className="overflow-hidden">
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Real-Time Car Data</h1>
          <p className="text-gray-600">Explore cars fetched directly from the RapidAPI Cars database</p>
        </div>

        <div className="home__filters">
          <SearchBar />

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} />
            <CustomFilter title="year" options={yearsOfProduction} />
          </div>
        </div>

        {!isDataEmpty ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car, index) => (
                <CarCard car={car} key={`${car.make}-${car.model}-${index}`} />
              ))}
            </div>

            <ShowMore pageNumber={(filters.limit || 10) / 10} isNext={(filters.limit || 10) > allCars.length} />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, no results</h2>
            <p>No cars found matching your search criteria.</p>
          </div>
        )}
      </div>
    </main>
  )
}
