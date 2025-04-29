import { relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uuid,
  index
} from "drizzle-orm/pg-core";

import { Country } from "./country";
import { Product } from "./product";

export const ProductView = pgTable("product_views", {
  id: uuid().primaryKey().defaultRandom(),
  product_id: uuid()
    .notNull()
    .references(() => Product.id, { onDelete: "cascade" }),
  country_id: uuid().references(() => Country.id, {
    onDelete: "cascade",
  }),
  visited_at: timestamp("visited_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("product_views_product_id_index").on(table.product_id),
  index("product_views_country_id_index").on(table.country_id),
]);

export const productViewRelations = relations(ProductView, ({ one }) => ({
  product: one(Product, {
    fields: [ProductView.product_id],
    references: [Product.id],
  }),
  country: one(Country, {
    fields: [ProductView.country_id],
    references: [Country.id],
  }),
}));