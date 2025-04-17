import { db } from '../server/db';
import { categories, vendors } from '../shared/schema';

async function addNewCategories() {
  console.log('Adding new categories...');
  
  // Add new categories
  await db.insert(categories).values([
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
    }
  ]);

  console.log('Adding new vendors...');
  
  // Add some vendors for the new categories
  await db.insert(vendors).values([
    {
      name: "Bounce Castle Adventures",
      description: "Colorful jumping castles of various themes and sizes for children's entertainment at any event.",
      imageUrl: "https://images.unsplash.com/photo-1560420025-9453f02b4751?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 11, // Children's Entertainment
      priceRange: "$$",
      rating: 4.7,
      reviewCount: 68,
      subscriptionTier: "basic",
      subscriptionStatus: "active",
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
      priceRange: "$$",
      rating: 4.9,
      reviewCount: 42,
      subscriptionTier: "pro",
      subscriptionStatus: "active",
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
      priceRange: "$$$",
      rating: 4.8,
      reviewCount: 37,
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Cape Town, South Africa"
    },
    {
      name: "Premier Wait Staff",
      description: "Professional servers, bartenders, and wait staff for events of all sizes with impeccable service.",
      imageUrl: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId: 13, // Event Staff
      priceRange: "$$",
      rating: 4.7,
      reviewCount: 53,
      subscriptionTier: "basic",
      subscriptionStatus: "active",
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
      priceRange: "$$",
      rating: 4.8,
      reviewCount: 47,
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      instagramUrl: "https://instagram.com/",
      websiteUrl: "https://example.com/",
      whatsappNumber: "+1234567890",
      location: "Cape Town, South Africa"
    }
  ]);

  console.log('New categories and vendors added successfully!');
}

addNewCategories().catch(err => {
  console.error('Error adding new categories:', err);
});