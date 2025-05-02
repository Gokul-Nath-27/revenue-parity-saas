ALTER TABLE "product_customizations" ADD COLUMN "sticky" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "product_customizations" ADD COLUMN "font_size" varchar DEFAULT '1rem' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_domain_unique" UNIQUE("domain");