import { eq } from "drizzle-orm"
import { NextRequest } from "next/server"
import Stripe from "stripe"

import { getTierByPriceId, subscriptionTiers } from "@/data/subscriptionTiers"
import { UserSubscription } from "@/drizzle/schemas/subscription"
import { updateUserSubscription } from "@/features/subscription/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(request: NextRequest) {
  let event: Stripe.Event | null = null
  
  try {
    console.log("stripe webhook received")
    // Clone the request so we can read the body multiple times
    const reqText = await request.text()
    
    const signature = request.headers.get("stripe-signature")
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "No Stripe signature found" }),
        { status: 400 }
      )
    }
    
    console.log("stripe webhook signature", signature)
    // Construct and verify the event
    try {
      console.log("stripe webhook secret", process.env.STRIPE_WEBHOOK_SECRET)
      event = stripe.webhooks.constructEvent(
        reqText,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      )
    } catch (verifyError) {
      console.log("stripe webhook verifyError", verifyError)
      return new Response(
        JSON.stringify({ error: "Webhook signature verification failed" }),
        { status: 400 }
      )
    }

    // Process the verified event
    console.log("stripe webhook event", event)
    switch (event.type) {
      case "customer.subscription.created": {
        console.log("stripe webhook customer.subscription.created")
        const subscription = event.data.object as Stripe.Subscription
        await handleCreate(subscription)
        break
      }
      case "customer.subscription.updated": {
        console.log("stripe webhook customer.subscription.updated")
        const subscription = event.data.object as Stripe.Subscription
        await handleUpdate(subscription)
        break
      }
      case "customer.subscription.deleted": {
        console.log("stripe webhook customer.subscription.deleted")
        const subscription = event.data.object as Stripe.Subscription
        await handleDelete(subscription)
        break
      }
    }
    console.log("stripe webhook handled and returning 200")
    return new Response(null, { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Webhook handler failed" }),
      { status: 400 }
    )
  }
}

async function handleCreate(subscription: Stripe.Subscription) {
  const tier = getTierByPriceId(subscription.items.data[0].price.id)
  const userId = subscription.metadata.userId
  
  if (userId == null || tier == null) {
    return new Response(null, { status: 500 })
  }
  
  const customer = subscription.customer
  const customerId = typeof customer === "string" ? customer : customer.id

  // Update subscription in database
  try {
    const result = await updateUserSubscription(
      eq(UserSubscription.user_id, userId),
      {
        stripe_customer_id: customerId,
        tier: tier.name,
        stripe_subscription_id: subscription.id,
        stripe_subscription_item_id: subscription.items.data[0].id,
      }
    )
    return result
  } catch (error) {
    throw error
  }
}

async function handleUpdate(subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0].price.id
  const tier = getTierByPriceId(priceId)
  const customer = subscription.customer
  const customerId = typeof customer === "string" ? customer : customer.id
  
  if (tier == null) {
    return new Response(null, { status: 500 })
  }

  // Update user subscription in the database
  try {
    const result = await updateUserSubscription(
      eq(UserSubscription.stripe_customer_id, customerId),
      { 
        tier: tier.name,
        stripe_subscription_id: subscription.id,
        stripe_subscription_item_id: subscription.items.data[0].id,
      }
    )
    return result
  } catch (error) {
    throw error
  }
}

async function handleDelete(subscription: Stripe.Subscription) {
  const customer = subscription.customer
  const customerId = typeof customer === "string" ? customer : customer.id

  try {
    const result = await updateUserSubscription(
      eq(UserSubscription.stripe_customer_id, customerId),
      {
        tier: subscriptionTiers.Free.name,
        stripe_subscription_id: null,
        stripe_subscription_item_id: null,
      }
    )
    return result
  } catch (error) {
    throw error
  }
}
