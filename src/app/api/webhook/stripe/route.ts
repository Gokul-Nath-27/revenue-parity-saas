import { eq } from "drizzle-orm"
import { NextRequest } from "next/server"
import Stripe from "stripe"

import { getTierByPriceId, subscriptionTiers } from "@/data/subscriptionTiers"
import { UserSubscription } from "@/drizzle/schemas/subscription"
import { updateUserSubscription } from "@/features/subscription/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(request: NextRequest) {
  console.log("⭐ Stripe webhook received")
  let event: Stripe.Event | null = null
  
  try {
    // Clone the request so we can read the body multiple times
    const reqText = await request.text()
    console.log("⭐ Webhook payload size:", reqText.length)
    
    const signature = request.headers.get("stripe-signature")
    if (!signature) {
      console.error("⭐ No Stripe signature found in webhook request")
      return new Response(
        JSON.stringify({ error: "No Stripe signature found" }),
        { status: 400 }
      )
    }
    
    // Construct and verify the event
    try {
      event = await stripe.webhooks.constructEvent(
        reqText,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      )
      console.log(`⭐ Webhook verified, processing event: ${event.type} (${event.id})`)
    } catch (verifyError) {
      console.error("⭐ Webhook signature verification failed:", verifyError)
      return new Response(
        JSON.stringify({ error: "Webhook signature verification failed" }),
        { status: 400 }
      )
    }

    // Process the verified event
    switch (event.type) {
      case "customer.subscription.created": {
        console.log("⭐ customer.subscription.created event received")
        const subscription = event.data.object as Stripe.Subscription
        console.log("⭐ Subscription data:", JSON.stringify({
          id: subscription.id,
          customerId: subscription.customer,
          priceId: subscription.items.data[0]?.price.id,
          status: subscription.status,
          metadata: subscription.metadata
        }))
        
        await handleCreate(subscription)
        console.log("⭐ handleCreate completed for subscription", subscription.id)
        break
      }
      case "customer.subscription.updated": {
        console.log("⭐ customer.subscription.updated event received")
        const subscription = event.data.object as Stripe.Subscription
        console.log("⭐ Subscription data:", JSON.stringify({
          id: subscription.id,
          customerId: subscription.customer,
          priceId: subscription.items.data[0]?.price.id,
          status: subscription.status
        }))
        
        const result = await handleUpdate(subscription)
        console.log("⭐ handleUpdate completed with result:", result)
        break
      }
      case "customer.subscription.deleted": {
        console.log("⭐ customer.subscription.deleted event received")
        const subscription = event.data.object as Stripe.Subscription
        
        await handleDelete(subscription)
        console.log("⭐ handleDelete completed for subscription", subscription.id)
        break
      }
      default: {
        console.log(`⭐ Unhandled event type: ${event.type}`)
      }
    }

    return new Response(null, { status: 200 })
  } catch (error) {
    console.error("⭐ Webhook error:", error)
    return new Response(
      JSON.stringify({ error: "Webhook handler failed" }),
      { status: 400 }
    )
  }
}

async function handleCreate(subscription: Stripe.Subscription) {
  console.log("⭐ Starting handleCreate for subscription", subscription.id)
  
  const tier = getTierByPriceId(subscription.items.data[0].price.id)
  const userId = subscription.metadata.userId
  
  console.log("⭐ Extracted data:", { 
    tier: tier?.name, 
    userId,
    priceId: subscription.items.data[0].price.id
  })
  
  if (userId == null || tier == null) {
    console.error("⭐ Missing userId or tier in subscription creation", { 
      userId, 
      tier,
      priceId: subscription.items.data[0].price.id,
      allPriceIds: Object.entries(subscriptionTiers)
        .filter(([k, v]) => v.stripePriceId)
        .map(([k, v]) => ({ tier: k, priceId: v.stripePriceId }))
    })
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
    console.log("⭐ Database update successful:", result)
    return result
  } catch (error) {
    console.error("⭐ Database update failed:", error)
    throw error
  }
}

async function handleUpdate(subscription: Stripe.Subscription) {
  console.log("⭐ Starting handleUpdate for subscription", subscription.id)
  
  // Get the tier based on the price ID in the subscription
  const priceId = subscription.items.data[0].price.id
  const tier = getTierByPriceId(priceId)
  const customer = subscription.customer
  const customerId = typeof customer === "string" ? customer : customer.id
  
  console.log("⭐ Extracted data:", { 
    tier: tier?.name, 
    customerId,
    priceId,
    allPriceIds: Object.entries(subscriptionTiers)
      .filter(([k, v]) => v.stripePriceId)
      .map(([k, v]) => ({ tier: k, priceId: v.stripePriceId }))
  })
  
  if (tier == null) {
    console.error("⭐ Could not determine tier from price ID", priceId)
    return new Response(null, { status: 500 })
  }

  // Update user subscription in the database
  console.log(`⭐ Updating user subscription to ${tier.name} for customer ${customerId}`)
  
  try {
    const result = await updateUserSubscription(
      eq(UserSubscription.stripe_customer_id, customerId),
      { 
        tier: tier.name,
        stripe_subscription_id: subscription.id,
        stripe_subscription_item_id: subscription.items.data[0].id,
      }
    )
    console.log("⭐ Database update successful:", result)
    return result
  } catch (error) {
    console.error("⭐ Database update failed:", error)
    throw error
  }
}

async function handleDelete(subscription: Stripe.Subscription) {
  console.log("⭐ Starting handleDelete for subscription", subscription.id)
  
  const customer = subscription.customer
  const customerId = typeof customer === "string" ? customer : customer.id

  console.log(`⭐ Downgrading subscription to Free tier for customer ${customerId}`)
  
  try {
    const result = await updateUserSubscription(
      eq(UserSubscription.stripe_customer_id, customerId),
      {
        tier: subscriptionTiers.Free.name,
        stripe_subscription_id: null,
        stripe_subscription_item_id: null,
      }
    )
    console.log("⭐ Database update successful:", result)
    return result
  } catch (error) {
    console.error("⭐ Database update failed:", error)
    throw error
  }
}
