import { pgEnum, timestamp } from "drizzle-orm/pg-core";

import { subscriptionTiers, TierNames } from "@/data/subscriptionTiers";

export const userRoles = ['user', 'admin'] as const;
export const subscriptions = ['free', 'basic', 'standard', 'premium'] as const;
export const oAuthProviders = ["google", "github"] as const;

export type OAuthProvider = (typeof oAuthProviders)[number];


// users
export const userRolesEnum = pgEnum('user_roles', userRoles);

// subsription
export const subscriptionPlanEnum = pgEnum('subscription_plan', subscriptions);

// oauth providers
export const oAuthProviderEnum = pgEnum('oauth_provides', oAuthProviders);

export const TierEnum = pgEnum("tier", Object.keys(subscriptionTiers) as [TierNames])


export const created_at = timestamp({ withTimezone: true }).notNull().defaultNow();
export const updated_at = timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date());