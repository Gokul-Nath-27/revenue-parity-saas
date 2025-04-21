import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, varchar, serial, text, numeric } from "drizzle-orm/pg-core";

// Define the enum first
export const userRoles = ['user', 'admin'] as const
export const userRolesEnum = pgEnum('user_roles', userRoles);

/* ------------- Table definitions ------------------ */

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

const ProductCustomization = pgTable("product_customization", {
  id: serial(),
  product_id: serial().references(() => Product.id),
  bg_color: varchar({ length: 225 }),
  text_color: varchar({ length: 225 })
})


/* -------------------- Realtoins ----------------------- */

export const productRelations = relations(ProductCustomization, ({ one }) => ({
	customizatoin_info: one(ProductCustomization),
}));

export const customizatoinRelatoin = relations(Product, ({ one }) => ({
	product: one(Product),
}));