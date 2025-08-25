import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Vendor, Category } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { MapPin, Globe, Instagram, MessageSquare, Phone, Calendar, Map, Star, Mail } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import StarRating from "../ui/star-rating";
import { LikeButton } from "./ShortlistButton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Reviews from "./Reviews";
import { VendorCatalog } from "./VendorCatalog";
import { RatingReviews } from "./RatingReviews";
import { ImageViewer } from "../ui/image-viewer";
import { PhotoGallery } from "./PhotoGallery";

interface VendorDetailProps {
  vendorId: number;
}

export function VendorDetail({ vendorId }: VendorDetailProps) {
  const { data: vendor, isLoading: vendorLoading } = useQuery<Vendor>({
    queryKey: ['vendor-detail', vendorId],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${vendorId}`);
      if (!response.ok) throw new Error('Failed to fetch vendor');
      return response.json();
    },
    enabled: vendorId > 0,
  });

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: ['category-detail', vendor?.categoryId],
    queryFn: async () => {
      if (!vendor?.categoryId) throw new Error('No category ID');
      const response = await fetch(`/api/categories/${vendor.categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch category');
      return response.json();
    },
    enabled: !!vendor && !!vendor.categoryId,
  });

  // Fetch more vendors for continuous list
  const { data: moreVendors = [], isLoading: moreVendorsLoading } = useQuery<Vendor[]>({
    queryKey: ['more-vendors', vendorId],
    queryFn: async () => {
      const response = await fetch(`/api/vendors?limit=12`);
      if (!response.ok) throw new Error('Failed to fetch vendors');
      const allVendors = await response.json();
      // Filter out the current vendor and return the rest
      return allVendors.filter((v: Vendor) => v.id !== vendorId);
    },
    enabled: vendorId > 0,
  });

  // Temporary hard-coded user ID for demos (will be replaced with actual auth)
  const userId = 1;

  if (vendorLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
        <div className="mt-8">
          <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-6"></div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return <div className="text-center py-10">Vendor not found</div>;
  }

  // Check if vendor subscription allows reviews (premium or premium pro)
  const hasReviewFeature = vendor.subscriptionTier === 'premium' || vendor.subscriptionTier === 'premium pro';

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-display font-bold">{vendor.name}</h1>
            {category && (
              <div className="category-badge">
                {category.name}
              </div>
            )}
            {vendor.subscriptionTier === 'premium' && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Premium Vendor
              </div>
            )}
            {vendor.subscriptionTier === 'premium pro' && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-300 to-amber-500 text-amber-900">
                Premium Pro
              </div>
            )}
          </div>
          <LikeButton vendorId={vendor.id} className="bg-white border shadow-sm hover:bg-accent" />
        </div>
        
        {vendor.location && (
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{vendor.location}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <StarRating 
            rating={vendor.rating} 
            reviewCount={vendor.reviewCount} 
            size="md"
            showText 
          />
          <Link href={`/vendors/${vendor.id}/review`}>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Star className="mr-1 h-4 w-4" />
              Rate & Review
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        <PhotoGallery 
          mainImage={vendor.imageUrl}
          additionalPhotos={vendor.additionalPhotos || []}
          vendorName={vendor.name}
        />
      </div>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="rating-reviews">Reviews</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          {hasReviewFeature && (
            <TabsTrigger value="reviews">
              Reviews ({vendor.reviewCount || 0})
            </TabsTrigger>
          )}
        </TabsList>

            <TabsContent value="about">
              <div>
                <h2 className="font-display text-xl font-semibold mb-4">About {vendor.name}</h2>
                <p className="text-muted-foreground mb-6">{vendor.description}</p>
                
                <div className="grid grid-cols-1 gap-6 mt-8">
                  {/* Location and Map Section */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {vendor.location && (
                        <div className="mb-4">
                          <p className="text-muted-foreground font-medium">{vendor.location}</p>
                        </div>
                      )}
                      
                      {vendor.googleMapsLink ? (
                        <div className="w-full h-64 rounded-lg overflow-hidden border">
                          <iframe
                            src={vendor.googleMapsLink}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`${vendor.name} Location`}
                          ></iframe>
                        </div>
                      ) : vendor.location && (
                        <div className="w-full h-64 rounded-lg overflow-hidden border">
                          <iframe
                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO5A4l8aSp1t2k&q=${encodeURIComponent(vendor.location)}`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`${vendor.name} Location`}
                          ></iframe>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {vendor.dietaryOptions && vendor.dietaryOptions.length > 0 && (
                          <li>Dietary options: {vendor.dietaryOptions.join(', ')}</li>
                        )}
                        {vendor.cuisineTypes && vendor.cuisineTypes.length > 0 && (
                          <li>Cuisine types: {vendor.cuisineTypes.join(', ')}</li>
                        )}
                        <li>Event types: Weddings, Corporate, Private celebrations</li>
                        <li>Available year-round</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="catalog">
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-semibold mb-4">View Catalogue</h2>
                  <VendorCatalog vendorId={vendorId} />
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-display text-lg font-semibold mb-4">Quote Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      className="w-full bg-primary text-white hover:bg-primary/90"
                      size="lg"
                    >
                      Request Quote
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary/10"
                      size="lg"
                    >
                      Amend Quote
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rating-reviews">
              <RatingReviews vendorId={vendorId} vendorName={vendor.name} />
            </TabsContent>

            <TabsContent value="calendar">
              <div>
                <h2 className="font-display text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Availability Calendar
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Check Availability</h3>
                      <p className="text-muted-foreground mb-4">
                        View real-time availability and book directly with {vendor.name}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <Card className="border-green-200 bg-green-50">
                          <CardContent className="p-4 text-center">
                            <div className="text-green-600 font-semibold mb-2">Available Dates</div>
                            <p className="text-sm text-green-700">Contact to confirm specific dates and pricing</p>
                          </CardContent>
                        </Card>
                        <Card className="border-red-200 bg-red-50">
                          <CardContent className="p-4 text-center">
                            <div className="text-red-600 font-semibold mb-2">Booking Notice</div>
                            <p className="text-sm text-red-700">Popular dates require advance booking</p>
                          </CardContent>
                        </Card>
                      </div>
                      <Button className="mt-6" size="lg">
                        <Calendar className="h-4 w-4 mr-2" />
                        Contact for Availability
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {hasReviewFeature && (
              <TabsContent value="reviews">
                <Reviews vendorId={vendorId} userId={userId} vendor={vendor} />
              </TabsContent>
            )}
      </Tabs>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
        </div>
        
        <div className="md:w-1/3">
          <Card>
            <CardContent className="space-y-4">
              {vendor.whatsappNumber && (
                <a 
                  href={`https://wa.me/${vendor.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  className="flex w-full bg-green-500 text-white justify-center py-3 rounded-md hover:bg-green-600 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contact via WhatsApp
                </a>
              )}
              
              {vendor.email && (
                <a 
                  href={`mailto:${vendor.email}`}
                  className="flex w-full bg-blue-500 text-white justify-center py-3 rounded-md hover:bg-blue-600 transition"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contact via Email
                </a>
              )}
              
              
              <Separator className="my-4" />
              
              <div className="text-sm text-muted-foreground">
                <p>Tell them you found them on HowzEventz!</p>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>

      {/* Similar Vendors Section */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">More Vendors</h2>
          <p className="text-muted-foreground">Continue browsing</p>
        </div>
        

        {moreVendorsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : moreVendors.length > 0 ? (
          <div className="space-y-4">
            {moreVendors.map((vendor) => (
              <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="flex flex-row">
                  {/* Left side - Image */}
                  <div className="relative w-1/3 overflow-hidden">
                    <div className="h-full w-full">
                      <ImageViewer
                        imageUrl={vendor.imageUrl}
                        alt={vendor.name}
                        className="h-full w-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
                        fallbackUrl="https://placehold.co/300x200?text=No+Image"
                      />
                    </div>
                    
                    {vendor.subscriptionTier === 'premium' && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground z-10 text-xs px-2 py-0.5 rounded">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  {/* Right side - Content */}
                  <CardContent className="flex-grow p-3 w-2/3">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-base tracking-tight">{vendor.name}</h3>
                      <div className="flex items-center bg-primary/10 px-2 py-0.5 rounded text-xs">
                        <div className="h-3 w-3 mr-1 text-primary">★</div>
                        <span className="font-medium">{vendor.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground text-xs ml-1">({vendor.reviewCount})</span>
                      </div>
                    </div>
                    
                    {vendor.logoUrl && (
                      <div className="float-right ml-2 mb-1 bg-white rounded-full p-0.5 shadow-sm">
                        <ImageViewer
                          imageUrl={vendor.logoUrl}
                          alt={`${vendor.name} logo`}
                          className="h-8 w-8 object-contain rounded-full"
                          fallbackUrl="https://placehold.co/100x100?text=Logo"
                        />
                      </div>
                    )}
                    
                    <p className="text-muted-foreground text-xs mb-2 line-clamp-4">
                      {vendor.description.length > 150 ? `${vendor.description.slice(0, 150).trim()}...` : vendor.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      {vendor.location && (
                        <div className="text-xs py-0 px-1.5 h-5 border border-gray-300 rounded bg-white">
                          {vendor.location}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
                
                <div className="p-3 pt-0">
                  <button 
                    className="w-full inline-flex justify-center py-1.5 px-3 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors"
                    onClick={() => {
                      window.location.href = `/vendors/${vendor.id}`;
                    }}
                  >
                    View Details
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No similar vendors found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
