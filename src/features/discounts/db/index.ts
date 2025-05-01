import { inArray, sql, and, eq } from "drizzle-orm";
import { BatchItem } from "drizzle-orm/batch";

import db from "@/drizzle/db";
import { CountryGroupDiscount } from "@/drizzle/schemas";
import { getProductDetails } from "@/features/products/db";
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
      recommendedDiscount: group.recommended_discount_percentage,
      countries: group.countries,
      discount: {
        discountPercentage: group.country_group_discounts.at(0)?.discount_percentage,
        coupon: group.country_group_discounts.at(0)?.coupon,
      }
      }
    })
  }
);

export const updateCountryDiscounts = withAuthUserId(
  async (
    _,
    deleteGroup: { country_group_id: string }[],
    insertGroup: (typeof CountryGroupDiscount.$inferInsert)[],
    { productId }: { productId: string }
  ) => {
    try {
      // Validate product exists and belongs to user
      const product = await getProductDetails(productId)

      if (!product) {
        throw new Error('Product not found or unauthorized');
      }

      const statements: BatchItem<"pg">[] = [];

      if (deleteGroup.length > 0) {
        statements.push(
          db.delete(CountryGroupDiscount).where(
            and(
              eq(CountryGroupDiscount.product_id, productId),
              inArray(
                CountryGroupDiscount.country_group_id,
                deleteGroup.map((group) => group.country_group_id)
              )
            )
          )
        );
      }

      if (insertGroup.length > 0) {
        statements.push(
          db
            .insert(CountryGroupDiscount)
            .values(insertGroup)
            .onConflictDoUpdate({
              target: [
                CountryGroupDiscount.product_id,
                CountryGroupDiscount.country_group_id,
              ],
              set: {
                coupon: sql`excluded.coupon`,
                discount_percentage: sql`excluded.discount_percentage`,
              },
            })
        );
      }

      if (statements.length > 0) {
        await db.batch(statements as [BatchItem<"pg">]);
      }

      return true;
    } catch (error) {
      console.error('Error updating country discounts:', error);
      throw new Error('Failed to update country discounts');
    }
  }
);