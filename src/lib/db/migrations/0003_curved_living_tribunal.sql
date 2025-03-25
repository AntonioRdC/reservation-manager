ALTER TABLE "user" ADD COLUMN "telefone" varchar(20);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "address" varchar(255);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "city" varchar(100);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "state" varchar(50);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "zip_code" varchar(20);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "country" varchar(100) DEFAULT 'Brasil';