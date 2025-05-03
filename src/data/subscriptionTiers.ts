export type TierNames = keyof typeof subscriptionTiers
export type PaidTierNames = Exclude<TierNames, "Free">

export const subscriptionTiers = {
  Free: {
    name: "Free",
    priceInDollars: 0,
    maxNumberOfProducts: 1,
    maxNumberOfVisits: 500,
    canAccessAnalytics: false,
    canCustomizeBanner: false,
    canRemoveBranding: false,
    stripePriceId: null,
    description: "Perfect for trying out our platform",
    marketingLayout: {
      buttonText: "Start for Free",
      buttonVariant: "outline",
    },
    subscriptionLayout: {
      buttonText: "Start for Free",
      buttonVariant: "outline",
    },
    isPopular: false,
    features: [
      "Up to 500 monthly visitors",
      "Up to 5 products",
      "No support",
      "Basic website integration"
    ]
  },
  Standard: {
    name: "Standard",
    priceInDollars: 20,
    maxNumberOfProducts: 20,
    maxNumberOfVisits: 10000,
    canAccessAnalytics: true,
    canCustomizeBanner: true,
    canRemoveBranding: true,
    stripePriceId: process.env.STRIPE_STANDARD_PLAN_STRIPE_PRICE_ID,
    description: "For growing businesses and creators",
    marketingLayout: {
      buttonText: "Get Started",
      buttonVariant: "default",
    },
    subscriptionLayout: {
      buttonText: "Swap to Standard",
      buttonVariant: "default",
    },
    isPopular: true,
    features: [
      "Up to 10,000 monthly visitors",
      "Up to 20 products",
      "Banner customization",
      "Priority email support",
      "Multiple website integration",
      "Analytics dashboard",
    ]
  },
  Premium: {
    name: "Premium",
    priceInDollars: 49,
    maxNumberOfProducts: 50,
    maxNumberOfVisits: 1000000,
    canAccessAnalytics: true,
    canCustomizeBanner: true,
    canRemoveBranding: true,
    stripePriceId: process.env.STRIPE_PREMIUM_PLAN_STRIPE_PRICE_ID as string,
    description: "For large businesses with high volume",
    marketingLayout: {
      buttonText: "Contact Sales",
      buttonVariant: "secondary",
    },
    subscriptionLayout: {
      buttonText: "Swap to Premium",
    },
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
