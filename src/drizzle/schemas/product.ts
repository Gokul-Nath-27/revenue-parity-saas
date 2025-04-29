import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

import { CountryGroupDiscount } from "./country";
import { ProductCustomization } from "./customization";
import { User } from "./user";
import { ProductView } from "./visits";
const created_at = timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updated_at = timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date());

export const Product = pgTable("products", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().notNull(),
  name: text().notNull(),
  domain: text().notNull().unique(),
  description: text(),
  created_at,
  updated_at,
}, (table) => [
  index("products_user_id_index").on(table.user_id),
  index("products_name_index").on(table.name),
  index("products_domain_index").on(table.domain),
]);

export const productRelations = relations(Product, ({ one, many }) => ({
  product_customization: one(ProductCustomization, {
    fields: [Product.id],
    references: [ProductCustomization.product_id],
  }),
  product_views: many(ProductView),
  country_group_discounts: many(CountryGroupDiscount),
  user: one(User, {
    fields: [Product.user_id],
    references: [User.id],
  }),
}));