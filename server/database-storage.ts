import { db } from './db';
import { eq, like, and, desc, sql } from 'drizzle-orm';
import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  vendors, type Vendor, type InsertVendor,
  shortlists, type Shortlist, type InsertShortlist,
  tasks, type Task, type InsertTask,
  timelineEvents, type TimelineEvent, type InsertTimelineEvent,
  whatsappGroups, type WhatsappGroup, type InsertWhatsappGroup,
  whatsappMessages, type WhatsappMessage, type InsertWhatsappMessage,
  adCampaigns, type AdCampaign, type InsertAdCampaign,
  adAssets, type AdAsset, type InsertAdAsset,
  adPlacements, type AdPlacement, type InsertAdPlacement,
  seoPackages, type SeoPackage, type InsertSeoPackage,
  calendarEvents, type CalendarEvent, type InsertCalendarEvent,
  conversations, type Conversation, type InsertConversation,
  messages, type Message, type InsertMessage
} from '@shared/schema';
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Vendor operations
  async getVendors(): Promise<Vendor[]> {
    return db.select().from(vendors);
  }

  async getVendorsByCategory(categoryId: number): Promise<Vendor[]> {
    return db.select().from(vendors).where(eq(vendors.categoryId, categoryId));
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor || undefined;
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const [newVendor] = await db.insert(vendors).values(vendor).returning();
    return newVendor;
  }

  async getFeaturedVendors(limit = 3): Promise<Vendor[]> {
    return db
      .select()
      .from(vendors)
      .orderBy(desc(vendors.rating))
      .limit(limit);
  }

  async searchVendors(
    query: string, 
    categoryId?: number, 
    dietary?: string,
    cuisine?: string,
    filters?: {
      isThemed?: boolean;
      themeTypes?: string[];
      dietaryOptions?: string[];
      cuisineTypes?: string[];
      priceRange?: string | string[];
      location?: string;
      servesAlcohol?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<Vendor[]> {
    const likeQuery = `%${query}%`;
    let sqlFilters = [];
    
    // Add name search filter
    sqlFilters.push(like(vendors.name, likeQuery));
    
    // Add category filter if provided
    if (categoryId) {
      sqlFilters.push(eq(vendors.categoryId, categoryId));
    }
    
    // If isThemed filter is specified, add it to SQL filters
    if (filters?.isThemed !== undefined) {
      sqlFilters.push(eq(vendors.isThemed, filters.isThemed));
    }
    
    // Execute the query with basic filters
    let results = await db
      .select()
      .from(vendors)
      .where(and(...sqlFilters))
      .orderBy(desc(vendors.rating));
    
    // Post-query filtering for array and complex filter types
    // We need to do this in-memory because we're filtering array fields
    
    // No legacy parameters needed
    
    // Handle new filter structure
    if (filters) {
      // Filter by specific theme types
      if (filters.themeTypes && filters.themeTypes.length > 0) {
        results = results.filter(vendor => 
          vendor.themeTypes?.some(theme => 
            filters.themeTypes?.includes(theme)
          )
        );
      }
      
      // Filter by dietary options
      if (filters.dietaryOptions && filters.dietaryOptions.length > 0) {
        results = results.filter(vendor => 
          vendor.dietaryOptions?.some(option => 
            filters.dietaryOptions?.includes(option)
          )
        );
      }
      
      // Filter by cuisine types
      if (filters.cuisineTypes && filters.cuisineTypes.length > 0) {
        results = results.filter(vendor => 
          vendor.cuisineTypes?.some(cuisine => 
            filters.cuisineTypes?.includes(cuisine)
          )
        );
      }
      
      // Filter by price range
      if (filters.priceRange) {
        results = results.filter(vendor => 
          vendor.priceRange === filters.priceRange
        );
      }
      
      // Filter by location
      if (filters.location) {
        const lowerLocation = filters.location.toLowerCase();
        results = results.filter(vendor => 
          vendor.location?.toLowerCase().includes(lowerLocation)
        );
      }
      
      // Filter by servesAlcohol flag
      if (filters.servesAlcohol !== undefined) {
        results = results.filter(vendor => 
          vendor.servesAlcohol === filters.servesAlcohol
        );
      }
    }
    
    return results;
  }

  async updateVendorStripeCustomerId(id: number, customerId: string): Promise<Vendor> {
    const [updatedVendor] = await db
      .update(vendors)
      .set({ stripeCustomerId: customerId })
      .where(eq(vendors.id, id))
      .returning();
    return updatedVendor;
  }

  async updateVendorSubscription(id: number, subscriptionId: string, subscriptionTier: string): Promise<Vendor> {
    // Set tier-specific feature values
    const cataloguePages = subscriptionTier === 'basic' ? 2 : subscriptionTier === 'pro' ? 6 : 0;
    
    const [updatedVendor] = await db
      .update(vendors)
      .set({ 
        stripeSubscriptionId: subscriptionId,
        subscriptionTier,
        subscriptionStatus: 'active',
        cataloguePages
      })
      .where(eq(vendors.id, id))
      .returning();
    return updatedVendor;
  }

  async updateVendorSubscriptionStatus(subscriptionId: string, status: string): Promise<Vendor | undefined> {
    // Find vendor with this subscription ID
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.stripeSubscriptionId, subscriptionId));
    
    if (!vendor) {
      return undefined;
    }
    
    // Handle cancellation by reverting to free tier
    let updateValues: Partial<Vendor> = { subscriptionStatus: status };
    
    if (status === 'canceled') {
      updateValues = {
        ...updateValues,
        subscriptionTier: 'free',
        cataloguePages: 0
      };
    }
    
    const [updatedVendor] = await db
      .update(vendors)
      .set(updateValues)
      .where(eq(vendors.id, vendor.id))
      .returning();
    
    return updatedVendor;
  }

  // Shortlist operations
  async getShortlists(userId: number): Promise<(Shortlist & { vendor: Vendor })[]> {
    const shortlistsWithVendors = await db
      .select({
        id: shortlists.id,
        userId: shortlists.userId,
        vendorId: shortlists.vendorId,
        notes: shortlists.notes,
        createdAt: shortlists.createdAt,
        vendor: vendors
      })
      .from(shortlists)
      .innerJoin(vendors, eq(shortlists.vendorId, vendors.id))
      .where(eq(shortlists.userId, userId));
    
    return shortlistsWithVendors;
  }

  async addToShortlist(shortlist: InsertShortlist): Promise<Shortlist> {
    const [newShortlist] = await db
      .insert(shortlists)
      .values(shortlist)
      .returning();
    return newShortlist;
  }

  async removeFromShortlist(userId: number, vendorId: number): Promise<void> {
    await db
      .delete(shortlists)
      .where(
        and(
          eq(shortlists.userId, userId),
          eq(shortlists.vendorId, vendorId)
        )
      );
  }

  async isShortlisted(userId: number, vendorId: number): Promise<boolean> {
    const [shortlist] = await db
      .select()
      .from(shortlists)
      .where(
        and(
          eq(shortlists.userId, userId),
          eq(shortlists.vendorId, vendorId)
        )
      );
    return !!shortlist;
  }

  // Task operations
  async getTasks(userId: number): Promise<Task[]> {
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(tasks.dueDate);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values(task)
      .returning();
    return newTask;
  }

  async updateTaskStatus(id: number, status: string): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ status })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    await db
      .delete(tasks)
      .where(eq(tasks.id, id));
  }

  // Timeline operations
  async getTimelineEvents(userId: number): Promise<TimelineEvent[]> {
    return db
      .select()
      .from(timelineEvents)
      .where(eq(timelineEvents.userId, userId))
      .orderBy(timelineEvents.eventDate);
  }

  async createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent> {
    const [newEvent] = await db
      .insert(timelineEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  async updateTimelineEvent(id: number, completed: boolean): Promise<TimelineEvent> {
    const [updatedEvent] = await db
      .update(timelineEvents)
      .set({ completed })
      .where(eq(timelineEvents.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteTimelineEvent(id: number): Promise<void> {
    await db
      .delete(timelineEvents)
      .where(eq(timelineEvents.id, id));
  }

  // WhatsApp integration operations
  async getWhatsappGroups(userId: number): Promise<WhatsappGroup[]> {
    return db
      .select()
      .from(whatsappGroups)
      .where(eq(whatsappGroups.userId, userId));
  }

  async getWhatsappGroup(id: number): Promise<WhatsappGroup | undefined> {
    const [group] = await db
      .select()
      .from(whatsappGroups)
      .where(eq(whatsappGroups.id, id));
    return group || undefined;
  }

  async getWhatsappGroupByGroupId(groupId: string): Promise<WhatsappGroup | undefined> {
    const [group] = await db
      .select()
      .from(whatsappGroups)
      .where(eq(whatsappGroups.groupId, groupId));
    return group || undefined;
  }

  async createWhatsappGroup(group: InsertWhatsappGroup): Promise<WhatsappGroup> {
    const [newGroup] = await db
      .insert(whatsappGroups)
      .values(group)
      .returning();
    return newGroup;
  }

  async updateWhatsappGroupSettings(id: number, settings: Partial<WhatsappGroup>): Promise<WhatsappGroup> {
    const [updatedGroup] = await db
      .update(whatsappGroups)
      .set(settings)
      .where(eq(whatsappGroups.id, id))
      .returning();
    return updatedGroup;
  }

  async deleteWhatsappGroup(id: number): Promise<void> {
    await db
      .delete(whatsappGroups)
      .where(eq(whatsappGroups.id, id));
  }

  async getWhatsappMessages(groupId: number, limit?: number): Promise<WhatsappMessage[]> {
    const query = db
      .select()
      .from(whatsappMessages)
      .where(eq(whatsappMessages.groupId, groupId))
      .orderBy(desc(whatsappMessages.timestamp));
    
    if (limit) {
      query.limit(limit);
    }
    
    return query;
  }

  async createWhatsappMessage(message: InsertWhatsappMessage): Promise<WhatsappMessage> {
    const [newMessage] = await db
      .insert(whatsappMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  // Advertising operations
  async getAdCampaigns(vendorId: number): Promise<AdCampaign[]> {
    return db
      .select()
      .from(adCampaigns)
      .where(eq(adCampaigns.vendorId, vendorId));
  }

  async getAdCampaign(id: number): Promise<AdCampaign | undefined> {
    const [campaign] = await db
      .select()
      .from(adCampaigns)
      .where(eq(adCampaigns.id, id));
    return campaign || undefined;
  }

  async createAdCampaign(campaign: InsertAdCampaign): Promise<AdCampaign> {
    const [newCampaign] = await db
      .insert(adCampaigns)
      .values(campaign)
      .returning();
    return newCampaign;
  }

  async updateAdCampaign(id: number, data: Partial<AdCampaign>): Promise<AdCampaign> {
    const [updatedCampaign] = await db
      .update(adCampaigns)
      .set(data)
      .where(eq(adCampaigns.id, id))
      .returning();
    return updatedCampaign;
  }

  async getAdAssets(campaignId: number): Promise<AdAsset[]> {
    return db
      .select()
      .from(adAssets)
      .where(eq(adAssets.campaignId, campaignId));
  }

  async getAdAsset(id: number): Promise<AdAsset | undefined> {
    const [asset] = await db
      .select()
      .from(adAssets)
      .where(eq(adAssets.id, id));
    return asset || undefined;
  }

  async createAdAsset(asset: InsertAdAsset): Promise<AdAsset> {
    const [newAsset] = await db
      .insert(adAssets)
      .values(asset)
      .returning();
    return newAsset;
  }

  async getAdPlacement(position: string): Promise<AdPlacement | undefined> {
    const [placement] = await db
      .select()
      .from(adPlacements)
      .where(eq(adPlacements.position, position));
    return placement || undefined;
  }

  async getAdPlacements(): Promise<AdPlacement[]> {
    return db
      .select()
      .from(adPlacements);
  }

  async createAdPlacement(placement: InsertAdPlacement): Promise<AdPlacement> {
    const [newPlacement] = await db
      .insert(adPlacements)
      .values(placement)
      .returning();
    return newPlacement;
  }

  async trackAdImpression(adId: number): Promise<void> {
    // Increment the impressions count for the ad placement
    await db.execute(sql`
      UPDATE ad_placements 
      SET impressions = COALESCE(impressions, 0) + 1 
      WHERE id = ${adId}
    `);
  }

  async trackAdClick(adId: number): Promise<void> {
    // Increment the clicks count for the ad placement
    await db.execute(sql`
      UPDATE ad_placements 
      SET clicks = COALESCE(clicks, 0) + 1 
      WHERE id = ${adId}
    `);
  }

  async getFeaturedVendorAds(categoryId?: number, limit = 5): Promise<any[]> {
    let query = db
      .select({
        id: vendors.id,
        name: vendors.name,
        description: vendors.description,
        imageUrl: vendors.imageUrl,
        categoryId: vendors.categoryId,
        subscriptionTier: vendors.subscriptionTier
      })
      .from(vendors)
      .where(
        and(
          sql`${vendors.subscriptionTier} IN ('pro', 'platinum')`,
          categoryId ? eq(vendors.categoryId, categoryId) : undefined
        )
      )
      .orderBy(desc(vendors.rating))
      .limit(limit);
    
    return query;
  }

  async getVideoAd(position: string): Promise<any | undefined> {
    // First find the placement in the specified position
    const [placement] = await db
      .select()
      .from(adPlacements)
      .where(
        and(
          eq(adPlacements.position, position),
          eq(adPlacements.status, 'active')
        )
      );
    
    if (!placement) {
      return undefined;
    }
    
    // Find an active video asset linked to this placement
    const [asset] = await db
      .select({
        asset: adAssets,
        campaign: adCampaigns
      })
      .from(adAssets)
      .innerJoin(adCampaigns, eq(adAssets.campaignId, adCampaigns.id))
      .where(
        and(
          eq(adAssets.assetType, 'video'),
          eq(adCampaigns.status, 'active')
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(1);
    
    return asset ? asset.asset : undefined;
  }

  async getSeoPackages(): Promise<SeoPackage[]> {
    return db
      .select()
      .from(seoPackages);
  }

  async getSeoPackage(id: number): Promise<SeoPackage | undefined> {
    const [package_] = await db
      .select()
      .from(seoPackages)
      .where(eq(seoPackages.id, id));
    return package_ || undefined;
  }

  async createSeoPackage(seoPackage: InsertSeoPackage): Promise<SeoPackage> {
    const [newPackage] = await db
      .insert(seoPackages)
      .values(seoPackage)
      .returning();
    return newPackage;
  }

  async updateSeoPackage(id: number, data: Partial<SeoPackage>): Promise<SeoPackage> {
    const [updatedPackage] = await db
      .update(seoPackages)
      .set(data)
      .where(eq(seoPackages.id, id))
      .returning();
    return updatedPackage;
  }
  
  // Public Holidays operations
  async getPublicHolidays(countryCode: string): Promise<any[]> {
    return db
      .select()
      .from(publicHolidays)
      .where(eq(publicHolidays.countryCode, countryCode))
      .orderBy(publicHolidays.date);
  }
  
  async createPublicHoliday(holiday: any): Promise<any> {
    const [newHoliday] = await db
      .insert(publicHolidays)
      .values(holiday)
      .returning();
    return newHoliday;
  }
  
  // Calendar operations
  async getCalendarEvents(userId: number): Promise<CalendarEvent[]> {
    return db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.userId, userId))
      .orderBy(calendarEvents.startDate);
  }
  
  async getVendorCalendarEvents(vendorId: number, startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return db
      .select()
      .from(calendarEvents)
      .where(
        and(
          eq(calendarEvents.vendorId, vendorId),
          gte(calendarEvents.startDate, startDate),
          lte(calendarEvents.endDate, endDate)
        )
      )
      .orderBy(calendarEvents.startDate);
  }
  
  async getCalendarEvent(id: number): Promise<CalendarEvent | undefined> {
    const [event] = await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.id, id));
    return event || undefined;
  }
  
  async createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const [newEvent] = await db
      .insert(calendarEvents)
      .values(event)
      .returning();
    return newEvent;
  }
  
  async updateCalendarEvent(id: number, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const [updatedEvent] = await db
      .update(calendarEvents)
      .set(data)
      .where(eq(calendarEvents.id, id))
      .returning();
    return updatedEvent;
  }
  
  async deleteCalendarEvent(id: number): Promise<void> {
    await db
      .delete(calendarEvents)
      .where(eq(calendarEvents.id, id));
  }
  
  // Messaging operations
  async getUserConversations(userId: number, role: 'host' | 'provider'): Promise<Conversation[]> {
    return db
      .select()
      .from(conversations)
      .where(role === 'host' ? 
        eq(conversations.hostId, userId) : 
        eq(conversations.providerId, userId))
      .orderBy(desc(conversations.updatedAt));
  }
  
  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return conversation || undefined;
  }
  
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db
      .insert(conversations)
      .values({
        ...conversation,
        status: conversation.status || 'active'
      })
      .returning();
    return newConversation;
  }
  
  async updateConversationStatus(id: number, status: string): Promise<Conversation> {
    const [updatedConversation] = await db
      .update(conversations)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(conversations.id, id))
      .returning();
    return updatedConversation;
  }
  
  async updateConversationLastMessage(id: number): Promise<void> {
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, id));
  }
  
  async getMessages(conversationId: number): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }
  
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values({
        ...message,
        isRead: false
      })
      .returning();
    
    // Update conversation last activity
    await this.updateConversationLastMessage(message.conversationId);
    
    return newMessage;
  }
  
  async markMessagesAsRead(conversationId: number, userId: number): Promise<void> {
    await db
      .update(messages)
      .set({ 
        isRead: true,
        readAt: new Date()
      })
      .where(
        and(
          eq(messages.conversationId, conversationId),
          sql`${messages.senderId} != ${userId}`,
          eq(messages.isRead, false)
        )
      );
  }
}