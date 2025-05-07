
import { getUserSubscription } from '@/features/subscription/actions'
import UpgradeCheckoutClient from '@/features/subscription/components/UpgradeCheckoutClient'
import { catchError } from '@/lib/utils'

export default async function UpgradeCheckoutWrapper({ tier }: { tier: string }) {
  const { data: subscription, error } = await catchError(getUserSubscription())

  if (error || !subscription) {
    return <div>Error: {"Something went wrong"}</div>
  }

  return (
    <UpgradeCheckoutClient tier={tier} subscription={subscription} />
  )
}
