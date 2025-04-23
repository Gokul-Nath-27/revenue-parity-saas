	CREATE TABLE "customizations" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"product_id" uuid NOT NULL, -- Changed from integer to uuid
		"bg_color" varchar(225),
		"text_color" varchar(225)
	);
	--> statement-breakpoint
	CREATE TABLE "products" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"name" varchar(255) NOT NULL,
		"description" text,
		"price" numeric NOT NULL,
		"created_at" timestamp with time zone DEFAULT now() NOT NULL,
		"updated_at" timestamp with time zone DEFAULT now() NOT NULL
	);
	--> statement-breakpoint

	-- Ensure the pgcrypto extension is installed (required for gen_random_uuid())
	CREATE EXTENSION IF NOT EXISTS "pgcrypto";

	-- Drop the existing default (likely nextval from serial)
	ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;

	-- Change the column type to UUID, using gen_random_uuid to convert each existing value
	ALTER TABLE "users"
		ALTER COLUMN "id" SET DATA TYPE uuid
		USING gen_random_uuid();

	-- Set the new default to automatically generate UUIDs for new records
	ALTER TABLE "users"
		ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

	ALTER TABLE "customizations" ADD CONSTRAINT "customizations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;