
import { Suspense } from "react"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import ManageSubscriptionWrapper, { ManageSubscriptionSkeleton } from "@/features/subscription/components/ManageSubscriptionWrapper"
import PricingGroup from "@/features/subscription/components/PricingGroup"
import UsageStats, { UsageStatsSkeleton } from "@/features/subscription/components/UsageStats"
import UserInformation, { UserInformationSkeleton } from "@/features/subscription/components/UserInformation"

export default async function SubscriptionPage() {
  return (
    <div className="space-y-8 bg-background text-foreground md:pt-6">
      <div>
        <h1 className="text-4xl font-bold">Your Subscription</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          You can manage your account, billing, and team settings here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Suspense fallback={<UserInformationSkeleton />}>
          <UserInformation />
        </Suspense>

        {/* Usage */}
        <Suspense fallback={<UsageStatsSkeleton />}>
          <UsageStats />
        </Suspense>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <Suspense fallback={<ManageSubscriptionSkeleton />}>
            <ManageSubscriptionWrapper />
          </Suspense>
        </Card>
      </div>
      <div className="mt-12">
        <h2 className="mb-8 text-3xl font-bold">Upgrade your plan</h2>
        <PricingGroup />
      </div>
    </div>
  )
}
