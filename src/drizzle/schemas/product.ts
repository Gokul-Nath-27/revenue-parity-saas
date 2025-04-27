import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, text, numeric, timestamp } from "drizzle-orm/pg-core";

import { Customization } from "./customization";

const created_at = timestamp({ withTimezone: true }).notNull().defaultNow();
const updated_at = timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date());

export const Product = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  price: numeric().notNull(),
  created_at,
  updated_at,
});

export const productRelations = relations(Product, ({ one }) => ({
  customizations: one(Customization, {
    fields: [Product.id],
    references: [Customization.product_id],
  }),
}));
