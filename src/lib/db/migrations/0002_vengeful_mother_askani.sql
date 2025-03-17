ALTER TABLE "space" ADD COLUMN "address" varchar(255);--> statement-breakpoint
ALTER TABLE "space" ADD COLUMN "city" varchar(100);--> statement-breakpoint
ALTER TABLE "space" ADD COLUMN "state" varchar(50);--> statement-breakpoint
ALTER TABLE "space" ADD COLUMN "zip_code" varchar(20);--> statement-breakpoint
ALTER TABLE "space" ADD COLUMN "country" varchar(100) DEFAULT 'Brasil';