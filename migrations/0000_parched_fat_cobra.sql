CREATE TABLE "ad_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer NOT NULL,
	"asset_type" text NOT NULL,
	"asset_url" text NOT NULL,
	"title" text,
	"description" text,
	"call_to_action" text,
	"dimensions" text,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ad_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"budget" double precision NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"type" text NOT NULL,
	"target_audience" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ad_placements" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer NOT NULL,
	"asset_id" integer NOT NULL,
	"position" text NOT NULL,
	"priority" integer DEFAULT 1 NOT NULL,
	"pricing" text NOT NULL,
	"cost" double precision NOT NULL,
	"impressions" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_deposits" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor_id" integer NOT NULL,
	"user_id" integer,
	"quote_request_id" integer,
	"amount" double precision NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"stripe_payment_intent_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "calendar_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor_id" integer NOT NULL,
	"user_id" integer,
	"title" text NOT NULL,
	"description" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"all_day" boolean DEFAULT false,
	"location" text,
	"status" text DEFAULT 'confirmed',
	"type" text DEFAULT 'booking',
	"color" text,
	"recurrence_rule" text,
	"external_calendar_id" text,
	"external_event_id" text,
	"notifications_enabled" boolean DEFAULT true,
	"notification_sent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"slug" text NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"host_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"subject" text,
	"status" text DEFAULT 'active',
	"last_message_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event_leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor_id" integer NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"event_type" text,
	"event_date" timestamp,
	"budget" text,
	"message" text,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event_opportunities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"event_type" text NOT NULL,
	"event_date" timestamp NOT NULL,
	"location" text NOT NULL,
	"budget" text,
	"attendee_count" integer,
	"categories_needed" text[],
	"requirements_details" text,
	"application_deadline" timestamp,
	"is_public" boolean DEFAULT true NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"image_url" text,
	"additional_info" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"content" text NOT NULL,
	"attachments" text[],
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "public_holidays" (
	"id" serial PRIMARY KEY NOT NULL,
	"country_code" text NOT NULL,
	"name" text NOT NULL,
	"date" timestamp NOT NULL,
	"description" text,
	"is_national" boolean DEFAULT true,
	"type" text DEFAULT 'public',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quote_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor_id" integer NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"event_type" text,
	"event_date" timestamp,
	"requirements" text,
	"budget" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"quote_amount" double precision,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"vendor_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"review_text" text,
	"title" text,
	"event_date" timestamp,
	"service_used" text,
	"is_verified" boolean DEFAULT false,
	"admin_reply" text,
	"admin_reply_date" timestamp,
	"status" text DEFAULT 'published',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "seo_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor_id" integer NOT NULL,
	"package_name" text NOT NULL,
	"price" double precision NOT NULL,
	"keywords" text[],
	"priority" integer DEFAULT 1,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shortlists" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"vendor_id" integer NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"priority" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"due_date" timestamp,
	"assigned_to" text,
	"assignee_role" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "timeline_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"event_date" timestamp,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vendor_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"opportunity_id" integer NOT NULL,
	"vendor_id" integer NOT NULL,
	"proposed_service" text NOT NULL,
	"price_quote" text,
	"message" text,
	"availability" boolean DEFAULT true NOT NULL,
	"portfolio_links" text[],
	"additional_info" json,
	"status" text DEFAULT 'pending' NOT NULL,
	"notification_sent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"category_id" integer NOT NULL,
	"price_range" text NOT NULL,
	"rating" double precision DEFAULT 0 NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"instagram_url" text,
	"website_url" text,
	"whatsapp_number" text,
	"location" text,
	"dietary_options" text[],
	"cuisine_types" text[],
	"subscription_tier" text DEFAULT 'free',
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"subscription_status" text DEFAULT 'inactive',
	"additional_photos" text[],
	"catalogue_pages" integer DEFAULT 0,
	"word_count" integer DEFAULT 40,
	"online_quotes" boolean DEFAULT false,
	"calendar_view" boolean DEFAULT false,
	"accept_payments" boolean DEFAULT false,
	"accept_deposits" boolean DEFAULT false,
	"priority_listing" boolean DEFAULT false,
	"event_alerts" boolean DEFAULT false,
	"promotional_emails" boolean DEFAULT false,
	"online_contracts" boolean DEFAULT false,
	"lead_notifications" boolean DEFAULT false,
	"featured_listing" boolean DEFAULT false,
	"google_maps_link" text,
	"facebook_url" text,
	"twitter_url" text,
	"youtube_url" text
);
--> statement-breakpoint
CREATE TABLE "whatsapp_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"group_name" text NOT NULL,
	"group_id" text NOT NULL,
	"event_id" integer,
	"status" text DEFAULT 'active' NOT NULL,
	"task_sync" boolean DEFAULT true,
	"timeline_sync" boolean DEFAULT true,
	"notifications_enabled" boolean DEFAULT true,
	"last_activity" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "whatsapp_groups_group_id_unique" UNIQUE("group_id")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"sender_id" text NOT NULL,
	"sender_name" text NOT NULL,
	"message" text NOT NULL,
	"message_type" text DEFAULT 'text' NOT NULL,
	"has_task_action" boolean DEFAULT false,
	"has_timeline_action" boolean DEFAULT false,
	"created_task_id" integer,
	"created_timeline_id" integer,
	"timestamp" timestamp DEFAULT now()
);
