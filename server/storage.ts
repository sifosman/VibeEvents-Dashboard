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
  seoPackages, type SeoPackage, type InsertSeoPackage
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Vendor operations
  getVendors(): Promise<Vendor[]>;
  getVendorsByCategory(categoryId: number): Promise<Vendor[]>;
  getVendor(id: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  getFeaturedVendors(limit?: number): Promise<Vendor[]>;
  searchVendors(query: string, categoryId?: number): Promise<Vendor[]>;
  updateVendorStripeCustomerId(id: number, customerId: string): Promise<Vendor>;
  updateVendorSubscription(id: number, subscriptionId: string, subscriptionTier: string): Promise<Vendor>;
  updateVendorSubscriptionStatus(subscriptionId: string, status: string): Promise<Vendor | undefined>;

  // Shortlist operations
  getShortlists(userId: number): Promise<(Shortlist & { vendor: Vendor })[]>;
  addToShortlist(shortlist: InsertShortlist): Promise<Shortlist>;
  removeFromShortlist(userId: number, vendorId: number): Promise<void>;
  isShortlisted(userId: number, vendorId: number): Promise<boolean>;

  // Task operations
  getTasks(userId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTaskStatus(id: number, status: string): Promise<Task>;
  deleteTask(id: number): Promise<void>;

  // Timeline operations
  getTimelineEvents(userId: number): Promise<TimelineEvent[]>;
  createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent>;
  updateTimelineEvent(id: number, completed: boolean): Promise<TimelineEvent>;
  deleteTimelineEvent(id: number): Promise<void>;
  
  // WhatsApp integration operations
  getWhatsappGroups(userId: number): Promise<WhatsappGroup[]>;
  getWhatsappGroup(id: number): Promise<WhatsappGroup | undefined>;
  getWhatsappGroupByGroupId(groupId: string): Promise<WhatsappGroup | undefined>;
  createWhatsappGroup(group: InsertWhatsappGroup): Promise<WhatsappGroup>;
  updateWhatsappGroupSettings(id: number, settings: Partial<WhatsappGroup>): Promise<WhatsappGroup>;
  deleteWhatsappGroup(id: number): Promise<void>;
  getWhatsappMessages(groupId: number, limit?: number): Promise<WhatsappMessage[]>;
  createWhatsappMessage(message: InsertWhatsappMessage): Promise<WhatsappMessage>;
  
  // Advertising operations
  getAdCampaigns(vendorId: number): Promise<AdCampaign[]>;
  getAdCampaign(id: number): Promise<AdCampaign | undefined>;
  createAdCampaign(campaign: InsertAdCampaign): Promise<AdCampaign>;
  updateAdCampaign(id: number, data: Partial<AdCampaign>): Promise<AdCampaign>;
  getAdAssets(campaignId: number): Promise<AdAsset[]>;
  getAdAsset(id: number): Promise<AdAsset | undefined>;
  createAdAsset(asset: InsertAdAsset): Promise<AdAsset>;
  getAdPlacement(position: string): Promise<AdPlacement | undefined>;
  getAdPlacements(): Promise<AdPlacement[]>;
  createAdPlacement(placement: InsertAdPlacement): Promise<AdPlacement>;
  trackAdImpression(adId: number): Promise<void>;
  trackAdClick(adId: number): Promise<void>;
  getFeaturedVendorAds(categoryId?: number, limit?: number): Promise<any[]>;
  getVideoAd(position: string): Promise<any | undefined>;
  getSeoPackages(): Promise<SeoPackage[]>;
  getSeoPackage(id: number): Promise<SeoPackage | undefined>;
  createSeoPackage(seoPackage: InsertSeoPackage): Promise<SeoPackage>;
  updateSeoPackage(id: number, data: Partial<SeoPackage>): Promise<SeoPackage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private vendors: Map<number, Vendor>;
  private shortlists: Map<number, Shortlist>;
  private tasks: Map<number, Task>;
  private timelineEvents: Map<number, TimelineEvent>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private vendorIdCounter: number;
  private shortlistIdCounter: number;
  private taskIdCounter: number;
  private timelineEventIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.vendors = new Map();
    this.shortlists = new Map();
    this.tasks = new Map();
    this.timelineEvents = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.vendorIdCounter = 1;
    this.shortlistIdCounter = 1;
    this.taskIdCounter = 1;
    this.timelineEventIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add categories
    const categoriesData: InsertCategory[] = [
      {
        name: "Venues",
        description: "Halls, Gardens, Hotels",
        imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        slug: "venues"
      },
      {
        name: "Catering & Bakers",
        description: "Chefs, Bakers, Caterers",
        imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        slug: "catering-bakers"
      },
      {
        name: "Hair & Makeup",
        description: "Stylists & Beauty Services",
        imageUrl: "https://images.unsplash.com/photo-1551737823-ebb5cc363d34?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        slug: "hair-makeup"
      },
      {
        name: "Photography & Video",
        description: "Capture your memories",
        imageUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        slug: "photography-video"
      },
      {
        name: "Audio & Visual",
        description: "Sound, Lighting & Effects",
        imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        slug: "audio-visual"
      },
      {
        name: "Decor & Design",
        description: "Flowers, Themes & Styling",
        imageUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        slug: "decor-design"
      },
      {
        name: "Transportation",
        description: "Luxury Cars & Shuttles",
        imageUrl: "https://images.unsplash.com/photo-1630331276975-4179847a9b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        slug: "transportation"
      },
      {
        name: "Entertainment",
        description: "Music, Performers & DJs",
        imageUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        slug: "entertainment"
      },
      {
        name: "Market Vendors",
        description: "Food Stalls, Clothing, Crafts & More",
        imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        slug: "market-vendors"
      },
      {
        name: "Vendor Opportunities",
        description: "Open Applications for Events",
        imageUrl: "https://images.unsplash.com/photo-1556125574-d7f27ec36a06?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        slug: "vendor-opportunities"
      }
    ];

    categoriesData.forEach(category => this.createCategory(category));

    // Add vendors
    const vendorsData: InsertVendor[] = [
      {
        name: "Rose Garden Hall",
        description: "Elegant garden venue with indoor and outdoor spaces, perfect for ceremonies and receptions up to 300 guests.",
        imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 1, // Venues
        priceRange: "$$",
        rating: 4.5,
        reviewCount: 48,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "New York, NY"
      },
      {
        name: "Sweet Delights Bakery",
        description: "Award-winning cake designer specializing in custom wedding cakes, cupcakes, and dessert tables for your special day.",
        imageUrl: "https://images.unsplash.com/photo-1547059470-3b0c7cd958a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 2, // Catering & Bakers
        priceRange: "$$$",
        rating: 5.0,
        reviewCount: 72,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "Chicago, IL"
      },
      {
        name: "Glamour Bridal Studio",
        description: "Professional hair and makeup team specializing in bridal styling, with services for the entire bridal party.",
        imageUrl: "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 3, // Hair & Makeup
        priceRange: "$$",
        rating: 4.0,
        reviewCount: 36,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "Los Angeles, CA"
      },
      {
        name: "Highland Manor",
        description: "Country estate with gardens and lake views, accommodating up to 200 guests.",
        imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 1, // Venues
        priceRange: "$$$",
        rating: 4.5,
        reviewCount: 42,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "Boston, MA"
      },
      {
        name: "Gourmet Catering Co",
        description: "Custom menus with international cuisine options and professional service staff.",
        imageUrl: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 2, // Catering & Bakers
        priceRange: "$$$",
        rating: 5.0,
        reviewCount: 63,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "Miami, FL"
      },
      {
        name: "Elegant Style Studios",
        description: "Expert hairstylists specializing in bridal updos, styling, and treatments.",
        imageUrl: "https://images.unsplash.com/photo-1534957753291-b8f8bee38c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 3, // Hair & Makeup
        priceRange: "$$",
        rating: 4.0,
        reviewCount: 28,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "Seattle, WA"
      },
      {
        name: "Sound Solutions AV",
        description: "Complete sound, lighting, and visual effects for ceremonies and receptions.",
        imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 5, // Audio & Visual
        priceRange: "$$",
        rating: 3.5,
        reviewCount: 19,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "Austin, TX"
      },
      {
        name: "Floral Fantasy",
        description: "Stunning floral arrangements, bouquets, and venue decoration services.",
        imageUrl: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 6, // Decor & Design
        priceRange: "$$",
        rating: 4.0,
        reviewCount: 37,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "San Francisco, CA"
      },
      {
        name: "Melody Makers",
        description: "Live band with customizable setlists and DJ services for your reception.",
        imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b3ce551?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 8, // Entertainment
        priceRange: "$$$",
        rating: 5.0,
        reviewCount: 51,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "Nashville, TN"
      },
      {
        name: "Classic Captures",
        description: "Award-winning wedding photographers capturing timeless moments and emotions.",
        imageUrl: "https://images.unsplash.com/photo-1603049489988-53ebe4cd1c38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 4, // Photography & Video
        priceRange: "$$$",
        rating: 4.5,
        reviewCount: 47,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "Denver, CO"
      },
      {
        name: "Premium Rides",
        description: "Luxury vehicles and guest shuttles for a seamless wedding day transportation.",
        imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 7, // Transportation
        priceRange: "$$",
        rating: 4.0,
        reviewCount: 23,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "Atlanta, GA"
      },
      {
        name: "Gourmet Food Stalls",
        description: "Authentic food stalls offering a variety of international cuisines for markets and events.",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 9, // Market Vendors
        priceRange: "$",
        rating: 4.8,
        reviewCount: 56,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "Portland, OR"
      },
      {
        name: "Artisan Crafts & Gifts",
        description: "Handmade crafts, jewelry, and unique gifts for market events and festivals.",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 9, // Market Vendors
        priceRange: "$$",
        rating: 4.6,
        reviewCount: 38,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "Seattle, WA"
      },
      {
        name: "Spring Festival Applications",
        description: "Vendor applications now open for the Annual Spring Festival. Limited spots available.",
        imageUrl: "https://images.unsplash.com/photo-1529586691389-4aaa1f44e8ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 10, // Vendor Opportunities
        priceRange: "$",
        rating: 4.9,
        reviewCount: 124,
        instagramUrl: "https://instagram.com/",
        websiteUrl: "https://example.com/",
        whatsappNumber: "+1234567890",
        location: "Dallas, TX"
      }
    ];

    vendorsData.forEach(vendor => this.createVendor(vendor));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Vendor operations
  async getVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendorsByCategory(categoryId: number): Promise<Vendor[]> {
    return Array.from(this.vendors.values()).filter(
      (vendor) => vendor.categoryId === categoryId
    );
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = this.vendorIdCounter++;
    const vendor: Vendor = { ...insertVendor, id };
    this.vendors.set(id, vendor);
    return vendor;
  }

  async getFeaturedVendors(limit = 3): Promise<Vendor[]> {
    return Array.from(this.vendors.values())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  async searchVendors(query: string, categoryId?: number): Promise<Vendor[]> {
    let results = Array.from(this.vendors.values());
    
    if (categoryId) {
      results = results.filter(vendor => vendor.categoryId === categoryId);
    }
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(vendor => 
        vendor.name.toLowerCase().includes(lowerQuery) ||
        vendor.description.toLowerCase().includes(lowerQuery) ||
        vendor.location?.toLowerCase().includes(lowerQuery)
      );
    }
    
    return results;
  }

  // Shortlist operations
  async getShortlists(userId: number): Promise<(Shortlist & { vendor: Vendor })[]> {
    const userShortlists = Array.from(this.shortlists.values()).filter(
      (shortlist) => shortlist.userId === userId
    );
    
    return userShortlists.map(shortlist => {
      const vendor = this.vendors.get(shortlist.vendorId);
      if (!vendor) {
        throw new Error(`Vendor with id ${shortlist.vendorId} not found`);
      }
      return { ...shortlist, vendor };
    });
  }

  async addToShortlist(insertShortlist: InsertShortlist): Promise<Shortlist> {
    // Check if already shortlisted
    const existing = Array.from(this.shortlists.values()).find(
      s => s.userId === insertShortlist.userId && s.vendorId === insertShortlist.vendorId
    );
    
    if (existing) {
      return existing;
    }
    
    const id = this.shortlistIdCounter++;
    const createdAt = new Date();
    const shortlist: Shortlist = { ...insertShortlist, id, createdAt };
    this.shortlists.set(id, shortlist);
    return shortlist;
  }

  async removeFromShortlist(userId: number, vendorId: number): Promise<void> {
    const shortlistId = Array.from(this.shortlists.entries()).find(
      ([_, shortlist]) => shortlist.userId === userId && shortlist.vendorId === vendorId
    )?.[0];
    
    if (shortlistId) {
      this.shortlists.delete(shortlistId);
    }
  }

  async isShortlisted(userId: number, vendorId: number): Promise<boolean> {
    return Array.from(this.shortlists.values()).some(
      s => s.userId === userId && s.vendorId === vendorId
    );
  }

  // Task operations
  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.userId === userId)
      .sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const createdAt = new Date();
    const task: Task = { ...insertTask, id, createdAt };
    this.tasks.set(id, task);
    return task;
  }

  async updateTaskStatus(id: number, status: string): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const updatedTask = { ...task, status };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    this.tasks.delete(id);
  }

  // Timeline operations
  async getTimelineEvents(userId: number): Promise<TimelineEvent[]> {
    return Array.from(this.timelineEvents.values())
      .filter(event => event.userId === userId)
      .sort((a, b) => {
        if (!a.eventDate) return 1;
        if (!b.eventDate) return -1;
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      });
  }

  async createTimelineEvent(insertEvent: InsertTimelineEvent): Promise<TimelineEvent> {
    const id = this.timelineEventIdCounter++;
    const createdAt = new Date();
    const event: TimelineEvent = { ...insertEvent, id, createdAt };
    this.timelineEvents.set(id, event);
    return event;
  }

  async updateTimelineEvent(id: number, completed: boolean): Promise<TimelineEvent> {
    const event = this.timelineEvents.get(id);
    if (!event) {
      throw new Error(`Timeline event with id ${id} not found`);
    }
    
    const updatedEvent = { ...event, completed };
    this.timelineEvents.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteTimelineEvent(id: number): Promise<void> {
    this.timelineEvents.delete(id);
  }

  // Vendor subscription operations
  async updateVendorStripeCustomerId(id: number, customerId: string): Promise<Vendor> {
    const vendor = this.vendors.get(id);
    if (!vendor) {
      throw new Error(`Vendor with ID ${id} not found`);
    }

    const updatedVendor = { ...vendor, stripeCustomerId: customerId };
    this.vendors.set(id, updatedVendor);
    return updatedVendor;
  }

  async updateVendorSubscription(id: number, subscriptionId: string, subscriptionTier: string): Promise<Vendor> {
    const vendor = this.vendors.get(id);
    if (!vendor) {
      throw new Error(`Vendor with ID ${id} not found`);
    }

    // Set subscription details
    const updatedVendor = { 
      ...vendor, 
      stripeSubscriptionId: subscriptionId, 
      subscriptionTier: subscriptionTier,
      subscriptionStatus: 'active',
      // Set tier-specific features
      cataloguePages: subscriptionTier === 'basic' ? 2 : subscriptionTier === 'pro' ? 6 : 0
    };
    
    this.vendors.set(id, updatedVendor);
    return updatedVendor;
  }

  async updateVendorSubscriptionStatus(subscriptionId: string, status: string): Promise<Vendor | undefined> {
    // Find vendor by subscription ID
    const vendor = Array.from(this.vendors.values()).find(
      v => v.stripeSubscriptionId === subscriptionId
    );

    if (!vendor) {
      return undefined;
    }

    // Update status
    const updatedVendor = { ...vendor, subscriptionStatus: status };
    this.vendors.set(vendor.id, updatedVendor);

    // If canceled, revert to free tier
    if (status === 'canceled') {
      updatedVendor.subscriptionTier = 'free';
      updatedVendor.cataloguePages = 0;
    }

    return updatedVendor;
  }
}

// Import the DatabaseStorage class
import { DatabaseStorage } from './database-storage';

// Use DatabaseStorage for persistent storage
export const storage = new DatabaseStorage();
