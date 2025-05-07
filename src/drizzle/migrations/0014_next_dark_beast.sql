ALTER TABLE "users" ADD COLUMN "resetPasswordToken" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_password_expires" timestamp;