"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { UserSubscriptionType } from "@/drizzle/schemas/subscription"

import { createCustomerPortalSession } from "../actions"


export default function ManageSubscription({ userSubscription }: { userSubscription: UserSubscriptionType }) {
  const [_state, formAction] = useActionState(createCustomerPortalSession, { error: false })

  return (
    <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="flex flex-col gap-2">
        <p>Your current plan is <span className="font-bold">{userSubscription.tier}</span>. Upgrade to a paid plan to unlock more features.</p>
        <form action={formAction}>
          <Button variant="secondary">Manage Subscription</Button>
        </form>
      </div>
    </CardContent>
  )
}