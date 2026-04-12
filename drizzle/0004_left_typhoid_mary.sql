ALTER TABLE "tokens" ALTER COLUMN "expired_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tokens" ADD COLUMN "verified_expired_at" timestamp;--> statement-breakpoint
ALTER TABLE "tokens" ADD COLUMN "forgot_password_expired_at" timestamp;