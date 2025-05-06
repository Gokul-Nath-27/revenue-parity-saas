"use client"
import { cva } from "class-variance-authority"
import { useState, useActionState } from "react"

import { TierNames, subscriptionTiers, PaidTierNames } from "@/data/subscriptionTiers"
import { createCheckoutSession, updateSubscription } from "@/features/subscription/actions"
import { cn } from "@/lib/utils"

// Types moved to top for better organization
type UserSubscription = {
  tier: string
  stripe_subscription_id: string | null
}

type SubscriptionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

// Extracted button styles to keep component logic cleaner
const subscriptionButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Extracted into a separate component
function SubscriptionButton({
  className,
  variant,
  size,
  disabled,
  ...props
}: SubscriptionButtonProps) {
  const cursorClass = disabled ? "cursor-not-allowed" : "cursor-pointer"

  return (
    <button
      className={cn(subscriptionButtonVariants({ variant, size, className }), cursorClass)}
      disabled={disabled}
      {...props}
    />
  )
}

export default function UpgradeCheckoutClient({
  tier,
  subscription,
}: {
  tier: string
  subscription: UserSubscription
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Extract tier information
  const tierConfig = subscriptionTiers[tier as keyof typeof subscriptionTiers]
  const {
    isCurrentTier,
    isCurrentPaidTier,
    cannotSelect,
    buttonText,
    buttonVariant
  } = useSubscriptionState(tier, subscription)

  // For new subscriptions or users on free plan - create action state for form submission
  const [_state, _formAction] = useActionState(async () => {
    const result = await createCheckoutSession(tier as PaidTierNames)
    if (result.url) {
      window.location.href = result.url
    }
    return result
  }, { error: false, message: "" })

  if (!tierConfig) {
    return <div>Invalid tier: {tier}</div>
  }

  // Use lookup-based subscription state

  // Client-side handler for subscription purchases
  const handleCheckoutNavigation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await createCheckoutSession(tier as PaidTierNames)

      if (result.error || !result.url) {
        setError(result.message || "Failed to create checkout session")
        setIsLoading(false)
        return
      }

      // Navigate to the checkout URL in the same tab
      window.location.href = result.url
    } catch (error) {
      console.error("Checkout error:", error)
      setError("Failed to process checkout. Please try again.")
      setIsLoading(false)
    }
  }

  // For users already on a paid plan
  const handlePlanSwitch = async () => {
    if (!subscription.stripe_subscription_id) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await createCheckoutSession(tier as PaidTierNames)

      if (result.error || !result.url) {
        throw new Error(result.message || "Failed to create checkout session")
      }

      // Navigate to the checkout URL in the same tab
      window.location.href = result.url
    } catch (portalError) {
      console.error("Failed to redirect to billing portal:", portalError)
      try {
        // Fall back to direct subscription update
        await updateSubscription(tier as PaidTierNames, subscription.stripe_subscription_id)
        window.location.reload()
      } catch (updateError) {
        console.error("Failed to update subscription:", updateError)
        setError("Failed to update subscription. Please try again later.")
        setIsLoading(false)
      }
    }
  }

  // Determine which renderer to use based on subscription status
  type RendererKey = "currentPlan" | "paidPlanSwitch" | "newSubscription"

  // Determine which renderer to use for the button
  const getRendererKey = (): RendererKey => {
    if (isCurrentTier || (tier === "Free" && !isCurrentPaidTier)) return "currentPlan"
    if (isCurrentPaidTier) return "paidPlanSwitch"
    return "newSubscription"
  }

  // Map of renderers for different subscription states
  const renderers: Record<RendererKey, React.ReactNode> = {
    currentPlan: (
      <SubscriptionButton
        size="lg"
        className="w-full gap-2 font-medium"
        variant={buttonVariant}
        disabled={cannotSelect}
      >
        {buttonText}
      </SubscriptionButton>
    ),
    paidPlanSwitch: (
      <SubscriptionButton
        size="lg"
        className="w-full gap-2 font-medium"
        variant={buttonVariant}
        onClick={handlePlanSwitch}
        disabled={isLoading || cannotSelect}
      >
        {isLoading ? "Processing..." : buttonText}
      </SubscriptionButton>
    ),
    newSubscription: (
      <SubscriptionButton
        size="lg"
        className="w-full gap-2 font-medium"
        variant={buttonVariant}
        onClick={handleCheckoutNavigation}
        disabled={isLoading || cannotSelect}
      >
        {isLoading ? "Processing..." : buttonText}
      </SubscriptionButton>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {error && <div className="mb-2 text-sm text-destructive">{error}</div>}
      {renderers[getRendererKey()]}
    </div>
  )
}

// Helper to calculate subscription state using lookup tables
function useSubscriptionState(tier: string, subscription: UserSubscription) {
  const currentTier = subscription.tier as TierNames

  // Determine subscription state
  const isCurrentTier = currentTier === tier
  const isPaidTier = tier !== "Free"
  const isCurrentPaidTier = currentTier !== "Free" && subscription.stripe_subscription_id

  // Create a unique key to look up configuration
  type StateKey = string
  const getStateKey = (): StateKey => `${currentTier}->${tier}`

  // Determine relationship between current tier and target tier
  const tierRelationship: Record<StateKey, "current" | "upgrade" | "downgrade" | "switch"> = {
    "Free->Free": "current",
    "Standard->Standard": "current",
    "Premium->Premium": "current",
    "Free->Standard": "upgrade",
    "Free->Premium": "upgrade",
    "Standard->Premium": "upgrade",
    "Premium->Standard": "downgrade",
    "Standard->Free": "current", // Can't downgrade to free manually
    "Premium->Free": "current",  // Can't downgrade to free manually
  }

  const relationship = tierRelationship[getStateKey()] || "switch"

  // Lookup table for button text
  const buttonTextMap: Record<string, string> = {
    "current": "Current Plan",
    "upgrade": `Upgrade to ${tier}`,
    "downgrade": `Downgrade to ${tier}`,
    "switch": `Switch to ${tier}`
  }

  // Special case for Free tier
  const buttonText = tier === "Free" && !isCurrentTier
    ? "Basic Plan"
    : buttonTextMap[relationship]

  // Lookup table for button variants
  const buttonVariantMap: Record<string, "default" | "outline" | "secondary"> = {
    "current": "secondary",
    "upgrade": "default",
    "downgrade": "outline",
    "switch": "default"
  }

  // Special case for Free tier
  const buttonVariant = tier === "Free" && !isCurrentTier
    ? "outline"
    : buttonVariantMap[relationship]

  // Cannot select current tier or downgrade to free
  const cannotSelect = isCurrentTier || (tier === "Free" && currentTier !== "Free")

  return {
    isCurrentTier,
    isPaidTier,
    isCurrentPaidTier,
    isUpgrade: relationship === "upgrade",
    isDowngrade: relationship === "downgrade",
    cannotSelect,
    buttonText,
    buttonVariant
  }
}