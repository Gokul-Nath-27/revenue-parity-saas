import db from "@/drizzle/db";
import { withAuthUserId } from "@/lib/with-auth";


export const getCountryGroupDiscounts = withAuthUserId(
  async (_, productId: string) => {
    const data = await db.query.CountryGroup.findMany({
      with: {
        countries: {
        columns: {
          name: true, 
          code: true,
        },
      },
      country_group_discounts: {
        columns: {
          coupon: true,
          discount_percentage: true,
        },
        where: ({ product_id: id }, { eq }) => eq(id, productId),
        limit: 1,
      },
    },
  })

  return data.map(group => {
    return {
      id: group.id,
      name: group.name,
      recommendedDiscountPercentage: group.recommended_discount_percentage,
      countries: group.countries,
        discount: group.country_group_discounts.at(0),
      }
    })
  }
);