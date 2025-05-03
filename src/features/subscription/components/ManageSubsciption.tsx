import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserSubscription } from "@/features/subscription/actions"
import { catchError } from "@/lib/utils"


export default async function ManageSubscription() {
  const { data: userSubscription } = await catchError(getUserSubscription())
  
  if (!userSubscription) {
    return <div>No subscription found</div>
  }

  return (
    <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="flex flex-col gap-2">
        <p>Your current plan is <span className="font-bold">{userSubscription.tier}</span>. Upgrade to a paid plan to unlock more features.</p>
        <Button variant="secondary">Manage Subscription</Button>
      </div>
    </CardContent>
  )
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