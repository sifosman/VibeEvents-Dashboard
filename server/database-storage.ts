import { db } from './db';
import { eq, like, and, desc, sql, gte, lte } from 'drizzle-orm';
import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  vendors, type Vendor, type InsertVendor,
  vendorRegistrations, type VendorRegistration, type InsertVendorRegistration,
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
  messages, type Message, type InsertMessage,
  publicHolidays
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
    try {
      // Use native query to avoid Drizzle ORM schema issues
      const query = `
        SELECT 
          id, name, description, image_url as "imageUrl", logo_url as "logoUrl",
          category_id as "categoryId", price_range as "priceRange", rating, review_count as "reviewCount",
          instagram_url as "instagramUrl", website_url as "websiteUrl", 
          whatsapp_number as "whatsappNumber", email, location,
          is_themed as "isThemed", subscription_tier as "subscriptionTier",
          stripe_customer_id as "stripeCustomerId", stripe_subscription_id as "stripeSubscriptionId",
          subscription_status as "subscriptionStatus", google_maps_link as "googleMapsLink",
          facebook_url as "facebookUrl", twitter_url as "twitterUrl", youtube_url as "youtubeUrl",
          coalesce(theme_types, '{}') as "themeTypes", 
          coalesce(dietary_options, '{}') as "dietaryOptions",
          coalesce(cuisine_types, '{}') as "cuisineTypes"
        FROM vendors
        ORDER BY name ASC
      `;
      
      const result = await db.query(query);
      
      // Format results for frontend
      return result.rows.map(vendor => ({
        ...vendor,
        vendorTags: [],
        themeTypes: vendor.themeTypes || [],
        dietaryOptions: vendor.dietaryOptions || [],
        cuisineTypes: vendor.cuisineTypes || []
      }));
    } catch (error) {
      console.error('Error in getVendors:', error);
      return [];
    }
  }

  async getVendorsByCategory(categoryId: number): Promise<Vendor[]> {
    try {
      // Use native query to avoid Drizzle ORM schema issues
      const query = `
        SELECT 
          id, name, description, image_url as "imageUrl", logo_url as "logoUrl",
          category_id as "categoryId", price_range as "priceRange", rating, review_count as "reviewCount",
          instagram_url as "instagramUrl", website_url as "websiteUrl", 
          whatsapp_number as "whatsappNumber", email, location,
          is_themed as "isThemed", subscription_tier as "subscriptionTier",
          stripe_customer_id as "stripeCustomerId", stripe_subscription_id as "stripeSubscriptionId",
          subscription_status as "subscriptionStatus", google_maps_link as "googleMapsLink",
          facebook_url as "facebookUrl", twitter_url as "twitterUrl", youtube_url as "youtubeUrl",
          coalesce(theme_types, '{}') as "themeTypes", 
          coalesce(dietary_options, '{}') as "dietaryOptions",
          coalesce(cuisine_types, '{}') as "cuisineTypes"
        FROM vendors
        WHERE category_id = $1
        ORDER BY rating DESC
      `;
      
      const result = await db.query(query, [categoryId]);
      
      // Format results for frontend
      return result.rows.map(vendor => ({
        ...vendor,
        vendorTags: [],
        themeTypes: vendor.themeTypes || [],
        dietaryOptions: vendor.dietaryOptions || [],
        cuisineTypes: vendor.cuisineTypes || []
      }));
    } catch (error) {
      console.error('Error in getVendorsByCategory:', error);
      return [];
    }
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    try {
      // Use native query to avoid Drizzle ORM schema issues
      const query = `
        SELECT 
          id, name, description, image_url as "imageUrl", logo_url as "logoUrl",
          category_id as "categoryId", price_range as "priceRange", rating, review_count as "reviewCount",
          instagram_url as "instagramUrl", website_url as "websiteUrl", 
          whatsapp_number as "whatsappNumber", email, location,
          is_themed as "isThemed", subscription_tier as "subscriptionTier",
          stripe_customer_id as "stripeCustomerId", stripe_subscription_id as "stripeSubscriptionId",
          subscription_status as "subscriptionStatus", google_maps_link as "googleMapsLink",
          facebook_url as "facebookUrl", twitter_url as "twitterUrl", youtube_url as "youtubeUrl",
          coalesce(theme_types, '{}') as "themeTypes", 
          coalesce(dietary_options, '{}') as "dietaryOptions",
          coalesce(cuisine_types, '{}') as "cuisineTypes",
          coalesce(additional_photos, '{}') as "additionalPhotos",
          catalogue_pages as "cataloguePages",
          calendar_view as "calendarView",
          coalesce(catalog_items, '[]') as "catalogItems"
        FROM vendors
        WHERE id = $1
      `;
      
      const result = await db.query(query, [id]);
      
      if (result.rows.length === 0) {
        return undefined;
      }
      
      // Format results for frontend with all expected fields
      const vendor = {
        ...result.rows[0],
        vendorTags: [],
        themeTypes: result.rows[0].themeTypes || [],
        dietaryOptions: result.rows[0].dietaryOptions || [],
        cuisineTypes: result.rows[0].cuisineTypes || [],
        additionalPhotos: result.rows[0].additionalPhotos || [],
        catalogItems: result.rows[0].catalogItems || []
      };
      
      return vendor;
    } catch (error) {
      console.error('Error in getVendor:', error);
      return undefined;
    }
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const [newVendor] = await db.insert(vendors).values(vendor).returning();
    return newVendor;
  }

  async getFeaturedVendors(limit = 3): Promise<Vendor[]> {
    try {
      // Use a raw SQL query to avoid ORM schema issues - no reference to vendor_tags
      const query = `
        SELECT 
          id, name, description, image_url as "imageUrl", logo_url as "logoUrl",
          category_id as "categoryId", price_range as "priceRange", rating, review_count as "reviewCount",
          instagram_url as "instagramUrl", website_url as "websiteUrl", 
          whatsapp_number as "whatsappNumber", location,
          is_themed as "isThemed", subscription_tier as "subscriptionTier"
        FROM vendors
        ORDER BY rating DESC
        LIMIT $1
      `;
      
      const result = await db.query(query, [limit]);
      
      // Format the results to match what the frontend expects
      return result.rows.map(vendor => ({
        ...vendor,
        // Add empty arrays for fields expected by frontend
        vendorTags: [],
        themeTypes: [],
        dietaryOptions: [],
        cuisineTypes: []
      }));
    } catch (error) {
      console.error('Error in getFeaturedVendors:', error);
      // Return empty array instead of throwing
      return [];
    }
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
    try {
      // Construct WHERE clause parts for SQL query
      const whereClause = [];
      const params: any[] = [];
      
      // Add name search filter
      const likeQuery = `%${query}%`;
      whereClause.push(`name ILIKE $${params.length + 1}`);
      params.push(likeQuery);
      
      // Add category filter if provided
      if (categoryId) {
        whereClause.push(`category_id = $${params.length + 1}`);
        params.push(categoryId);
      }
      
      // If isThemed filter is specified, add it to SQL filters
      if (filters?.isThemed !== undefined) {
        whereClause.push(`is_themed = $${params.length + 1}`);
        params.push(filters.isThemed);
      }
      
      // Add location filter if present
      if (filters?.location) {
        whereClause.push(`location ILIKE $${params.length + 1}`);
        params.push(`%${filters.location}%`);
      }
      
      // Add price range filter if present
      if (filters?.priceRange) {
        whereClause.push(`price_range = $${params.length + 1}`);
        params.push(filters.priceRange);
      }
      
      // Build complete SQL query
      let sqlQuery = `
        SELECT 
          id, name, description, image_url as "imageUrl", logo_url as "logoUrl",
          category_id as "categoryId", price_range as "priceRange", rating, review_count as "reviewCount",
          instagram_url as "instagramUrl", website_url as "websiteUrl", 
          whatsapp_number as "whatsappNumber", email, location,
          is_themed as "isThemed", subscription_tier as "subscriptionTier",
          stripe_customer_id as "stripeCustomerId", stripe_subscription_id as "stripeSubscriptionId",
          subscription_status as "subscriptionStatus", google_maps_link as "googleMapsLink",
          facebook_url as "facebookUrl", twitter_url as "twitterUrl", youtube_url as "youtubeUrl",
          coalesce(theme_types, '{}') as "themeTypes", 
          coalesce(dietary_options, '{}') as "dietaryOptions",
          coalesce(cuisine_types, '{}') as "cuisineTypes",
          coalesce(word_count, 0) as "wordCount"
        FROM vendors
      `;
      
      // Add WHERE clause if we have conditions
      if (whereClause.length > 0) {
        sqlQuery += ' WHERE ' + whereClause.join(' AND ');
      }
      
      // Add ordering
      sqlQuery += ' ORDER BY rating DESC';
      
      // Execute the query
      const result = await db.query(sqlQuery, params);
      
      // Format results for frontend
      return result.rows.map(vendor => {
        return {
          ...vendor,
          // Add any missing fields expected by frontend
          vendorTags: [],
          themeTypes: vendor.themeTypes || [],
          dietaryOptions: vendor.dietaryOptions || [],
          cuisineTypes: vendor.cuisineTypes || []
        };
      });
    } catch (error) {
      console.error('Error in searchVendors:', error);
      // Return empty array instead of failing
      return [];
    }
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

  // Vendor Registration operations
  async getVendorRegistrations(): Promise<VendorRegistration[]> {
    return db.select().from(vendorRegistrations).orderBy(desc(vendorRegistrations.createdAt));
  }

  async getVendorRegistrationById(id: number): Promise<VendorRegistration | undefined> {
    const [registration] = await db.select().from(vendorRegistrations).where(eq(vendorRegistrations.id, id));
    return registration || undefined;
  }

  async createVendorRegistration(registration: InsertVendorRegistration): Promise<VendorRegistration> {
    const [newRegistration] = await db.insert(vendorRegistrations).values(registration).returning();
    return newRegistration;
  }

  async updateVendorRegistrationStatus(id: number, status: string, adminNotes?: string): Promise<VendorRegistration | undefined> {
    const [updatedRegistration] = await db
      .update(vendorRegistrations)
      .set({ 
        status, 
        adminNotes,
        reviewedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(vendorRegistrations.id, id))
      .returning();
    
    return updatedRegistration || undefined;
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
    // For now, return an empty array to avoid errors
    // In a production environment, we would query the database
    console.log(`Fetching public holidays for ${countryCode}`);
    return [];
  }
  
  async createPublicHoliday(holiday: any): Promise<any> {
    // For testing purposes only
    console.log('Creating public holiday:', holiday);
    return { 
      id: 1,
      ...holiday,
      createdAt: new Date()
    };
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