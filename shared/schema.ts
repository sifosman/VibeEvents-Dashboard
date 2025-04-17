import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Vendors table
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull(),
  priceRange: text("price_range").notNull(),
  rating: doublePrecision("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  instagramUrl: text("instagram_url"),
  websiteUrl: text("website_url"),
  whatsappNumber: text("whatsapp_number"),
  location: text("location"),
  // Subscription related fields
  subscriptionTier: text("subscription_tier").default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  additionalPhotos: text("additional_photos").array(),
  cataloguePages: integer("catalogue_pages").default(0),
  wordCount: integer("word_count").default(40),
  onlineQuotes: boolean("online_quotes").default(false),
  calendarView: boolean("calendar_view").default(false),
  acceptPayments: boolean("accept_payments").default(false),
  acceptDeposits: boolean("accept_deposits").default(false),
  priorityListing: boolean("priority_listing").default(false),
  eventAlerts: boolean("event_alerts").default(false),
  promotionalEmails: boolean("promotional_emails").default(false),
  onlineContracts: boolean("online_contracts").default(false),
  leadNotifications: boolean("lead_notifications").default(false),
  featuredListing: boolean("featured_listing").default(false),
  googleMapsLink: text("google_maps_link"),
  facebookUrl: text("facebook_url"),
  twitterUrl: text("twitter_url"),
  youtubeUrl: text("youtube_url"),
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
});

// Shortlisted vendors table
export const shortlists = pgTable("shortlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  vendorId: integer("vendor_id").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertShortlistSchema = createInsertSchema(shortlists).omit({
  id: true,
  createdAt: true,
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("medium"),
  status: text("status").notNull().default("pending"),
  dueDate: timestamp("due_date"),
  assignedTo: text("assigned_to"),
  assigneeRole: text("assignee_role"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

// Timeline events table
export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({
  id: true,
  createdAt: true,
});

// Event lead notifications table
export const eventLeads = pgTable("event_leads", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  eventType: text("event_type"),
  eventDate: timestamp("event_date"),
  budget: text("budget"),
  message: text("message"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventLeadSchema = createInsertSchema(eventLeads).omit({
  id: true,
  createdAt: true,
});

// Online quote requests table
export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  eventType: text("event_type"),
  eventDate: timestamp("event_date"),
  requirements: text("requirements"),
  budget: text("budget"),
  status: text("status").notNull().default("pending"),
  quoteAmount: doublePrecision("quote_amount"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuoteRequestSchema = createInsertSchema(quoteRequests).omit({
  id: true,
  createdAt: true,
});

// Booking deposits table
export const bookingDeposits = pgTable("booking_deposits", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  userId: integer("user_id"),
  quoteRequestId: integer("quote_request_id"),
  amount: doublePrecision("amount").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingDepositSchema = createInsertSchema(bookingDeposits).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;

export type Shortlist = typeof shortlists.$inferSelect;
export type InsertShortlist = z.infer<typeof insertShortlistSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;

export type EventLead = typeof eventLeads.$inferSelect;
export type InsertEventLead = z.infer<typeof insertEventLeadSchema>;

export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;

export type BookingDeposit = typeof bookingDeposits.$inferSelect;
export type InsertBookingDeposit = z.infer<typeof insertBookingDepositSchema>;
