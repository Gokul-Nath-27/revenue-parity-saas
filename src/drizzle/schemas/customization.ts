import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, boolean, varchar } from "drizzle-orm/pg-core";

import { Product } from "./product";

const created_at = timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updated_at = timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date());

export const ProductCustomization = pgTable("product_customizations", {
  id: uuid().primaryKey().defaultRandom(),
  class_prefix: text(),
  product_id: uuid()
    .notNull()
    .references(() => Product.id, { onDelete: "cascade" })
    .unique(),
  location_message: text()
    .notNull()
    .default(
      "Hey! It looks like you are from <b>{country}</b>. We support Parity Purchasing Power, so if you need it, use code <b>\"{coupon}\"</b> to get <b>{discount}%</b> off."
    ),
  background_color: text()
    .notNull()
    .default("hsl(187.2, 21%, 13%)"),
  text_color: text().notNull().default("hsl(359.1, 0%, 100%)"),
  banner_container: text().notNull().default("body"),
  sticky: boolean().notNull().default(true),
  font_size: varchar().notNull().default("1rem"),
  banner_radius: varchar().notNull().default("10px"),
  created_at,
  updated_at,
});

export const productCustomizationRelations = relations(ProductCustomization, ({ one }) => ({
  product: one(Product, {
    fields: [ProductCustomization.product_id],
    references: [Product.id],
  }),
}));
