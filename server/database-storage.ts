import { db } from './db';
import { eq, like, and, desc, sql } from 'drizzle-orm';
import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  vendors, type Vendor, type InsertVendor,
  shortlists, type Shortlist, type InsertShortlist,
  tasks, type Task, type InsertTask,
  timelineEvents, type TimelineEvent, type InsertTimelineEvent
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

  async searchVendors(query: string, categoryId?: number): Promise<Vendor[]> {
    const likeQuery = `%${query}%`;
    if (categoryId) {
      return db
        .select()
        .from(vendors)
        .where(
          and(
            like(vendors.name, likeQuery),
            eq(vendors.categoryId, categoryId)
          )
        );
    } else {
      return db
        .select()
        .from(vendors)
        .where(like(vendors.name, likeQuery));
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
}