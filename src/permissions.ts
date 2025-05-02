import { getUserSubscriptionTier } from "@/features/subscription/db"

export async function canRemoveBranding(userId: string | null) {
  if (userId == null) return false
  const tier = await getUserSubscriptionTier(userId)
  return tier.canRemoveBranding
}

export async function canCustomizeBanner(userId: string | null) {
  if (userId == null) return false
  const tier = await getUserSubscriptionTier(userId)
  return tier.canCustomizeBanner
}
