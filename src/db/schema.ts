import { pgEnum, pgTable, timestamp, varchar, serial } from "drizzle-orm/pg-core";

// Define the enum first
export const userRolesEnum = pgEnum('user_roles', ['user', 'admin']);

// Then use it in the table definition
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
