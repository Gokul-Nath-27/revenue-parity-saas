import { subscriptionTiers, TierNames } from "@/data/subscriptionTiers"
import db from "@/drizzle/db"

export async function getUserSubscriptionTier(userId: string) {
  const subscription = await db.query.UserSubscription.findFirst({
    where: ({ user_id }, { eq }) => eq(user_id, userId),
  })

  if (subscription == null) throw new Error("User has no subscription")

  return subscriptionTiers[subscription.tier as TierNames]
}

