
import { Metadata } from "next"
import { Suspense } from "react"

import DashboardHeader from "@/components/layout/dashboard-header"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import ManageSubscriptionWrapper, { ManageSubscriptionSkeleton } from "@/features/subscription/components/ManageSubscriptionWrapper"
import PricingGroup from "@/features/subscription/components/PricingGroup"
import UsageStats, { UsageStatsSkeleton } from "@/features/subscription/components/UsageStats"
import UserInformation, { UserInformationSkeleton } from "@/features/subscription/components/UserInformation"

export const metadata: Metadata = {
  title: "Subscription - RevenueParity",
  description: "Manage your subscription",
};

export default async function SubscriptionPage() {
  return (
    <DashboardHeader
      title="Your Subscription"
      description="You can manage your account, billing, and team settings here."
    >
      <>
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
      </>
    </DashboardHeader>
  )
}
