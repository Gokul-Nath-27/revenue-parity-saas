export type TierNames = keyof typeof subscriptionTiers
export type PaidTierNames = Exclude<TierNames, "Free">

export const subscriptionTiers = {
  Free: {
    name: "Free",
    priceInCents: 0,
    maxNumberOfProducts: 1,
    maxNumberOfVisits: 5000,
    canAccessAnalytics: false,
    canCustomizeBanner: true,
    canRemoveBranding: false,
    stripePriceId: null,
    description: "Perfect for trying out our platform",
    buttonText: "Start for Free",
    buttonVariant: "outline",
    isPopular: false,
    features: [
      "Up to 5,000 monthly visitors",
      "Up to 1 product",
      "No support",
      "Basic website integration"
    ]
  },
  Standard: {
    name: "Standard",
    priceInCents: 4900,
    maxNumberOfProducts: 30,
    maxNumberOfVisits: 100000,
    canAccessAnalytics: true,
    canCustomizeBanner: true,
    canRemoveBranding: true,
    stripePriceId: process.env.STRIPE_STANDARD_PLAN_STRIPE_PRICE_ID,
    description: "For growing businesses and creators",
    buttonText: "Get Started",
    buttonVariant: "default",
    isPopular: true,
    features: [
      "Up to 100,000 monthly visitors",
      "Up to 30 products",
      "Banner customization",
      "Priority email support",
      "Multiple website integration",
      "Analytics dashboard",
    ]
  },
  Premium: {
    name: "Premium",
    priceInCents: 9900,
    maxNumberOfProducts: 50,
    maxNumberOfVisits: 1000000,
    canAccessAnalytics: true,
    canCustomizeBanner: true,
    canRemoveBranding: true,
    stripePriceId: process.env.STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID,
    description: "For large businesses with high volume",
    buttonText: "Contact Sales",
    buttonVariant: "secondary",
    isPopular: false,
    features: [
      "Up to 1,000,000 monthly visitors",
      "Up to 50 products",
      "Advanced banner development",
      "24/7 dedicated support",
      "Advanced revenue analytics",
      "A/B testing capabilities",
      "Multi-team collaboration",
      "Custom integrations",
      "Remove branding"
    ]
  },
} as const

export const subscriptionTiersInOrder = [
  subscriptionTiers.Free,
  subscriptionTiers.Standard,
  subscriptionTiers.Premium,
] as const

export function getTierByPriceId(stripePriceId: string) {
  return Object.values(subscriptionTiers).find(
    tier => tier.stripePriceId === stripePriceId
  )
}
