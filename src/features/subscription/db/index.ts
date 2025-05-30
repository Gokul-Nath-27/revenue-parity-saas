import { eq, count, gte, and, SQL } from "drizzle-orm"
import { cache } from "react"

import { subscriptionTiers, TierNames } from "@/data/subscriptionTiers"
import db from "@/drizzle/db"
import { Product } from "@/drizzle/schemas/product"
import { UserSubscription } from "@/drizzle/schemas/subscription"
import { ProductView } from "@/drizzle/schemas/visits"
import { startOfMonth } from "@/lib/utils"
import { withAuthUserId } from "@/lib/with-auth"
export const getUserSubscriptionTier = cache(async (userId: string) => {
  const subscription = await db.query.UserSubscription.findFirst({
    where: ({ user_id }, { eq }) => eq(user_id, userId),
  })

  if (subscription == null) throw new Error("User has no subscription")

  return subscriptionTiers[subscription.tier as TierNames]
})

export const getUserSubscriptionUsage = withAuthUserId(
  async function (userId) {
    const tier = await getUserSubscriptionTier(userId)
    const productCount = await db.select({ count: count() }).from(Product).where(eq(Product.user_id, userId))

    const visits = await db
    .select({ pricingViewCount: count() })
    .from(ProductView)
    .innerJoin(Product, eq(Product.id, ProductView.product_id))
    .where(
      and(
        eq(Product.user_id, userId),
        gte(ProductView.visited_at, startOfMonth(new Date()))
      )
    )


    if (tier == null) throw new Error("User has no subscription")

  return {
      pageVisits: visits[0].pricingViewCount,
      pageVisitsLimit: tier.maxNumberOfVisits,
      numberOfProducts: productCount[0].count,
      numberOfProductsLimit: tier.maxNumberOfProducts,
    }
  }
)


export const getUserSubscriptionFromDb = async (userId: string) => {
  const subscription = await db.query.UserSubscription.findFirst({
    where: ({ user_id }, { eq }) => eq(user_id, userId),
    columns: {
      id: true,
      tier: true,
      stripe_customer_id: true,
      stripe_subscription_id: true,
      stripe_subscription_item_id: true,
      user_id: true,
    },
  })
  return subscription
}

export async function updateUserSubscription(
  where: SQL,
  data: Partial<typeof UserSubscription.$inferInsert>
) {
  const [updatedSubscription] = await db
    .update(UserSubscription)
    .set(data)
    .where(where)
    .returning({
      id: UserSubscription.id,
      userId: UserSubscription.user_id,
    })
  return updatedSubscription
}