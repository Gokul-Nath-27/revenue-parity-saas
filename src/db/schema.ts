import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, varchar, serial, text, numeric, integer } from "drizzle-orm/pg-core";

export const userRoles = ['user', 'admin'] as const;
export const userRolesEnum = pgEnum('user_roles', userRoles);

/**
 *  Table Schema
 */
export const User = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  salt: varchar({ length: 255 }).notNull(),
  role: userRolesEnum().notNull().default('user'),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const Product = pgTable("products", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  desc: text(),
  price: numeric().notNull(),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const Customization = pgTable("customization", {
  id: serial().primaryKey(),
  product_id: integer().notNull().references(() => Product.id),
  bg_color: varchar({ length: 225 }),
  text_color: varchar({ length: 225 }),
});

/**
 *  Table Relations
 */
export const productRelations = relations(Product, ({ one }) => ({
  customization: one(Customization, {
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