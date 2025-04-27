import { pgEnum } from "drizzle-orm/pg-core";

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
