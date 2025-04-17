import { db } from '../server/db';
import { vendors } from '../shared/schema';

async function addMarketingVendors() {
  console.log('Adding vendors for Marketing Materials & Invitations category...');
  
  // The category ID is 21 as we confirmed with our previous check
  const categoryId = 21;
  
  // Add vendors for this category
  await db.insert(vendors).values([
    {
      name: "Branded Spaces",
      description: "Custom branded gazebos, banners, and pop-up displays for exhibitions, markets, and outdoor events.",
      imageUrl: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId,
      priceRange: "$$$",
      rating: 4.8,
      reviewCount: 42,
      subscriptionTier: "pro_platinum",
      subscriptionStatus: "active",
      instagramUrl: "https://instagram.com/brandedspaces",
      websiteUrl: "https://brandedspaces.co.za",
      whatsappNumber: "+27815554321",
      location: "Johannesburg, South Africa"
    },
    {
      name: "Event Invitations & Design",
      description: "Custom digital and printed invitations, event programs, and promotional materials design services.",
      imageUrl: "https://images.unsplash.com/photo-1543248939-ff40856f65d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId,
      priceRange: "$$",
      rating: 4.9,
      reviewCount: 38,
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      instagramUrl: "https://instagram.com/eventinvitationsdesign",
      websiteUrl: "https://eventinvitations.co.za",
      whatsappNumber: "+27825556789",
      location: "Cape Town, South Africa"
    },
    {
      name: "PrintPro Marketing",
      description: "High-quality printing services for event banners, posters, flyers, stickers, and branded giveaways.",
      imageUrl: "https://images.unsplash.com/photo-1636633762833-5d1658f1e29b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId,
      priceRange: "$$",
      rating: 4.7,
      reviewCount: 53,
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      instagramUrl: "https://instagram.com/printpromarketing",
      websiteUrl: "https://printpro.co.za",
      whatsappNumber: "+27835557890",
      location: "Pretoria, South Africa"
    },
    {
      name: "SignWorks Display Solutions",
      description: "Event signage, directional signs, advertising boards, and large format printing for events of all types.",
      imageUrl: "https://images.unsplash.com/photo-1613294326794-e47d58651fb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      categoryId,
      priceRange: "$$$",
      rating: 4.6,
      reviewCount: 31,
      subscriptionTier: "basic",
      subscriptionStatus: "active",
      instagramUrl: "https://instagram.com/signworks",
      websiteUrl: "https://signworks.co.za",
      whatsappNumber: "+27845551234",
      location: "Durban, South Africa"
    }
  ]);

  console.log('Marketing Materials & Invitations vendors added successfully!');
}

addMarketingVendors().catch(err => {
  console.error('Error adding marketing vendors:', err);
});