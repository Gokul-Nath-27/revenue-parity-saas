import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

import { created_at, updated_at, userRolesEnum } from "./enums";
import { UserOAuthAccountTable } from "./oauth";
import { Product } from "./product";
import { UserSubscription } from "./subscription";

export const User = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }),
  salt: varchar({ length: 255 }),
  role: userRolesEnum().notNull().default('user'),
  reset_password_token: varchar({ length: 255 }),
  reset_password_expires: timestamp('reset_password_expires', { mode: 'date' }),
  created_at,
  updated_at,
});

export const userRelations = relations(User, ({ many, one }) => ({
  oAuthAccounts: many(UserOAuthAccountTable),
  products: many(Product),
  subscriptions: one(UserSubscription, {
    fields: [User.id],
    references: [UserSubscription.user_id],
  }),
}));
