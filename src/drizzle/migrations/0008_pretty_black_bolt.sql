ALTER TABLE "public"."user_subscriptions" ALTER COLUMN "tier" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."tier";--> statement-breakpoint
CREATE TYPE "public"."tier" AS ENUM('Free', 'Standard', 'Premium');--> statement-breakpoint
ALTER TABLE "public"."user_subscriptions" ALTER COLUMN "tier" SET DATA TYPE "public"."tier" USING "tier"::"public"."tier";