"use client"

import { useState } from "react"
import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { UserSubscriptionType } from "@/drizzle/schemas/subscription"

import { createCustomerPortalSession } from "../actions"


export default function ManageSubscription({ userSubscription }: { userSubscription: UserSubscriptionType }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle manage subscription click
  const handleManageSubscription = async () => {
    setIsLoading(true)
    try {
      const result = await createCustomerPortalSession()
      if (result.url) {
        // Use client-side navigation to keep the user in the same tab
        window.location.href = result.url
      } else {
        setError("Failed to create customer portal session")
      }
    } catch (err) {
      console.error("Failed to manage subscription:", err)
      setError("Failed to access billing portal")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="flex flex-col gap-2">
        <p>Your current plan is <span className="font-bold">{userSubscription.tier}</span>. Upgrade to a paid plan to unlock more features.</p>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button
          variant="secondary"
          onClick={handleManageSubscription}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Manage Subscription"}
        </Button>
      </div>
    </CardContent>
  )
}