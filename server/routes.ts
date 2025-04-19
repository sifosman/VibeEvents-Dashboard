import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { notifyVendorsAboutEvent } from "./services/whatsapp";
import { 
  insertUserSchema, 
  insertShortlistSchema, 
  insertTaskSchema, 
  insertTimelineEventSchema,
  insertWhatsappGroupSchema,
  insertWhatsappMessageSchema,
  insertAdCampaignSchema,
  insertAdAssetSchema,
  insertAdPlacementSchema,
  insertSeoPackageSchema,
  insertEventOpportunitySchema,
  insertVendorApplicationSchema,
  insertCalendarEventSchema,
  insertReviewSchema,
  insertConversationSchema,
  insertMessageSchema
} from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      
      const user = await storage.createUser(validatedData);
      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Category routes
  app.get('/api/categories', async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/categories/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/categories/slug/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Vendor routes
  app.get('/api/vendors', async (req: Request, res: Response) => {
    try {
      const { 
        categoryId, 
        search, 
        dietary, 
        cuisine, 
        themed, 
        themeTypes, 
        priceRange, 
        location,
        servesAlcohol,
        vendorTag,
        page = '1',
        limit = '20'
      } = req.query;
      
      // Parse pagination parameters
      const currentPage = parseInt(page as string) || 1;
      const pageSize = parseInt(limit as string) || 20;
      const offset = (currentPage - 1) * pageSize;
      
      let vendors;
      
      // Build complex filters object for search
      const filters: any = {};
      
      // Set pagination parameters
      filters.limit = pageSize;
      filters.offset = offset;
      
      // Convert category ID if present
      const category = categoryId ? parseInt(categoryId as string) : undefined;
      
      // Add themed filters if present
      if (themed === 'true') {
        filters.isThemed = true;
        
        // Add specific theme types if provided
        if (themeTypes) {
          filters.themeTypes = Array.isArray(themeTypes) 
            ? themeTypes as string[] 
            : (themeTypes as string).split(',');
        }
      }
      
      // Add dietary filters if present
      if (dietary) {
        filters.dietaryOptions = Array.isArray(dietary) 
          ? dietary as string[] 
          : (dietary as string).split(',');
      }
      
      // Add cuisine filters if present
      if (cuisine) {
        filters.cuisineTypes = Array.isArray(cuisine) 
          ? cuisine as string[] 
          : (cuisine as string).split(',');
      }
      
      // Add price range filter if present
      if (priceRange) {
        filters.priceRange = Array.isArray(priceRange) 
          ? priceRange as string[] 
          : (priceRange as string).split(',');
      }
      
      // Add location filter if present
      if (location) {
        filters.location = location as string;
      }
      
      // Add alcohol filter if present
      if (servesAlcohol !== undefined) {
        filters.servesAlcohol = servesAlcohol === 'true';
      }
      
      // Add vendor tag filter if present
      if (vendorTag) {
        filters.vendorTags = Array.isArray(vendorTag) 
          ? vendorTag as string[] 
          : [vendorTag as string];
      }
      
      // Use search function even without search term to utilize its filtering capabilities
      const searchQuery = search ? (search as string) : '';
      vendors = await storage.searchVendors(searchQuery, category, undefined, undefined, filters);
      
      res.status(200).json(vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  });

  app.get('/api/vendors/featured', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const vendors = await storage.getFeaturedVendors(limit);
      res.status(200).json(vendors);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/vendors/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const vendor = await storage.getVendor(id);
      
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
      
      res.status(200).json(vendor);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Reviews API endpoints
  app.get('/api/reviews', async (req: Request, res: Response) => {
    try {
      const vendorId = req.query.vendorId ? parseInt(req.query.vendorId as string) : undefined;
      
      if (!vendorId) {
        return res.status(400).json({ message: 'Vendor ID is required' });
      }
      
      const reviews = await storage.getReviewsByVendor(vendorId);
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/reviews', async (req: Request, res: Response) => {
    try {
      const { userId, vendorId, rating, reviewText, title, eventDate, serviceUsed } = req.body;
      
      // Validate that the vendor exists and has the appropriate subscription
      const vendor = await storage.getVendor(vendorId);
      
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
      
      // Only premium and premium pro vendors can have reviews
      if (vendor.subscriptionTier !== 'premium' && vendor.subscriptionTier !== 'premium pro') {
        return res.status(403).json({ 
          message: 'Reviews are only available for premium and premium pro vendors'
        });
      }
      
      // Validate word count (maximum 120 words)
      if (reviewText && reviewText.trim().split(/\s+/).length > 120) {
        return res.status(400).json({ 
          message: 'Review is too long. Please limit your review to 120 words.'
        });
      }
      
      const review = await storage.createReview({
        userId,
        vendorId,
        rating,
        reviewText,
        title,
        eventDate: eventDate ? new Date(eventDate) : null,
        serviceUsed: serviceUsed || null,
        isVerified: false, // Admin would verify reviews
      });
      
      // Update the vendor's average rating and review count
      await storage.updateVendorRatings(vendorId);
      
      res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/reviews/:id/reply', async (req: Request, res: Response) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { adminReply } = req.body;
      
      // In a real implementation, validate that the user is the vendor or admin
      
      const review = await storage.getReview(reviewId);
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      
      const updatedReview = await storage.updateReviewReply(reviewId, adminReply);
      res.json(updatedReview);
    } catch (error) {
      console.error('Error updating review reply:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Shortlist routes
  app.get('/api/shortlists', async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      
      const shortlists = await storage.getShortlists(parseInt(userId as string));
      res.status(200).json(shortlists);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/shortlists', async (req: Request, res: Response) => {
    try {
      const validatedData = insertShortlistSchema.parse(req.body);
      const shortlist = await storage.addToShortlist(validatedData);
      res.status(201).json(shortlist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/shortlists/:userId/:vendorId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const vendorId = parseInt(req.params.vendorId);
      
      await storage.removeFromShortlist(userId, vendorId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/shortlists/:userId/:vendorId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const vendorId = parseInt(req.params.vendorId);
      
      const isShortlisted = await storage.isShortlisted(userId, vendorId);
      res.status(200).json({ isShortlisted });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Task routes
  app.get('/api/tasks', async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      
      const tasks = await storage.getTasks(parseInt(userId as string));
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/tasks', async (req: Request, res: Response) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/tasks/:id/status', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
      
      const task = await storage.updateTaskStatus(id, status);
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Timeline routes
  app.get('/api/timeline', async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      
      const events = await storage.getTimelineEvents(parseInt(userId as string));
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/timeline', async (req: Request, res: Response) => {
    try {
      const validatedData = insertTimelineEventSchema.parse(req.body);
      const event = await storage.createTimelineEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/timeline/:id/completed', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { completed } = req.body;
      
      if (completed === undefined) {
        return res.status(400).json({ message: 'Completed status is required' });
      }
      
      const event = await storage.updateTimelineEvent(id, completed);
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/timeline/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTimelineEvent(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // WhatsApp integration routes
  app.get('/api/whatsapp-groups/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const groups = await storage.getWhatsappGroups(userId);
      res.status(200).json(groups);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/whatsapp-groups', async (req: Request, res: Response) => {
    try {
      const validatedData = insertWhatsappGroupSchema.parse(req.body);
      const group = await storage.createWhatsappGroup(validatedData);
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/whatsapp-groups/:id/task-sync', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { syncEnabled } = req.body;
      
      if (syncEnabled === undefined) {
        return res.status(400).json({ message: 'Sync status is required' });
      }
      
      const group = await storage.updateWhatsappGroupSettings(id, {
        taskSync: syncEnabled
      });
      res.status(200).json(group);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/whatsapp-groups/:id/timeline-sync', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { syncEnabled } = req.body;
      
      if (syncEnabled === undefined) {
        return res.status(400).json({ message: 'Sync status is required' });
      }
      
      const group = await storage.updateWhatsappGroupSettings(id, {
        timelineSync: syncEnabled
      });
      res.status(200).json(group);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/whatsapp-groups/:id/notifications', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { enabled } = req.body;
      
      if (enabled === undefined) {
        return res.status(400).json({ message: 'Enabled status is required' });
      }
      
      const group = await storage.updateWhatsappGroupSettings(id, {
        notificationsEnabled: enabled
      });
      res.status(200).json(group);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/whatsapp-groups/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteWhatsappGroup(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/whatsapp-messages/:groupId', async (req: Request, res: Response) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const messages = await storage.getWhatsappMessages(groupId, limit);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/whatsapp-messages', async (req: Request, res: Response) => {
    try {
      const validatedData = insertWhatsappMessageSchema.parse(req.body);
      const message = await storage.createWhatsappMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Advertising routes
  app.get('/api/ads/campaigns/:vendorId', async (req: Request, res: Response) => {
    try {
      const vendorId = parseInt(req.params.vendorId);
      const campaigns = await storage.getAdCampaigns(vendorId);
      res.status(200).json(campaigns);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/ads/campaigns', async (req: Request, res: Response) => {
    try {
      const validatedData = insertAdCampaignSchema.parse(req.body);
      const campaign = await storage.createAdCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/ads/assets/:campaignId', async (req: Request, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const assets = await storage.getAdAssets(campaignId);
      res.status(200).json(assets);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/ads/assets', async (req: Request, res: Response) => {
    try {
      const validatedData = insertAdAssetSchema.parse(req.body);
      const asset = await storage.createAdAsset(validatedData);
      res.status(201).json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/ads/:position', async (req: Request, res: Response) => {
    try {
      const { position } = req.params;
      const adPlacement = await storage.getAdPlacement(position);
      
      if (!adPlacement) {
        return res.status(404).json({ message: 'No ad available for this position' });
      }
      
      res.status(200).json(adPlacement);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/ads/video/:position', async (req: Request, res: Response) => {
    try {
      const { position } = req.params;
      const videoAd = await storage.getVideoAd(position);
      
      if (!videoAd) {
        return res.status(404).json({ message: 'No video ad available for this position' });
      }
      
      res.status(200).json(videoAd);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/ads/featured-vendors', async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      
      const featuredVendors = await storage.getFeaturedVendorAds(categoryId, limit);
      res.status(200).json(featuredVendors);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/ads/:id/impression', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.trackAdImpression(id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/ads/:id/click', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.trackAdClick(id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/ads/:id/video-progress', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { progress } = req.body;
      
      // Just track the progress - no need to store this data for now
      // We could add this feature later if needed
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/seo-packages', async (req: Request, res: Response) => {
    try {
      const seoPackages = await storage.getSeoPackages();
      res.status(200).json(seoPackages);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Public holidays routes
  app.get('/api/public-holidays/:countryCode', async (req: Request, res: Response) => {
    try {
      const { countryCode } = req.params;
      const holidays = await storage.getPublicHolidays(countryCode);
      res.status(200).json(holidays);
    } catch (error) {
      console.error('Error fetching public holidays:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/public-holidays', async (req: Request, res: Response) => {
    try {
      const validatedData = insertPublicHolidaySchema.parse(req.body);
      const holiday = await storage.createPublicHoliday(validatedData);
      res.status(201).json(holiday);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/seo-packages', async (req: Request, res: Response) => {
    try {
      const validatedData = insertSeoPackageSchema.parse(req.body);
      const seoPackage = await storage.createSeoPackage(validatedData);
      res.status(201).json(seoPackage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Stripe subscription routes
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Warning: STRIPE_SECRET_KEY is not set. Stripe integration will not function properly.');
  }
  
  const stripe = process.env.STRIPE_SECRET_KEY ? 
    new Stripe(process.env.STRIPE_SECRET_KEY) : 
    undefined;
  
  // Create a payment intent for one-time payments
  app.post('/api/create-payment-intent', async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured' });
    }
    
    try {
      const { amount, vendorId } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'zar', // South African Rand
        metadata: { vendorId }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: `Error creating payment intent: ${error.message}` });
    }
  });
  
  // Create a subscription
  app.post('/api/subscriptions', async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured' });
    }
    
    try {
      const { vendorId, subscriptionTier, email, name } = req.body;
      
      if (!vendorId || !subscriptionTier || !email) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Get the vendor
      const vendor = await storage.getVendor(vendorId);
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
      
      // Create or get customer
      let customerId = vendor.stripeCustomerId;
      
      if (!customerId) {
        const customer = await stripe.customers.create({
          email,
          name,
          metadata: { vendorId }
        });
        customerId = customer.id;
        
        // Update vendor with customer ID
        // We'll need to add this method to storage
        // await storage.updateVendorStripeCustomerId(vendorId, customerId);
      }
      
      // Get the price ID based on tier
      let priceId;
      if (subscriptionTier === 'basic') {
        priceId = process.env.STRIPE_BASIC_PRICE_ID;
      } else if (subscriptionTier === 'pro') {
        priceId = process.env.STRIPE_PRO_PRICE_ID;
      } else if (subscriptionTier === 'platinum') {
        priceId = process.env.STRIPE_PLATINUM_PRICE_ID;
      } else {
        return res.status(400).json({ message: 'Invalid subscription tier' });
      }
      
      if (!priceId) {
        return res.status(500).json({ message: `Stripe price ID for ${subscriptionTier} tier not configured` });
      }
      
      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });
      
      // Update vendor with subscription ID and tier
      // We'll need to add this method to storage
      // await storage.updateVendorSubscription(vendorId, subscription.id, subscriptionTier);
      
      // Return client secret for the invoice's payment intent
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
      
      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      res.status(500).json({ message: `Error creating subscription: ${error.message}` });
    }
  });
  
  // Handle subscription webhook
  app.post('/api/webhook', async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured' });
    }
    
    try {
      const sig = req.headers['stripe-signature'] as string;
      
      if (!process.env.STRIPE_WEBHOOK_SECRET || !sig) {
        return res.status(400).json({ message: 'Webhook secret not configured or signature missing' });
      }
      
      // Verify webhook
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      
      // Handle events
      if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          // We'll need to add this method to storage
          // await storage.updateVendorSubscriptionStatus(invoice.subscription.toString(), 'active');
        }
      } else if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object as Stripe.Subscription;
        // Update status
        // await storage.updateVendorSubscriptionStatus(subscription.id, subscription.status);
      } else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;
        // Mark as canceled
        // await storage.updateVendorSubscriptionStatus(subscription.id, 'canceled');
      }
      
      res.json({ received: true });
    } catch (error: any) {
      res.status(400).json({ message: `Webhook error: ${error.message}` });
    }
  });

  // Event opportunities routes
  app.get('/api/event-opportunities', async (req: Request, res: Response) => {
    try {
      const { userId, status, categoryId } = req.query;
      
      // TODO: Implement getEventOpportunities in storage
      const opportunities = []; // await storage.getEventOpportunities(userId ? parseInt(userId as string) : undefined);
      res.status(200).json(opportunities);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/event-opportunities/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // TODO: Implement getEventOpportunity in storage
      const opportunity = null; // await storage.getEventOpportunity(id);
      
      if (!opportunity) {
        return res.status(404).json({ message: 'Event opportunity not found' });
      }
      
      res.status(200).json(opportunity);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/event-opportunities', async (req: Request, res: Response) => {
    try {
      const validatedData = insertEventOpportunitySchema.parse(req.body);
      
      // TODO: Implement createEventOpportunity in storage
      const opportunity = validatedData; // await storage.createEventOpportunity(validatedData);
      
      // Send WhatsApp notifications to relevant vendors
      try {
        // This would be where we get vendors with WhatsApp numbers who should be notified
        const vendorsToNotify = []; // await storage.getVendorsForEventNotification(opportunity);
        
        if (vendorsToNotify.length > 0) {
          const eventDate = opportunity.eventDate 
            ? new Date(opportunity.eventDate).toLocaleDateString() 
            : 'TBD';
          
          // Get event planner name
          const eventPlanner = null; // await storage.getUser(opportunity.userId);
          const plannerName = eventPlanner?.fullName || 'An event planner';
          
          // Create application URL
          const eventUrl = `https://www.howzeventz.co.za/events/${opportunity.id}/apply`;
          
          // Send notifications (this will be skipped until we have Twilio credentials)
          await notifyVendorsAboutEvent(
            vendorsToNotify.map(v => v.whatsappNumber).filter(Boolean) as string[],
            opportunity.title,
            eventDate,
            opportunity.location,
            plannerName,
            eventUrl
          );
          
          // Mark opportunity as having notifications sent
          // await storage.updateEventNotificationStatus(opportunity.id, true);
        }
      } catch (whatsappError) {
        // Log WhatsApp error but don't fail the event creation
        console.error('Error sending WhatsApp notifications:', whatsappError);
      }
      
      res.status(201).json(opportunity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/event-opportunities/:id/status', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
      
      // TODO: Implement updateEventOpportunityStatus in storage
      const opportunity = null; // await storage.updateEventOpportunityStatus(id, status);
      
      if (!opportunity) {
        return res.status(404).json({ message: 'Event opportunity not found' });
      }
      
      res.status(200).json(opportunity);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/event-opportunities/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // TODO: Implement deleteEventOpportunity in storage
      // await storage.deleteEventOpportunity(id);
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Vendor applications routes
  app.get('/api/vendor-applications', async (req: Request, res: Response) => {
    try {
      const { opportunityId, vendorId, status } = req.query;
      
      // TODO: Implement getVendorApplications in storage
      const applications = []; // await storage.getVendorApplications({
      //   opportunityId: opportunityId ? parseInt(opportunityId as string) : undefined,
      //   vendorId: vendorId ? parseInt(vendorId as string) : undefined,
      //   status: status as string
      // });
      
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/vendor-applications', async (req: Request, res: Response) => {
    try {
      const validatedData = insertVendorApplicationSchema.parse(req.body);
      
      // TODO: Implement createVendorApplication in storage
      const application = validatedData; // await storage.createVendorApplication(validatedData);
      
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/vendor-applications/:id/status', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
      
      // TODO: Implement updateVendorApplicationStatus in storage
      const application = null; // await storage.updateVendorApplicationStatus(id, status);
      
      if (!application) {
        return res.status(404).json({ message: 'Vendor application not found' });
      }
      
      res.status(200).json(application);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Calendar routes
  app.get('/api/calendar-events', async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      
      const events = await storage.getCalendarEvents(parseInt(userId as string));
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/calendar-events', async (req: Request, res: Response) => {
    try {
      const validatedData = insertCalendarEventSchema.parse(req.body);
      const event = await storage.createCalendarEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/calendar-events/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getCalendarEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: 'Calendar event not found' });
      }
      
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/calendar-events/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCalendarEventSchema.partial().parse(req.body);
      const event = await storage.updateCalendarEvent(id, validatedData);
      res.status(200).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/calendar-events/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCalendarEvent(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Endpoint for vendors to mark days as fully booked
  app.post('/api/calendar/block-day', async (req: Request, res: Response) => {
    try {
      const { vendorId, date, description } = req.body;
      
      if (!vendorId || !date) {
        return res.status(400).json({ message: 'vendorId and date are required' });
      }
      
      // Check if vendor has premium or pro subscription
      const vendor = await storage.getVendor(vendorId);
      
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
      
      // Check if vendor has premium or pro subscription
      if (!['pro', 'platinum'].includes(vendor.subscriptionTier)) {
        return res.status(403).json({ 
          message: 'Feature only available for Pro and Premium Pro vendors',
          requiredTier: 'pro'
        });
      }
      
      // Convert date string to Date objects for the entire day
      const blockDate = new Date(date);
      const startDate = new Date(blockDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(blockDate);
      endDate.setHours(23, 59, 59, 999);
      
      // Create calendar event for blocked day
      const calendarEvent = await storage.createCalendarEvent({
        vendorId,
        title: 'Fully Booked',
        description: description || 'This day is marked as unavailable',
        startDate,
        endDate,
        allDay: true,
        type: 'block',
        color: '#FF0000', // Red color for blocked days
        status: 'confirmed'
      });
      
      res.status(201).json(calendarEvent);
    } catch (error) {
      console.error('Error blocking day in calendar:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Endpoint to get vendor availability for a specific period
  app.get('/api/calendar/availability/:vendorId', async (req: Request, res: Response) => {
    try {
      const vendorId = parseInt(req.params.vendorId);
      const { start, end } = req.query;
      
      if (!start || !end) {
        return res.status(400).json({ message: 'Start and end dates are required' });
      }
      
      console.log(`Calendar request for vendor ${vendorId} from ${start} to ${end}`);
      
      // Get the vendor first to verify it exists and has calendar enabled
      const vendor = await storage.getVendor(vendorId);
      
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
      
      if (!vendor.calendarView) {
        return res.status(403).json({ message: 'Calendar view not enabled for this vendor' });
      }
      
      // Get the vendor's calendar events for the specified period
      const events = await storage.getVendorCalendarEvents(
        vendorId, 
        new Date(start as string), 
        new Date(end as string)
      );
      
      console.log(`Found ${events.length} calendar events for vendor ${vendorId}`);
      
      // Get public holidays for the vendor's location (if available)
      let publicHolidays = [];
      
      if (vendor && vendor.location) {
        // Extract country code from location (assuming format like "Cape Town, ZA")
        const locationParts = vendor.location.split(',');
        if (locationParts.length > 1) {
          const countryCode = locationParts[locationParts.length - 1].trim();
          // Get public holidays for this country
          publicHolidays = await storage.getPublicHolidays(countryCode);
        }
      }
      
      // Return a correctly formatted response for the calendar component
      console.log(`Returning ${events.length} events and ${publicHolidays.length} holidays for calendar`);
      res.status(200).json({
        events,
        publicHolidays
      });
    } catch (error) {
      console.error('Error fetching vendor availability:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Messaging system routes
  app.get('/api/conversations', async (req: Request, res: Response) => {
    try {
      const { userId, role } = req.query;
      
      if (!userId || !role) {
        return res.status(400).json({ message: 'userId and role are required' });
      }
      
      const conversations = await storage.getUserConversations(
        parseInt(userId as string), 
        role as 'host' | 'provider'
      );
      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/conversations', async (req: Request, res: Response) => {
    try {
      const validatedData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(validatedData);
      res.status(201).json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/conversations/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
      
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/conversations/:id/archive', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await storage.updateConversationStatus(id, 'archived');
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/messages/:conversationId', async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const messages = await storage.getMessages(conversationId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/messages', async (req: Request, res: Response) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      
      // Update the last message timestamp on the conversation
      await storage.updateConversationLastMessage(validatedData.conversationId);
      
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/messages/mark-read', async (req: Request, res: Response) => {
    try {
      const { conversationId, userId } = req.body;
      
      if (!conversationId || !userId) {
        return res.status(400).json({ message: 'conversationId and userId are required' });
      }
      
      await storage.markMessagesAsRead(parseInt(conversationId), parseInt(userId));
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Vendor Profile Management Routes
  app.get('/api/vendors/me', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated?.()) {
        return res.status(401).json({ message: 'You must be logged in to access your vendor profile' });
      }
      
      // Get the vendor profile for the authenticated user
      // This assumes that the vendor ID matches the user ID
      const vendor = await storage.getVendor(req.user.id);
      
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor profile not found' });
      }
      
      res.json(vendor);
    } catch (error) {
      console.error('Error getting vendor profile:', error);
      res.status(500).json({ message: 'Server error', details: (error as Error).message });
    }
  });
  
  app.patch('/api/vendors/me', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated?.()) {
        return res.status(401).json({ message: 'You must be logged in to update your vendor profile' });
      }
      
      const vendor = await storage.getVendor(req.user.id);
      
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor profile not found' });
      }
      
      // Validate allowed fields based on subscription tier
      // For example, check word count limits
      if (req.body.description) {
        const wordCount = req.body.description.split(/\s+/).length;
        let maxWords = 300; // Default for free tier
        
        if (vendor.subscriptionTier === 'pro') {
          maxWords = 1000;
        } else if (vendor.subscriptionTier === 'premium') {
          maxWords = 3000;
        }
        
        if (wordCount > maxWords) {
          return res.status(400).json({ 
            message: `Description exceeds word limit. Your subscription allows ${maxWords} words maximum.` 
          });
        }
      }
      
      // Update the vendor profile
      const updatedVendor = await storage.updateVendor(req.user.id, req.body);
      
      res.json(updatedVendor);
    } catch (error) {
      console.error('Error updating vendor profile:', error);
      res.status(500).json({ message: 'Server error', details: (error as Error).message });
    }
  });
  
  // File upload middleware
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.resolve(process.cwd(), 'uploads');
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        // Create a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
      // Accept only images
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed') as any);
      }
    }
  });
  
  // Upload profile image
  app.post('/api/vendors/me/profile-image', upload.single('profileImage'), async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated?.()) {
        return res.status(401).json({ message: 'You must be logged in to upload a profile image' });
      }
      
      const vendor = await storage.getVendor(req.user.id);
      
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor profile not found' });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
      }
      
      // Get the file path
      const filePath = req.file.path;
      
      // For a real production app, you would upload this to a cloud storage service
      // For this example, we'll use a relative path to access the file
      const imageUrl = `/uploads/${path.basename(filePath)}`;
      
      // Update the vendor's profile image
      const updatedVendor = await storage.updateVendor(req.user.id, { imageUrl });
      
      res.json(updatedVendor);
    } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({ message: 'Failed to upload profile image', details: (error as Error).message });
    }
  });
  
  // Upload logo
  app.post('/api/vendors/me/logo', upload.single('logoImage'), async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated?.()) {
        return res.status(401).json({ message: 'You must be logged in to upload a logo' });
      }
      
      const vendor = await storage.getVendor(req.user.id);
      
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor profile not found' });
      }
      
      // Check subscription tier - only Pro and Premium can upload logos
      if (vendor.subscriptionTier === 'free') {
        return res.status(403).json({ 
          message: 'Logo upload is only available for Pro and Premium subscribers.'
        });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
      }
      
      // Get the file path
      const filePath = req.file.path;
      
      // For a real production app, you would upload this to a cloud storage service
      // For this example, we'll use a relative path to access the file
      const logoUrl = `/uploads/${path.basename(filePath)}`;
      
      // Update the vendor's logo
      const updatedVendor = await storage.updateVendor(req.user.id, { logoUrl });
      
      res.json(updatedVendor);
    } catch (error) {
      console.error('Error uploading logo:', error);
      res.status(500).json({ message: 'Failed to upload logo', details: (error as Error).message });
    }
  });
  
  // Create or update catalog items
  app.post('/api/vendors/me/catalog', upload.single('itemImage'), async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated?.()) {
        return res.status(401).json({ message: 'You must be logged in to manage catalog items' });
      }
      
      const vendor = await storage.getVendor(req.user.id);
      
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor profile not found' });
      }
      
      // Parse the catalog item data from the request
      const { 
        itemId, 
        name, 
        price, 
        description, 
        category, 
        inStock, 
        featured 
      } = req.body;
      
      // Check subscription limits
      let maxItems = 10; // Default for free tier
      
      if (vendor.subscriptionTier === 'pro') {
        maxItems = 25;
      } else if (vendor.subscriptionTier === 'premium') {
        maxItems = 100;
      }
      
      // Get current catalog items
      const currentItems = vendor.catalogItems || [];
      
      // Check if we're adding a new item and if we're at the limit
      if (!itemId && currentItems.length >= maxItems) {
        return res.status(400).json({ 
          message: `Your subscription allows a maximum of ${maxItems} catalog items.`
        });
      }
      
      let imageUrl = '';
      
      // If a file was uploaded, process it
      if (req.file) {
        imageUrl = `/uploads/${path.basename(req.file.path)}`;
      } else if (req.body.imageUrl) {
        // Use existing image URL if provided and no new file uploaded
        imageUrl = req.body.imageUrl;
      }
      
      let updatedItems = [...currentItems];
      
      if (itemId) {
        // Update existing item
        updatedItems = updatedItems.map(item => 
          item.id === itemId ? {
            ...item,
            name: name || item.name,
            price: price || item.price,
            description: description !== undefined ? description : item.description,
            category: category !== undefined ? category : item.category,
            inStock: inStock !== undefined ? (inStock === 'true' || inStock === true) : item.inStock,
            featured: featured !== undefined ? (featured === 'true' || featured === true) : item.featured,
            imageUrl: imageUrl || item.imageUrl,
            updatedAt: new Date()
          } : item
        );
      } else {
        // Add new item
        const newItem = {
          id: `item_${Date.now()}`,
          name,
          description: description || '',
          imageUrl,
          price,
          category: category || 'General',
          inStock: inStock !== undefined ? (inStock === 'true' || inStock === true) : true,
          featured: featured !== undefined ? (featured === 'true' || featured === true) : false,
          sortOrder: currentItems.length,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        updatedItems.push(newItem);
      }
      
      // Update the vendor with the new catalog items
      const updatedVendor = await storage.updateVendor(req.user.id, { 
        catalogItems: updatedItems 
      });
      
      res.json(updatedVendor);
    } catch (error) {
      console.error('Error managing catalog item:', error);
      res.status(500).json({ message: 'Failed to manage catalog item', details: (error as Error).message });
    }
  });
  
  // Delete catalog item
  app.delete('/api/vendors/me/catalog/:itemId', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated?.()) {
        return res.status(401).json({ message: 'You must be logged in to delete catalog items' });
      }
      
      const vendor = await storage.getVendor(req.user.id);
      
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor profile not found' });
      }
      
      const itemId = req.params.itemId;
      const currentItems = vendor.catalogItems || [];
      
      // Filter out the item to delete
      const updatedItems = currentItems.filter(item => item.id !== itemId);
      
      // If the items are the same length, the item wasn't found
      if (updatedItems.length === currentItems.length) {
        return res.status(404).json({ message: 'Catalog item not found' });
      }
      
      // Update the vendor with the new catalog items
      const updatedVendor = await storage.updateVendor(req.user.id, { 
        catalogItems: updatedItems 
      });
      
      res.json(updatedVendor);
    } catch (error) {
      console.error('Error deleting catalog item:', error);
      res.status(500).json({ message: 'Failed to delete catalog item', details: (error as Error).message });
    }
  });
  
  // Upload additional images
  app.post('/api/vendors/me/additional-images', upload.array('additionalImage', 100), async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated?.()) {
        return res.status(401).json({ message: 'You must be logged in to upload additional images' });
      }
      
      const vendor = await storage.getVendor(req.user.id);
      
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor profile not found' });
      }
      
      // Check subscription limits
      let maxPhotos = 10; // Default for free tier
      
      if (vendor.subscriptionTier === 'pro') {
        maxPhotos = 30;
      } else if (vendor.subscriptionTier === 'premium') {
        maxPhotos = 100;
      }
      
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: 'No image files uploaded' });
      }
      
      // Calculate total images (existing + new)
      const existingPhotos = vendor.additionalPhotos ? vendor.additionalPhotos.length : 0;
      const totalPhotos = existingPhotos + req.files.length;
      
      if (totalPhotos > maxPhotos) {
        return res.status(400).json({ 
          message: `Your subscription allows ${maxPhotos} photos maximum. You already have ${existingPhotos}.`
        });
      }
      
      // Get the file paths
      const newPhotos = Array.isArray(req.files) 
        ? req.files.map(file => `/uploads/${path.basename(file.path)}`) 
        : [];
      
      // Combine with existing photos
      const additionalPhotos = [...(vendor.additionalPhotos || []), ...newPhotos];
      
      // Update the vendor's additional photos
      const updatedVendor = await storage.updateVendor(req.user.id, { additionalPhotos });
      
      res.json(updatedVendor);
    } catch (error) {
      console.error('Error uploading additional images:', error);
      res.status(500).json({ message: 'Failed to upload additional images', details: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
