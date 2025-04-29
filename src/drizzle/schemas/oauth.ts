import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, primaryKey, index } from "drizzle-orm/pg-core";

import { oAuthProviderEnum } from "./enums";
import { User } from "./user";

export const UserOAuthAccountTable = pgTable(
  "user_oauth_accounts",
  {
    user_id: uuid()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    provider: oAuthProviderEnum().notNull(),
    provider_account_id: text().notNull().unique(),
    created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    primaryKey({ columns: [t.provider_account_id, t.provider] }),
    index("user_oauth_accounts_user_id_index").on(t.user_id),
  ]
);

export const userOauthAccountRelationships = relations(
  UserOAuthAccountTable,
  ({ one }) => ({
    user: one(User, {
      fields: [UserOAuthAccountTable.user_id],
      references: [User.id],
    }),
  })
);