import { catchError } from '@/lib/utils'

import { getUserSubscription } from '../actions'

import UpgradeCheckoutClient from './UpgradeCheckoutClient'

export default async function UpgradeCheckoutWrapper({ tier }: { tier: string }) {
  const { data: subscription, error } = await catchError(getUserSubscription())

  if (error || !subscription) {
    return <div>Error: {"Something went wrong"}</div>
  }

  return (
    <UpgradeCheckoutClient tier={tier} subscription={subscription} />
  )
}
