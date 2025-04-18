import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define catalog item type
export const catalogItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  imageUrl: z.string(),
  price: z.string(),
  category: z.string().optional(),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type CatalogItem = z.infer<typeof catalogItemSchema>;

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
  logoUrl: text("logo_url"),  // Company logo for subscribers
  categoryId: integer("category_id").notNull(),
  priceRange: text("price_range").notNull(),
  rating: doublePrecision("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  instagramUrl: text("instagram_url"),
  websiteUrl: text("website_url"),
  whatsappNumber: text("whatsapp_number"),
  location: text("location"),
  // Dietary options and cuisines
  dietaryOptions: text("dietary_options").array(),  // halaal, kosher, vegan, vegetarian, gluten-free, dairy-free, nut-free, alcohol-free
  cuisineTypes: text("cuisine_types").array(),      // Mediterranean, Indian, Asian, Mexican, Italian, French, American, African, etc.
  // Themed options
  isThemed: boolean("is_themed").default(false),    // Flag for themed services/venues
  themeTypes: text("theme_types").array(),          // Fairy tale, Rustic, Beach, Vintage, Modern, etc.
  // Subscription related fields
  subscriptionTier: text("subscription_tier").default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  additionalPhotos: text("additional_photos").array(),
  catalogItems: json("catalog_items").default([]),
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
  // Payment provider integrations
  paymentProviders: text("payment_providers").array(), // stripe, paypal, payfast, etc.
  stripeConnectId: text("stripe_connect_id"), // For Stripe Connect integration
  paypalMerchantId: text("paypal_merchant_id"),
  payfastMerchantId: text("payfast_merchant_id"),
  acceptedPaymentMethods: text("accepted_payment_methods").array(), // credit_card, eft, bank_transfer, etc.
  // Social and external links
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
  cost: doublePrecision("cost"),
  notes: text("notes"),
  status: text("status").default("considering"), // considering, booked, confirmed, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertShortlistSchema = createInsertSchema(shortlists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
  paymentGateway: text("payment_gateway").notNull(), // stripe, paypal, payfast, etc.
  // Payment gateway specific fields
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paypalTransactionId: text("paypal_transaction_id"),
  payfastPaymentId: text("payfast_payment_id"),
  paymentReference: text("payment_reference"), // Custom reference for tracking
  paymentMethod: text("payment_method"), // credit_card, bank_transfer, wallet, etc.
  paymentNotes: text("payment_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
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

// WhatsApp integration tables
export const whatsappGroups = pgTable("whatsapp_groups", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  groupName: text("group_name").notNull(),
  groupId: text("group_id").notNull().unique(),
  eventId: integer("event_id"),
  status: text("status").notNull().default("active"),
  taskSync: boolean("task_sync").default(true),
  timelineSync: boolean("timeline_sync").default(true),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  lastActivity: timestamp("last_activity"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWhatsappGroupSchema = createInsertSchema(whatsappGroups).omit({
  id: true,
  createdAt: true,
});

export const whatsappMessages = pgTable("whatsapp_messages", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull(),
  senderId: text("sender_id").notNull(),
  senderName: text("sender_name").notNull(),
  message: text("message").notNull(),
  messageType: text("message_type").notNull().default("text"),
  hasTaskAction: boolean("has_task_action").default(false),
  hasTimelineAction: boolean("has_timeline_action").default(false),
  createdTaskId: integer("created_task_id"),
  createdTimelineId: integer("created_timeline_id"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertWhatsappMessageSchema = createInsertSchema(whatsappMessages).omit({
  id: true,
  timestamp: true,
});

// Advertising tables
export const adCampaigns = pgTable("ad_campaigns", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  budget: doublePrecision("budget").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("pending"),
  type: text("type").notNull(), // banner, featured, video
  targetAudience: text("target_audience"), // JSON string for targeting options
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAdCampaignSchema = createInsertSchema(adCampaigns).omit({
  id: true,
  createdAt: true,
});

export const adAssets = pgTable("ad_assets", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  assetType: text("asset_type").notNull(), // image, video, html
  assetUrl: text("asset_url").notNull(),
  title: text("title"),
  description: text("description"),
  callToAction: text("call_to_action"),
  dimensions: text("dimensions"), // Format: "WidthxHeight"
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertAdAssetSchema = createInsertSchema(adAssets).omit({
  id: true,
  uploadedAt: true,
});

export const adPlacements = pgTable("ad_placements", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  assetId: integer("asset_id").notNull(),
  position: text("position").notNull(), // homepage_top, search_results, category_page, etc.
  priority: integer("priority").notNull().default(1),
  pricing: text("pricing").notNull(), // CPM, CPC, fixed
  cost: doublePrecision("cost").notNull(),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("pending"),
});

export const insertAdPlacementSchema = createInsertSchema(adPlacements).omit({
  id: true,
});

export const seoPackages = pgTable("seo_packages", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  packageName: text("package_name").notNull(),
  price: doublePrecision("price").notNull(),
  keywords: text("keywords").array(),
  priority: integer("priority").default(1),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSeoPackageSchema = createInsertSchema(seoPackages).omit({
  id: true,
  createdAt: true,
});

// Type exports for new tables
export type WhatsappGroup = typeof whatsappGroups.$inferSelect;
export type InsertWhatsappGroup = z.infer<typeof insertWhatsappGroupSchema>;

export type WhatsappMessage = typeof whatsappMessages.$inferSelect;
export type InsertWhatsappMessage = z.infer<typeof insertWhatsappMessageSchema>;

export type AdCampaign = typeof adCampaigns.$inferSelect;
export type InsertAdCampaign = z.infer<typeof insertAdCampaignSchema>;

export type AdAsset = typeof adAssets.$inferSelect;
export type InsertAdAsset = z.infer<typeof insertAdAssetSchema>;

export type AdPlacement = typeof adPlacements.$inferSelect;
export type InsertAdPlacement = z.infer<typeof insertAdPlacementSchema>;

export type SeoPackage = typeof seoPackages.$inferSelect;
export type InsertSeoPackage = z.infer<typeof insertSeoPackageSchema>;

// Analytics tables
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  pageType: text("page_type").notNull(), // 'vendor', 'category', 'home', etc.
  referenceId: integer("reference_id"), // ID of the vendor, category, etc. being viewed
  userId: integer("user_id"), // Optional - may be anonymous
  sessionId: text("session_id").notNull(), // To track unique sessions
  ipAddress: text("ip_address"), // For geolocation analytics
  userAgent: text("user_agent"), // For device analytics
  referrer: text("referrer"), // Where the visitor came from
  timestamp: timestamp("timestamp").defaultNow(),
  durationSeconds: integer("duration_seconds"), // How long they viewed the page
  country: text("country"), // Derived from IP
  region: text("region"), // Derived from IP
  city: text("city"), // Derived from IP
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  timestamp: true,
});

export const vendorAnalytics = pgTable("vendor_analytics", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  date: timestamp("date").notNull(),
  pageViews: integer("page_views").notNull().default(0),
  uniqueVisitors: integer("unique_visitors").notNull().default(0),
  profileClicks: integer("profile_clicks").notNull().default(0),
  contactClicks: integer("contact_clicks").notNull().default(0),
  websiteClicks: integer("website_clicks").notNull().default(0),
  shortlistAdds: integer("shortlist_adds").notNull().default(0),
  inquiries: integer("inquiries").notNull().default(0),
  leadsGenerated: integer("leads_generated").notNull().default(0),
  quoteRequests: integer("quote_requests").notNull().default(0),
  bookings: integer("bookings").notNull().default(0),
  revenue: doublePrecision("revenue").notNull().default(0),
  averageEngagementTime: integer("average_engagement_time").notNull().default(0), // in seconds
});

export const insertVendorAnalyticsSchema = createInsertSchema(vendorAnalytics).omit({
  id: true,
});

export const appAnalytics = pgTable("app_analytics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  totalPageViews: integer("total_page_views").notNull().default(0),
  uniqueVisitors: integer("unique_visitors").notNull().default(0),
  newUserSignups: integer("new_user_signups").notNull().default(0),
  searchCount: integer("search_count").notNull().default(0),
  eventLeadsCreated: integer("event_leads_created").notNull().default(0),
  categoryViews: json("category_views"), // JSON structure with category_id: view_count
  locationBreakdown: json("location_breakdown"), // JSON structure with location: count
  deviceBreakdown: json("device_breakdown"), // JSON structure with device_type: count
  referrerBreakdown: json("referrer_breakdown"), // JSON structure with referrer: count
  activeUsers: integer("active_users").notNull().default(0),
  vendorSignups: integer("vendor_signups").notNull().default(0),
  subscriptionConversions: integer("subscription_conversions").notNull().default(0),
  subscriptionRevenue: doublePrecision("subscription_revenue").notNull().default(0),
  adRevenue: doublePrecision("ad_revenue").notNull().default(0),
  totalRevenue: doublePrecision("total_revenue").notNull().default(0),
});

export const insertAppAnalyticsSchema = createInsertSchema(appAnalytics).omit({
  id: true,
});

export const userEvents = pgTable("user_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  eventType: text("event_type").notNull(), // 'login', 'search', 'view_vendor', 'shortlist', etc.
  eventData: json("event_data"), // Additional data specific to the event
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserEventSchema = createInsertSchema(userEvents).omit({
  id: true,
  timestamp: true,
});

// Type exports for analytics tables
export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;

export type VendorAnalytics = typeof vendorAnalytics.$inferSelect;
export type InsertVendorAnalytics = z.infer<typeof insertVendorAnalyticsSchema>;

export type AppAnalytics = typeof appAnalytics.$inferSelect;
export type InsertAppAnalytics = z.infer<typeof insertAppAnalyticsSchema>;

export type UserEvent = typeof userEvents.$inferSelect;
export type InsertUserEvent = z.infer<typeof insertUserEventSchema>;

// Budget planner tables
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  totalBudget: doublePrecision("total_budget").notNull(),
  currency: text("currency").notNull().default("ZAR"),
  eventType: text("event_type").notNull(),
  eventDate: timestamp("event_date"),
  status: text("status").notNull().default("active"),
  isTemplate: boolean("is_template").default(false),
  guestCount: integer("guest_count"),
  venueType: text("venue_type"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBudgetSchema = createInsertSchema(budgets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const budgetCategories = pgTable("budget_categories", {
  id: serial("id").primaryKey(),
  budgetId: integer("budget_id").notNull(),
  name: text("name").notNull(),
  allocatedAmount: doublePrecision("allocated_amount").notNull().default(0),
  percentOfTotal: doublePrecision("percent_of_total"),
  isCustom: boolean("is_custom").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBudgetCategorySchema = createInsertSchema(budgetCategories).omit({
  id: true,
  createdAt: true,
});

export const budgetItems = pgTable("budget_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  estimatedCost: doublePrecision("estimated_cost").notNull().default(0),
  actualCost: doublePrecision("actual_cost"),
  paymentStatus: text("payment_status").default("pending"), // pending, partial, paid
  paymentDate: timestamp("payment_date"),
  notes: text("notes"),
  vendor: text("vendor"),
  vendorId: integer("vendor_id"), // Optional link to platform vendor
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBudgetItemSchema = createInsertSchema(budgetItems).omit({
  id: true,
  createdAt: true,
});

// Event Planning Tool tables
export const eventPlans = pgTable("event_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  eventType: text("event_type").notNull(),
  eventDate: timestamp("event_date"),
  location: text("location"),
  guestCount: integer("guest_count"),
  theme: text("theme"),
  color: text("color"),
  description: text("description"),
  isTemplate: boolean("is_template").default(false),
  status: text("status").notNull().default("planning"), // planning, in-progress, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEventPlanSchema = createInsertSchema(eventPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const planningChecklists = pgTable("planning_checklists", {
  id: serial("id").primaryKey(),
  eventPlanId: integer("event_plan_id").notNull(),
  name: text("name").notNull(),
  timeframe: text("timeframe"), // e.g., "12 months before", "1 week before"
  dueDate: timestamp("due_date"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlanningChecklistSchema = createInsertSchema(planningChecklists).omit({
  id: true,
  createdAt: true,
});

export const checklistItems = pgTable("checklist_items", {
  id: serial("id").primaryKey(),
  checklistId: integer("checklist_id").notNull(),
  task: text("task").notNull(),
  isCompleted: boolean("is_completed").default(false),
  completedDate: timestamp("completed_date"),
  assignedTo: text("assigned_to"),
  notes: text("notes"),
  priority: text("priority").default("medium"), // low, medium, high
  order: integer("order").default(0),
  categoryId: integer("category_id"), // Optional link to service category
  vendorId: integer("vendor_id"), // Optional link to assigned vendor
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChecklistItemSchema = createInsertSchema(checklistItems).omit({
  id: true,
  createdAt: true,
});

export const guestLists = pgTable("guest_lists", {
  id: serial("id").primaryKey(),
  eventPlanId: integer("event_plan_id").notNull(),
  name: text("name").notNull().default("Main Guest List"), 
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGuestListSchema = createInsertSchema(guestLists).omit({
  id: true,
  createdAt: true,
});

export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  guestListId: integer("guest_list_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  group: text("group"), // e.g., "Family", "Friends", "Colleagues"
  invitationStatus: text("invitation_status").default("not-sent"), // not-sent, sent, accepted, declined
  mealPreference: text("meal_preference"),
  plusOnes: integer("plus_ones").default(0),
  notes: text("notes"),
  address: text("address"),
  tableAssignment: text("table_assignment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGuestSchema = createInsertSchema(guests).omit({
  id: true,
  createdAt: true,
});

// Type exports for budget and planning tables
export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;

export type BudgetCategory = typeof budgetCategories.$inferSelect;
export type InsertBudgetCategory = z.infer<typeof insertBudgetCategorySchema>;

export type BudgetItem = typeof budgetItems.$inferSelect;
export type InsertBudgetItem = z.infer<typeof insertBudgetItemSchema>;

export type EventPlan = typeof eventPlans.$inferSelect;
export type InsertEventPlan = z.infer<typeof insertEventPlanSchema>;

export type PlanningChecklist = typeof planningChecklists.$inferSelect;
export type InsertPlanningChecklist = z.infer<typeof insertPlanningChecklistSchema>;

export type ChecklistItem = typeof checklistItems.$inferSelect;
export type InsertChecklistItem = z.infer<typeof insertChecklistItemSchema>;

export type GuestList = typeof guestLists.$inferSelect;
export type InsertGuestList = z.infer<typeof insertGuestListSchema>;

export type Guest = typeof guests.$inferSelect;
export type InsertGuest = z.infer<typeof insertGuestSchema>;

// Event opportunities table - for event planners to post events seeking vendors
export const eventOpportunities = pgTable("event_opportunities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventType: text("event_type").notNull(),
  eventDate: timestamp("event_date").notNull(),
  location: text("location").notNull(),
  budget: text("budget"),
  attendeeCount: integer("attendee_count"),
  categoriesNeeded: text("categories_needed").array(),
  requirementsDetails: text("requirements_details"),
  applicationDeadline: timestamp("application_deadline"),
  isPublic: boolean("is_public").notNull().default(true),
  status: text("status").notNull().default("open"),
  imageUrl: text("image_url"),
  additionalInfo: json("additional_info"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEventOpportunitySchema = createInsertSchema(eventOpportunities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Vendor applications table - for vendors to apply to event opportunities
export const vendorApplications = pgTable("vendor_applications", {
  id: serial("id").primaryKey(),
  opportunityId: integer("opportunity_id").notNull(),
  vendorId: integer("vendor_id").notNull(),
  proposedService: text("proposed_service").notNull(),
  priceQuote: text("price_quote"),
  message: text("message"),
  availability: boolean("availability").notNull().default(true),
  portfolioLinks: text("portfolio_links").array(),
  additionalInfo: json("additional_info"),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected, withdrawn
  notificationSent: boolean("notification_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVendorApplicationSchema = createInsertSchema(vendorApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  vendorId: integer("vendor_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 star rating
  reviewText: text("review_text"),
  title: text("title"),
  eventDate: timestamp("event_date"),
  serviceUsed: text("service_used"),
  isVerified: boolean("is_verified").default(false), // Admin can verify reviews
  adminReply: text("admin_reply"), // Vendor can reply to reviews
  adminReplyDate: timestamp("admin_reply_date"),
  status: text("status").default("published"), // published, pending, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isVerified: true,
  adminReply: true,
  adminReplyDate: true,
});

// Public holidays table
export const publicHolidays = pgTable("public_holidays", {
  id: serial("id").primaryKey(),
  countryCode: text("country_code").notNull(), // ISO country code (e.g., 'ZA' for South Africa)
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  isNational: boolean("is_national").default(true),
  type: text("type").default("public"), // public, religious, observance
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPublicHolidaySchema = createInsertSchema(publicHolidays).omit({
  id: true,
  createdAt: true,
});

// Calendar events table
export const calendarEvents = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  userId: integer("user_id"), // Optional - if associated with a specific user
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  allDay: boolean("all_day").default(false),
  location: text("location"),
  status: text("status").default("confirmed"), // confirmed, tentative, cancelled
  type: text("type").default("booking"), // booking, block, availability, holiday
  color: text("color"), // For UI display purposes
  recurrenceRule: text("recurrence_rule"), // For recurring events
  externalCalendarId: text("external_calendar_id"), // For sync with external calendars
  externalEventId: text("external_event_id"), // For sync with external calendars
  notificationsEnabled: boolean("notifications_enabled").default(true),
  notificationSent: boolean("notification_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  notificationSent: true,
});

// Type exports for new tables
export type EventOpportunity = typeof eventOpportunities.$inferSelect;
export type InsertEventOpportunity = z.infer<typeof insertEventOpportunitySchema>;

export type VendorApplication = typeof vendorApplications.$inferSelect;
export type InsertVendorApplication = z.infer<typeof insertVendorApplicationSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;

// Messaging system tables
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  hostId: integer("host_id").notNull(), // User ID of the event host
  providerId: integer("provider_id").notNull(), // User ID of the service provider
  subject: text("subject"),
  status: text("status").default("active"), // active, archived, deleted
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  lastMessageAt: true,
  createdAt: true,
  updatedAt: true,
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  senderId: integer("sender_id").notNull(), // User ID of the sender
  content: text("content").notNull(),
  attachments: text("attachments").array(), // URLs to attached files
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  isRead: true,
  readAt: true,
  createdAt: true,
});

// Type exports for messaging
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"), // Short summary for listings
  featuredImageUrl: text("featured_image_url"),
  authorId: integer("author_id").notNull(), // User ID of author
  publishedAt: timestamp("published_at"),
  status: text("status").notNull().default("draft"), // draft, published, archived
  categories: text("categories").array(),
  tags: text("tags").array(),
  viewCount: integer("view_count").default(0),
  commentCount: integer("comment_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  slug: true, // Generate from title
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  commentCount: true,
});

// Blog comments table
export const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  parentCommentId: integer("parent_comment_id"), // For nested comments
  content: text("content").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, spam, rejected
  isAuthorResponse: boolean("is_author_response").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogCommentSchema = createInsertSchema(blogComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

// Notice board items
export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull(),
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  category: text("category").notNull(), // general, events, important, announcement
  startDate: timestamp("start_date").notNull().defaultNow(), // When to start showing the notice
  endDate: timestamp("end_date"), // When to stop showing the notice (optional)
  audiences: text("audiences").array(), // all, vendors, event-planners, specific-users, etc.
  viewCount: integer("view_count").default(0),
  status: text("status").notNull().default("active"), // active, draft, expired, archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNoticeSchema = createInsertSchema(notices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

// Type exports for blog and notices
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = z.infer<typeof insertBlogCommentSchema>;

export type Notice = typeof notices.$inferSelect;
export type InsertNotice = z.infer<typeof insertNoticeSchema>;

// Event template presets for the one-click event template generator
export const eventTemplatePresets = pgTable("event_template_presets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  eventType: text("event_type").notNull(), // wedding, corporate, birthday, etc.
  estimatedBudget: doublePrecision("estimated_budget"),
  estimatedGuestCount: integer("estimated_guest_count"),
  duration: integer("duration").notNull(), // in hours
  timelineTasks: json("timeline_tasks").notNull().default([]), // Array of timeline tasks
  vendorCategories: json("vendor_categories").notNull().default([]), // Recommended vendor categories
  checklistItems: json("checklist_items").notNull().default([]), // Array of checklist items
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEventTemplatePresetSchema = createInsertSchema(eventTemplatePresets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports for event template presets
export type EventTemplatePreset = typeof eventTemplatePresets.$inferSelect;
export type InsertEventTemplatePreset = z.infer<typeof insertEventTemplatePresetSchema>;
