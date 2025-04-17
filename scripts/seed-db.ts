import { db } from '../server/db';
import { 
  categories, vendors, users, tasks, timelineEvents, shortlists
} from '../shared/schema';

async function seedDatabase() {
  console.log('Seeding database...');

  // Add categories
  console.log('Adding categories...');
  await db.insert(categories).values([
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
  ]);

  // Add vendors
  console.log('Adding vendors...');
  await db.insert(vendors).values([
    {
      name: "Rose Garden Hall",
      description: "Elegant garden venue with indoor and outdoor spaces, perfect for ceremonies and receptions up to 300 guests.",
      imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 1, // Venues
      priceRange: "$$",
      rating: 4.5,
      reviewCount: 48,
      subscriptionTier: "free",
      subscriptionStatus: "inactive",
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Cape Town, South Africa"
    },
    {
      name: "Sweet Delights Bakery",
      description: "Award-winning cake designer specializing in custom wedding cakes, cupcakes, and dessert tables for your special day.",
      imageUrl: "https://images.unsplash.com/photo-1547059470-3b0c7cd958a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 2, // Catering & Bakers
      priceRange: "$$$",
      rating: 5.0,
      reviewCount: 72,
      subscriptionTier: "basic",
      subscriptionStatus: "active",
      cataloguePages: 2,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Johannesburg, South Africa"
    },
    {
      name: "Glamour Bridal Studio",
      description: "Professional hair and makeup team specializing in bridal styling, with services for the entire bridal party.",
      imageUrl: "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 3, // Hair & Makeup
      priceRange: "$$",
      rating: 4.0,
      reviewCount: 36,
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      cataloguePages: 6,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      facebookUrl: "https://facebook.com/",
      twitterUrl: "https://twitter.com/",
      googleMapsLink: "https://maps.google.com/",
      location: "Durban, South Africa"
    },
    {
      name: "Highland Manor",
      description: "Country estate with gardens and lake views, accommodating up to 200 guests.",
      imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 1, // Venues
      priceRange: "$$$",
      rating: 4.5,
      reviewCount: 42,
      subscriptionTier: "free",
      subscriptionStatus: "inactive",
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Pretoria, South Africa"
    },
    {
      name: "Gourmet Catering Co",
      description: "Custom menus with international cuisine options and professional service staff.",
      imageUrl: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 2, // Catering & Bakers
      priceRange: "$$$",
      rating: 5.0,
      reviewCount: 63,
      subscriptionTier: "basic",
      subscriptionStatus: "active",
      cataloguePages: 2,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Cape Town, South Africa"
    },
    {
      name: "Floral Fantasy",
      description: "Stunning floral arrangements, bouquets, and venue decoration services.",
      imageUrl: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 6, // Decor & Design
      priceRange: "$$",
      rating: 4.0,
      reviewCount: 37,
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      cataloguePages: 6,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      facebookUrl: "https://facebook.com/",
      twitterUrl: "https://twitter.com/",
      googleMapsLink: "https://maps.google.com/",
      location: "Johannesburg, South Africa"
    },
    {
      name: "Melody Makers",
      description: "Live band with customizable setlists and DJ services for your reception.",
      imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b3ce551?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 8, // Entertainment
      priceRange: "$$$",
      rating: 5.0,
      reviewCount: 51,
      subscriptionTier: "free",
      subscriptionStatus: "inactive",
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Durban, South Africa"
    },
    {
      name: "Gourmet Food Stalls",
      description: "Authentic food stalls offering a variety of international cuisines for markets and events.",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 9, // Market Vendors
      priceRange: "$",
      rating: 4.8,
      reviewCount: 56,
      subscriptionTier: "basic",
      subscriptionStatus: "active",
      cataloguePages: 2,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Port Elizabeth, South Africa"
    },
    {
      name: "Spring Festival Applications",
      description: "Vendor applications now open for the Annual Spring Festival. Limited spots available.",
      imageUrl: "https://images.unsplash.com/photo-1529586691389-4aaa1f44e8ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 10, // Vendor Opportunities
      priceRange: "$",
      rating: 4.9,
      reviewCount: 124,
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      cataloguePages: 6,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      facebookUrl: "https://facebook.com/",
      twitterUrl: "https://twitter.com/",
      googleMapsLink: "https://maps.google.com/",
      location: "Cape Town, South Africa"
    }
  ]);

  // Add a demo user
  console.log('Adding a demo user...');
  await db.insert(users).values({
    username: "demo",
    password: "password",
    email: "demo@eventza.co.za",
    fullName: "Demo User",
    role: "user"
  });

  console.log('Database seeding complete!');
}

seedDatabase().catch(console.error);