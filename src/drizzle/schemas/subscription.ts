import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

import { TierEnum } from "./enums";
import { User } from "./user";

const created_at = timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updated_at = timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date());

export const UserSubscription = pgTable("user_subscriptions", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().notNull().unique(),
  stripe_subscription_item_id: text(),
  stripe_subscription_id: text(),
  stripe_customer_id: text(),
  tier: TierEnum("tier").notNull(),
  created_at,
  updated_at,
}, (table) => [
  index("user_subscriptions_user_id_index").on(table.user_id),
  index("user_subscriptions_stripe_customer_id_index").on(table.stripe_customer_id),
]);

export const userSubscriptionRelations = relations(UserSubscription, ({ one }) => ({
  user: one(User, {
    fields: [UserSubscription.user_id],
    references: [User.id],
  }),
}));
