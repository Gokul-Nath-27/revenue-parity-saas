import { relations } from "drizzle-orm";
import {
  pgTable,
  real,
  text,
  uuid,
  timestamp,
  primaryKey,
  index
} from "drizzle-orm/pg-core";

import { Product } from "./product";
import { ProductView } from "./visits";

const created_at = timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updated_at = timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date());

export const Country = pgTable("countries", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull().unique(),
  code: text().notNull().unique(),
  country_group_id: uuid()
    .notNull()
    .references(() => CountryGroup.id, { onDelete: "cascade" }),
  created_at,
  updated_at,
}, (table) => [
  index("countries_country_group_id_index").on(table.country_group_id),
]);

export const CountryGroup = pgTable("country_groups", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull().unique(),
  recommended_discount_percentage: real(),
  created_at,
  updated_at,
});

export const CountryGroupDiscount = pgTable("country_group_discounts", {
  country_group_id: uuid()
    .notNull()
    .references(() => CountryGroup.id, { onDelete: "cascade" }),
  product_id: uuid()
    .notNull()
    .references(() => Product.id, { onDelete: "cascade" }),
  coupon: text().notNull(),
  discount_percentage: real().notNull(),
  created_at,
  updated_at,
}, (table) => [primaryKey({ columns: [table.country_group_id, table.product_id] })]);

export const countryRelations = relations(Country, ({ many, one }) => ({
  country_group: one(CountryGroup, {
    fields: [Country.country_group_id],
    references: [CountryGroup.id],
  }),
  product_views: many(ProductView),
}));

export const countryGroupRelations = relations(CountryGroup, ({ many }) => ({
  countries: many(Country),
  country_group_discounts: many(CountryGroupDiscount),
}));

export const countryGroupDiscountRelations = relations(CountryGroupDiscount, ({ one }) => ({
  product: one(Product, {
    fields: [CountryGroupDiscount.product_id],
    references: [Product.id],
  }),
  country_group: one(CountryGroup, {
    fields: [CountryGroupDiscount.country_group_id],
    references: [CountryGroup.id],
  }),
}));