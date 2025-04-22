import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, varchar, text, numeric, integer, uuid } from "drizzle-orm/pg-core";

export const userRoles = ['user', 'admin'] as const;
export const userRolesEnum = pgEnum('user_roles', userRoles);
const created_at = timestamp({ withTimezone: true }).notNull().defaultNow();
const updated_at = timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date());
/**
 *  Table Schema
 */
export const User = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  salt: varchar({ length: 255 }).notNull(),
  role: userRolesEnum().notNull().default('user'),
  created_at,
  updated_at,
});

export const Product = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  price: numeric().notNull(),
  created_at,
  updated_at,
});

export const Customization = pgTable("customizations", {
  id: uuid().primaryKey().defaultRandom(),
  product_id: integer().notNull().references(() => Product.id, { onDelete: 'cascade' }),
  bg_color: varchar({ length: 225 }),
  text_color: varchar({ length: 225 }),
});

/**
 *  Table Relations
 */
export const productRelations = relations(Product, ({ one }) => ({
  customizations: one(Customization, {
    fields: [Product.id],
    references: [Customization.product_id],
  }),
}));

export const customizationRelations = relations(Customization, ({ one }) => ({
  product: one(Product, {
    fields: [Customization.product_id],
    references: [Product.id],
  }),
}));