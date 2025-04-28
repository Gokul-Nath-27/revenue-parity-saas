import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

import { userRolesEnum } from "./enums";
import { UserOAuthAccountTable } from "./oauth";

const created_at = timestamp({ withTimezone: true }).notNull().defaultNow();
const updated_at = timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date());

export const User = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }),
  salt: varchar({ length: 255 }),
  role: userRolesEnum().notNull().default('user'),
  created_at,
  updated_at,
});

export const userRelations = relations(User, ({ many }) => ({
  oAuthAccounts: many(UserOAuthAccountTable),
}));
