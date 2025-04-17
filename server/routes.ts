import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertShortlistSchema, 
  insertTaskSchema, 
  insertTimelineEventSchema 
} from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);
  return httpServer;
}
