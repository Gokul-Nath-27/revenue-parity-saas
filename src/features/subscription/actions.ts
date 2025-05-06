"use server"
import { cache } from "react"
import Stripe from "stripe"

import { PaidTierNames, subscriptionTiers } from "@/data/subscriptionTiers"
import { UserSubscriptionType } from "@/drizzle/schemas/subscription"
import { catchError } from "@/lib/utils"
import { withAuthUserId } from "@/lib/with-auth"

import { getUserById } from "../account/db"
import { User } from "../account/schema"

import { getUserSubscriptionFromDb } from "./db"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const baseUrl = process.env.NODE_ENV === "production"
  ? process.env.BASE_URL
  : process.env.BASE_URL_DEV


export const getUserSubscription = cache(withAuthUserId(async (userId) => {
  const subscription = await getUserSubscriptionFromDb(userId)
  return subscription
}))



export async function createCheckoutSession(tier: PaidTierNames): Promise<{ error: boolean, message: string, url?: string }> {
  const stripePriceId = subscriptionTiers[tier].stripePriceId as string

  const { data: subscription, error } = await catchError(getUserSubscription())

  if (error || !subscription) {
    return { error: true, message: "Failed to get user subscription" }
  }

  const fullUser = await getUserById(subscription.user_id)

  if (!fullUser) {
    return { error: true, message: "Failed to get user details" }
  }

  // Already subscribed, upgrade to new tier
  if (subscription.stripe_subscription_id) {
    const result = await getSubscriptionUpgradeSession(tier, subscription)
  
    if (result.error) {
      return result  // { error: true, message }
    }
    
    return { error: false, message: "Success", url: result.url }
  }

  // Create checkout session for the new purchase
  const checkoutSessionResult = await createCheckoutSessionUrl(fullUser, stripePriceId)
  if (typeof checkoutSessionResult !== "string") {
    return checkoutSessionResult // error
  }

  return { error: false, message: "Success", url: checkoutSessionResult }
}

async function createCheckoutSessionUrl(user: User, priceId: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      subscription_data: {
        metadata: { userId: user.id },
      },
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${baseUrl}/dashboard/subscription`,
      cancel_url: `${baseUrl}/dashboard/subscription`,
    })

    if (!session.url) {
      return { error: true, message: "Stripe session missing URL" }
    }

    return session.url
  } catch (err) {
    console.error("Stripe session creation failed:", err)
    return { error: true, message: "Failed to create Stripe checkout session" }
  }
}

type UpgradeSessionResult =
  | { error: true; message: string }
  | { error: false; url: string }

async function getSubscriptionUpgradeSession(
  tier: PaidTierNames,
  subscription: UserSubscriptionType
): Promise<UpgradeSessionResult> {
  if (
    subscription.stripe_customer_id == null ||
    subscription.stripe_subscription_id == null ||
    subscription.stripe_subscription_item_id == null
  ) {
    return { error: true, message: "Missing Stripe subscription details." }
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)

  const currentPriceId = stripeSubscription.items.data[0].price.id
  const targetPriceId = subscriptionTiers[tier].stripePriceId

  console.log("stripeSubscription: tier", tier)
  console.log("currentPriceId", currentPriceId)
  console.log("targetPriceId", targetPriceId)
  console.log("EQUALS", currentPriceId === targetPriceId)
  
  if (currentPriceId === targetPriceId) {
    return { error: true, message: "You are already on this tier." }
  }
  
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${baseUrl}/dashboard/subscription`,
    flow_data: {
      type: "subscription_update_confirm",
      subscription_update_confirm: {
        subscription: subscription.stripe_subscription_id,
        items: [
          {
            id: subscription.stripe_subscription_item_id,
            price: targetPriceId,
            quantity: 1,
          },
        ],
      },
    },
  })

  console.log("getSubscriptionUpgradeSession: portalSession", portalSession)

  return { error: false, url: portalSession.url }
}

export async function createCustomerPortalSession(): Promise<{ error: boolean, url?: string }> {
  const subscription = await getUserSubscription()

  if (subscription?.stripe_customer_id == null) {
    return { error: true }
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${baseUrl}/dashboard/subscription`,
  })

  return { error: false, url: portalSession.url }
}

export async function createCancelSession(): Promise<{ error: boolean, url?: string }> {
  const subscription = await getUserSubscription()

  if (subscription == null) return { error: true }

  if (
    subscription.stripe_customer_id == null ||
    subscription.stripe_subscription_id == null
  ) {
    return { error: true }
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${baseUrl}/dashboard/subscription`,
    flow_data: {
      type: "subscription_cancel",
      subscription_cancel: {
        subscription: subscription.stripe_subscription_id,
      },
    },
  })

  return { error: false, url: portalSession.url }
}

export async function updateSubscription(
  tier: PaidTierNames,
  subscriptionId: string
): Promise<{ error: boolean; message: string }> {
  try {
    const targetPriceId = subscriptionTiers[tier].stripePriceId as string
    
    if (!targetPriceId) {
      return { error: true, message: "Invalid subscription tier" }
    }

    const { data: subscription, error } = await catchError(getUserSubscription())

    if (error || !subscription) {
      return { error: true, message: "Failed to get user subscription" }
    }

    if (subscription.tier === tier) {
      return { error: true, message: "You are already on this tier" }
    }

    if (
      !subscription.stripe_customer_id ||
      !subscription.stripe_subscription_id ||
      !subscription.stripe_subscription_item_id
    ) {
      return { error: true, message: "Missing subscription details" }
    }

    // Verify subscription ID matches
    if (subscription.stripe_subscription_id !== subscriptionId) {
      return { error: true, message: "Invalid subscription" }
    }

    // Update the subscription with the new price
    await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.stripe_subscription_item_id,
          price: targetPriceId,
        },
      ],
    });

    return { error: false, message: "Subscription updated successfully" }
  } catch (error) {
    console.error("Failed to update subscription:", error)
    return { 
      error: true, 
      message: error instanceof Error ? error.message : "Failed to update subscription" 
    }
  }
}

