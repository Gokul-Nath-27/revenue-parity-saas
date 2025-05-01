import { sql } from "drizzle-orm"

import { parityGroups } from "@/data/parityGroups"
import db from "@/drizzle/db"
import { CountryGroup, Country } from "@/drizzle/schemas/country"


async function main() {
  console.log("Updating country groups...")
  const groupCount = await updateCountryGroups()
  console.log("Updating countries...")
  const countryCount = await updateCountries()

  console.log(
    `Updated ${groupCount} country groups and ${countryCount} countries`
  )
}

async function updateCountryGroups() {
  const countryGroupInsertData = parityGroups.map(
    ({ name, recommendedDiscountPercentage }) => ({
      name,
      recommended_discount_percentage: recommendedDiscountPercentage
    })
  )

  const { rowCount } = await db
    .insert(CountryGroup)
    .values(countryGroupInsertData)
    .onConflictDoUpdate({
      target: CountryGroup.name,
      set: {
        recommended_discount_percentage: sql`excluded.recommended_discount_percentage`
      }
    })

  return rowCount
}

async function updateCountries() {
  const countryGroups = await db
    .select({
      id: CountryGroup.id,
      name: CountryGroup.name
    })
    .from(CountryGroup)

  const countryInsertData = parityGroups.flatMap(
    ({ countries, name }) => {
      const countryGroup = countryGroups.find(group => group.name === name)
      if (!countryGroup) {
        throw new Error(`Country group "${name}" not found`)
      }

      return countries.map(country => ({
        name: country.countryName,
        code: country.country,
        country_group_id: countryGroup.id
      }))
    }
  )

  const { rowCount } = await db
    .insert(Country)
    .values(countryInsertData)
    .onConflictDoUpdate({
      target: Country.code,
      set: {
        name: sql`excluded.name`,
        country_group_id: sql`excluded.country_group_id`
      }
    })

  return rowCount
}

main().catch(console.error)
