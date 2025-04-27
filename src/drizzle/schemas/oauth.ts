import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, primaryKey } from "drizzle-orm/pg-core";

import { oAuthProviderEnum } from "./enums";
import { User } from "./user";

export const UserOAuthAccountTable = pgTable(
  "user_oauth_accounts",
  {
    userId: uuid()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    provider: oAuthProviderEnum().notNull(),
    providerAccountId: text().notNull().unique(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  t => [primaryKey({ columns: [t.providerAccountId, t.provider] })]
);

export const userOauthAccountRelationships = relations(
  UserOAuthAccountTable,
  ({ one }) => ({
    user: one(User, {
      fields: [UserOAuthAccountTable.userId],
      references: [User.id],
    }),
  })
);
  