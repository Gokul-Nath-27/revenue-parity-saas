import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { catchError } from "@/lib/utils";

import { getUserSubscriptionUsage } from "../db";

export default async function UsageStats() {

  const { data, error } = await catchError(getUserSubscriptionUsage())

  if (error != null || data == null) {
    return <div>Error: {error?.message}</div>
  }

  const { pageVisits, pageVisitsLimit, numberOfProducts, numberOfProductsLimit } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Page Visits */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Monthly Usage</span>
            <span>{pageVisits} / {pageVisitsLimit}</span>
          </div>
          <Progress value={(pageVisits / pageVisitsLimit) * 100} />
          <p className="text-sm text-muted-foreground mt-2">
            {pageVisits} / {pageVisitsLimit} pricing page visits this month
          </p>
        </div>

        {/* Number of Products */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Number of Products</span>
            <span>{numberOfProducts} / {numberOfProductsLimit}</span>
          </div>
          <Progress value={(numberOfProducts / numberOfProductsLimit) * 100} />
          <p className="text-sm text-muted-foreground mt-2">
            {numberOfProducts} / {numberOfProductsLimit} products created this month
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


export const UsageStatsSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Page Visits Skeleton */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <Skeleton className="h-4 w-32" /> {/* Label */}
            <Skeleton className="h-4 w-16" /> {/* Numbers */}
          </div>
          <Skeleton className="h-2 w-full rounded" /> {/* Progress bar */}
          <Skeleton className="h-4 w-3/4 mt-2" /> {/* Description */}
        </div>

        {/* Number of Products Skeleton */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <Skeleton className="h-4 w-32" /> {/* Label */}
            <Skeleton className="h-4 w-16" /> {/* Numbers */}
          </div>
          <Skeleton className="h-2 w-full rounded" /> {/* Progress bar */}
          <Skeleton className="h-4 w-3/4 mt-2" /> {/* Description */}
        </div>
      </CardContent>
    </Card>
  );
}