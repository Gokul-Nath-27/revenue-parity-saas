import { eq } from "drizzle-orm"
import { NextRequest } from "next/server"
import Stripe from "stripe"

import { getTierByPriceId, subscriptionTiers } from "@/data/subscriptionTiers"
import { UserSubscription } from "@/drizzle/schemas/subscription"
import { updateUserSubscription } from "@/features/subscription/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(request: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await request.text(),
    request.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  )

  switch (event.type) {
    case "customer.subscription.created": {
      await handleCreate(event.data.object)
      break
    }
    case "customer.subscription.updated": {
      await handleUpdate(event.data.object)
      break
    }
    case "customer.subscription.deleted": {
      await handleDelete(event.data.object)
      break
    }
  }

  return new Response(null, { status: 200 })
}
async function handleCreate(subscription: Stripe.Subscription) {
  const tier = getTierByPriceId(subscription.items.data[0].price.id)
  const userId = subscription.metadata.userId
  if (userId == null || tier == null) {
    return new Response(null, { status: 500 })
  }
  const customer = subscription.customer
  const customerId = typeof customer === "string" ? customer : customer.id

  return await updateUserSubscription(
    eq(UserSubscription.user_id, userId),
    {
      stripe_customer_id: customerId,
      tier: tier.name,
      stripe_subscription_id: subscription.id,
      stripe_subscription_item_id: subscription.items.data[0].id,
    }
  )
}

async function handleUpdate(subscription: Stripe.Subscription) {
  const tier = getTierByPriceId(subscription.items.data[0].price.id)
  const customer = subscription.customer
  const customerId = typeof customer === "string" ? customer : customer.id
  if (tier == null) {
    return new Response(null, { status: 500 })
  }

  return await updateUserSubscription(
    eq(UserSubscription.stripe_customer_id, customerId),
    { tier: tier.name }
  )
}

async function handleDelete(subscription: Stripe.Subscription) {
  const customer = subscription.customer
  const customerId = typeof customer === "string" ? customer : customer.id

  return await updateUserSubscription(
    eq(UserSubscription.stripe_customer_id, customerId),
    {
      tier: subscriptionTiers.Free.name,
      stripe_subscription_id: null,
      stripe_subscription_item_id: null,
    }
  )
}
