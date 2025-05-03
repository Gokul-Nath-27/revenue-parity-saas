import { CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserSubscription } from "@/features/subscription/actions"
import ManageSubscription from "@/features/subscription/components/ManageSubsciption"
import { catchError } from "@/lib/utils"

export default async function ManageSubscriptionWrapper() {
  const { data: userSubscription } = await catchError(getUserSubscription())
  if (!userSubscription) {
    return <div>No subscription found</div>
  }

  return <ManageSubscription userSubscription={userSubscription} />
}

export function ManageSubscriptionSkeleton() {
  return (
    <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-64" /> {/* Text line skeleton */}
        <Skeleton className="h-4 w-48" /> {/* Smaller follow-up line if needed */}
        <Skeleton className="h-9 w-48 rounded-md" /> {/* Button skeleton */}
      </div>
    </CardContent>
  )
}

