import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
  insertSeoPackageSchema
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
      const { category, search } = req.query;
      let vendors;
      
      if (search) {
        const categoryId = category ? parseInt(category as string) : undefined;
        vendors = await storage.searchVendors(search as string, categoryId);
      } else if (category) {
        vendors = await storage.getVendorsByCategory(parseInt(category as string));
      } else {
        vendors = await storage.getVendors();
      }
      
      res.status(200).json(vendors);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
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

  const httpServer = createServer(app);
  return httpServer;
}
