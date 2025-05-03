"use client"
import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { subscriptionTiers, PaidTierNames } from "@/data/subscriptionTiers"
import { createCheckoutSession } from "@/features/subscription/actions"
type UserSubscription = {
  tier: string
}

export default function UpgradeCheckoutClient({
  tier,
  subscription,
}: {
  tier: string
  subscription: UserSubscription
  }) {
  
  const handlePurchaseUpgrade = createCheckoutSession.bind(null, tier as PaidTierNames)

  const [_state, formAction] = useActionState(handlePurchaseUpgrade, { error: false, message: "" })

  const tierConfig = subscriptionTiers[tier as keyof typeof subscriptionTiers]

  if (!tierConfig) {
    return <div>Invalid tier: {tier}</div>
  }

  const isCurrentTier = subscription.tier === tier


  return (
    <form className="w-full" action={formAction}>
      <Button size="lg" className="w-full gap-2 font-medium">
        {isCurrentTier ? "Current Plan" : tierConfig.subscriptionLayout.buttonText}
      </Button>
    </form>
  )
}
