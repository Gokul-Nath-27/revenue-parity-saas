ALTER TABLE "products" RENAME COLUMN "url" TO "domain";--> statement-breakpoint
DROP INDEX "products_url_index";--> statement-breakpoint
CREATE INDEX "products_domain_index" ON "products" USING btree ("domain");