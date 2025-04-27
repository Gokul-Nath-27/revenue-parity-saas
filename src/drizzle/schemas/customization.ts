import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, integer } from "drizzle-orm/pg-core";

import { Product } from "./product";

export const Customization = pgTable("customizations", {
  id: uuid().primaryKey().defaultRandom(),
  product_id: integer().notNull().references(() => Product.id, { onDelete: 'cascade' }),
  bg_color: varchar({ length: 225 }),
  text_color: varchar({ length: 225 }),
});

export const customizationRelations = relations(Customization, ({ one }) => ({
  product: one(Product, {
    fields: [Customization.product_id],
    references: [Product.id],
  }),
}));
