CREATE TYPE "public"."tier" AS ENUM('Free', 'Basic', 'Standard', 'Premium');--> statement-breakpoint
CREATE TABLE "countries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"country_group_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "countries_name_unique" UNIQUE("name"),
	CONSTRAINT "countries_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "country_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"recommended_discount_percentage" real,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "country_groups_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "country_group_discounts" (
	"country_group_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"coupon" text NOT NULL,
	"discount_percentage" real NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "country_group_discounts_country_group_id_product_id_pk" PRIMARY KEY("country_group_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_subscription_item_id" text,
	"stripe_subscription_id" text,
	"stripe_customer_id" text,
	"tier" "tier" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_subscriptions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "product_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"country_id" uuid,
	"visited_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customizations" RENAME TO "product_customizations";--> statement-breakpoint
ALTER TABLE "product_customizations" RENAME COLUMN "bg_color" TO "background_color";--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" RENAME COLUMN "providerAccountId" TO "provider_account_id";--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" DROP CONSTRAINT "user_oauth_accounts_providerAccountId_unique";--> statement-breakpoint
ALTER TABLE "product_customizations" DROP CONSTRAINT "customizations_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" DROP CONSTRAINT "user_oauth_accounts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" DROP CONSTRAINT "user_oauth_accounts_providerAccountId_provider_pk";--> statement-breakpoint
ALTER TABLE "product_customizations" ALTER COLUMN "product_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "product_customizations" ALTER COLUMN "text_color" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "product_customizations" ALTER COLUMN "text_color" SET DEFAULT 'hsl(0, 0%, 100%)';--> statement-breakpoint
ALTER TABLE "product_customizations" ALTER COLUMN "text_color" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" ADD CONSTRAINT "user_oauth_accounts_provider_account_id_provider_pk" PRIMARY KEY("provider_account_id","provider");--> statement-breakpoint
ALTER TABLE "product_customizations" ADD COLUMN "class_prefix" text;--> statement-breakpoint
ALTER TABLE "product_customizations" ADD COLUMN "location_message" text DEFAULT 'Hey! It looks like you are from <b>{country}</b>. We support Parity Purchasing Power, so if you need it, use code <b>"{coupon}"</b> to get <b>{discount}%</b> off.' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_customizations" ADD COLUMN "banner_container" text DEFAULT 'body' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_customizations" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "product_customizations" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "countries" ADD CONSTRAINT "countries_country_group_id_country_groups_id_fk" FOREIGN KEY ("country_group_id") REFERENCES "public"."country_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "country_group_discounts" ADD CONSTRAINT "country_group_discounts_country_group_id_country_groups_id_fk" FOREIGN KEY ("country_group_id") REFERENCES "public"."country_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "country_group_discounts" ADD CONSTRAINT "country_group_discounts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "countries_country_group_id_index" ON "countries" USING btree ("country_group_id");--> statement-breakpoint
CREATE INDEX "user_subscriptions_user_id_index" ON "user_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_subscriptions_stripe_customer_id_index" ON "user_subscriptions" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "product_views_product_id_index" ON "product_views" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_views_country_id_index" ON "product_views" USING btree ("country_id");--> statement-breakpoint
ALTER TABLE "product_customizations" ADD CONSTRAINT "product_customizations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" ADD CONSTRAINT "user_oauth_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "products_user_id_index" ON "products" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "products_name_index" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "products_url_index" ON "products" USING btree ("url");--> statement-breakpoint
CREATE INDEX "user_oauth_accounts_user_id_index" ON "user_oauth_accounts" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "product_customizations" ADD CONSTRAINT "product_customizations_product_id_unique" UNIQUE("product_id");--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" ADD CONSTRAINT "user_oauth_accounts_provider_account_id_unique" UNIQUE("provider_account_id");