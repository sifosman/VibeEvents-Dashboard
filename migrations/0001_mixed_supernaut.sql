CREATE TABLE "blog_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"parent_comment_id" integer,
	"content" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"is_author_response" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"featured_image_url" text,
	"author_id" integer NOT NULL,
	"published_at" timestamp,
	"status" text DEFAULT 'draft' NOT NULL,
	"categories" text[],
	"tags" text[],
	"view_count" integer DEFAULT 0,
	"comment_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "notices" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"author_id" integer NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"category" text NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"audiences" text[],
	"view_count" integer DEFAULT 0,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "booking_deposits" ADD COLUMN "payment_gateway" text NOT NULL;--> statement-breakpoint
ALTER TABLE "booking_deposits" ADD COLUMN "paypal_transaction_id" text;--> statement-breakpoint
ALTER TABLE "booking_deposits" ADD COLUMN "payfast_payment_id" text;--> statement-breakpoint
ALTER TABLE "booking_deposits" ADD COLUMN "payment_reference" text;--> statement-breakpoint
ALTER TABLE "booking_deposits" ADD COLUMN "payment_method" text;--> statement-breakpoint
ALTER TABLE "booking_deposits" ADD COLUMN "payment_notes" text;--> statement-breakpoint
ALTER TABLE "booking_deposits" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "is_themed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "theme_types" text[];--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "payment_providers" text[];--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "stripe_connect_id" text;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "paypal_merchant_id" text;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "payfast_merchant_id" text;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "accepted_payment_methods" text[];