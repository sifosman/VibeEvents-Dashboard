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
      name: "Children's Entertainment",
      description: "Jumping Castles, Face Painters & Magicians",
      imageUrl: "https://images.unsplash.com/photo-1477901789551-39e3bf90d848?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      slug: "childrens-entertainment"
    },
    {
      name: "Specialty Performers",
      description: "Comedians, Acrobats & Live Acts",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      slug: "specialty-performers"
    },
    {
      name: "Event Staff",
      description: "Barristers, Servers & Wait Staff",
      imageUrl: "https://images.unsplash.com/photo-1587316505523-263a6d54f5b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      slug: "event-staff"
    },
    {
      name: "Event Support Crew",
      description: "Setup, Cleanup & Technical Crews",
      imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      slug: "event-support-crew"
    },
    {
      name: "Influencers & Social Media",
      description: "Content Creators & Event Promotion",
      imageUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      slug: "influencers-social-media"
    },
    {
      name: "Event Hosts & MCs",
      description: "Professional Hosts & Announcers",
      imageUrl: "https://images.unsplash.com/photo-1560439514-e960a3ef5019?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      slug: "event-hosts-mcs"
    },
    {
      name: "Sports & Recreational",
      description: "Sports Entertainers & Game Equipment",
      imageUrl: "https://images.unsplash.com/photo-1526232836161-30dcca643052?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      slug: "sports-recreational"
    },
    {
      name: "Cultural Performers",
      description: "Traditional Dancers & Cultural Entertainers",
      imageUrl: "https://images.unsplash.com/photo-1527522883525-97e1a9ad7a5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      slug: "cultural-performers"
    },
    {
      name: "Security Services",
      description: "Event Security & Access Control",
      imageUrl: "https://images.unsplash.com/photo-1629117241053-48e55b8f4cf3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      slug: "security-services"
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
      priceRange: "RR",
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
      priceRange: "RRR",
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
      priceRange: "RR",
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
      priceRange: "RRR",
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
      priceRange: "RRR",
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
      priceRange: "RR",
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
      priceRange: "RRR",
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
      priceRange: "R",
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
      priceRange: "R",
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
    },
    {
      name: "Bounce Castle Adventures",
      description: "Colorful jumping castles of various themes and sizes for children's entertainment at any event.",
      imageUrl: "https://images.unsplash.com/photo-1560420025-9453f02b4751?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 11, // Children's Entertainment
      priceRange: "RR",
      rating: 4.7,
      reviewCount: 68,
      subscriptionTier: "basic",
      subscriptionStatus: "active",
      cataloguePages: 2,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Johannesburg, South Africa"
    },
    {
      name: "Magic Mike's Wonder Shows",
      description: "Professional magician specializing in children's parties and family-friendly entertainment.",
      imageUrl: "https://images.unsplash.com/photo-1528495612343-9ca9f4a9f67c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 11, // Children's Entertainment
      priceRange: "RR",
      rating: 4.9,
      reviewCount: 42,
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      cataloguePages: 6,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Pretoria, South Africa"
    },
    {
      name: "Laughter Factory Comedy",
      description: "Stand-up comedians providing clean, audience-appropriate humor for corporate and private events.",
      imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 12, // Specialty Performers
      priceRange: "RRR",
      rating: 4.8,
      reviewCount: 37,
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      cataloguePages: 6,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Cape Town, South Africa"
    },
    {
      name: "Cirque Dreams Performances",
      description: "Professional acrobats, aerialists, and circus performers for spectacular event highlights.",
      imageUrl: "https://images.unsplash.com/photo-1605143185599-33a290154a54?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 12, // Specialty Performers
      priceRange: "RRR",
      rating: 4.9,
      reviewCount: 28,
      subscriptionTier: "platinum",
      subscriptionStatus: "active",
      cataloguePages: 10,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Durban, South Africa"
    },
    {
      name: "Premier Wait Staff",
      description: "Professional servers, bartenders, and wait staff for events of all sizes with impeccable service.",
      imageUrl: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 13, // Event Staff
      priceRange: "RR",
      rating: 4.7,
      reviewCount: 53,
      subscriptionTier: "basic",
      subscriptionStatus: "active",
      cataloguePages: 2,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Johannesburg, South Africa"
    },
    {
      name: "Event Setup Pros",
      description: "Experienced crew specializing in event setup, breakdown, and technical support for any venue.",
      imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 14, // Event Support Crew
      priceRange: "RR",
      rating: 4.6,
      reviewCount: 41,
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      cataloguePages: 6,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Cape Town, South Africa"
    },
    {
      name: "Social Media Impact",
      description: "Influencers and content creators who can promote your event and create compelling content.",
      imageUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 15, // Influencers & Social Media
      priceRange: "RRR",
      rating: 4.5,
      reviewCount: 32,
      subscriptionTier: "platinum",
      subscriptionStatus: "active",
      cataloguePages: 10,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Johannesburg, South Africa"
    },
    {
      name: "Master of Ceremonies Pro",
      description: "Engaging and professional MCs to host your events, maintain the schedule, and entertain your guests.",
      imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 16, // Event Hosts & MCs
      priceRange: "RR",
      rating: 4.8,
      reviewCount: 47,
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      cataloguePages: 6,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Cape Town, South Africa"
    },
    {
      name: "Traditional Dance Troupe",
      description: "Authentic cultural dances from various South African traditions to add cultural richness to your event.",
      imageUrl: "https://images.unsplash.com/photo-1504699570374-9bbddda0b29a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 18, // Cultural Performers
      priceRange: "RR",
      rating: 4.9,
      reviewCount: 56,
      subscriptionTier: "basic",
      subscriptionStatus: "active",
      cataloguePages: 2,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Durban, South Africa"
    },
    {
      name: "Guardian Security Services",
      description: "Professional security personnel for events, VIP protection, and crowd management with certified staff.",
      imageUrl: "https://images.unsplash.com/photo-1617895153857-82fe79adfcd4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 19, // Security Services
      priceRange: "RRR",
      rating: 4.7,
      reviewCount: 38,
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      cataloguePages: 6,
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Johannesburg, South Africa"
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