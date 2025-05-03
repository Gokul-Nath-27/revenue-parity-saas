"use server"
import { getProductCount } from "@/features/products/db"
import { getUserSubscriptionTier } from "@/features/subscription/db"

import { withAuthUserId } from "./lib/with-auth"

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

export const canCreateProduct = withAuthUserId(async (userId) => {
  const tier = await getUserSubscriptionTier(userId)
  const productCount = await getProductCount(userId)
  return productCount < tier.maxNumberOfProducts
})
