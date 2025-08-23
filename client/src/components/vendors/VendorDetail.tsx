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
import { MapPin, Globe, Instagram, MessageSquare, Phone, Calendar, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import StarRating from "../ui/star-rating";
import { LikeButton } from "./ShortlistButton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Reviews from "./Reviews";
import { VendorCatalog } from "./VendorCatalog";
import { ImageViewer } from "../ui/image-viewer";

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

  // Fetch similar vendors in the same category
  const { data: similarVendors = [], isLoading: similarVendorsLoading } = useQuery<Vendor[]>({
    queryKey: ['similar-vendors', vendor?.categoryId, vendorId],
    queryFn: async () => {
      if (!vendor?.categoryId) return [];
      const response = await fetch(`/api/vendors?categoryId=${vendor.categoryId}&limit=8`);
      if (!response.ok) throw new Error('Failed to fetch similar vendors');
      const allVendors = await response.json();
      // Filter out the current vendor and limit to 4 vendors
      return allVendors.filter((v: Vendor) => v.id !== vendorId).slice(0, 4);
    },
    enabled: !!vendor?.categoryId && vendorId > 0,
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
      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
        <ImageViewer 
          imageUrl={vendor.imageUrl} 
          alt={`${vendor.name} Banner Image`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute top-4 right-4">
          <LikeButton vendorId={vendor.id} className="bg-white bg-opacity-90 hover:bg-opacity-100" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">{vendor.name}</h1>
              {category && (
                <div className="category-badge inline-block">
                  {category.name}
                </div>
              )}
              {vendor.subscriptionTier === 'premium' && (
                <div className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Premium Vendor
                </div>
              )}
              {vendor.subscriptionTier === 'premium pro' && (
                <div className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-300 to-amber-500 text-amber-900">
                  Premium Pro
                </div>
              )}
              {vendor.location && (
                <div className="flex items-center mt-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{vendor.location}</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="price-badge text-base mb-2">
                {vendor.priceRange}
              </div>
              <StarRating 
                rating={vendor.rating} 
                reviewCount={vendor.reviewCount} 
                size="md"
                showText 
              />
            </div>
          </div>

          <Separator className="my-6" />

          <Tabs defaultValue="about" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="catalog">Catalog</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">Availability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">Contact for availability details</p>
                      <p className="text-sm">Popular dates book quickly - reach out early!</p>
                      <Button 
                        className="mt-4 w-full" 
                        variant="outline" 
                        onClick={() => {
                          const catalogTab = document.querySelector('[data-value="catalog"]') as HTMLElement;
                          if (catalogTab) catalogTab.click();
                        }}
                      >
                        View Catalog
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services">
              <div>
                <h2 className="font-display text-xl font-semibold mb-4">Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">Standard Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Full service event planning</li>
                        <li>Day-of coordination</li>
                        <li>Custom event design</li>
                        <li>Vendor management</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">Add-on Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Guest management</li>
                        <li>Budget tracking</li>
                        <li>Custom timeline creation</li>
                        <li>On-site management</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Service Area</h3>
                  <p className="text-muted-foreground">
                    Primarily serving the greater Cape Town area. Available for destination events with additional travel fees.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="catalog">
              <VendorCatalog vendorId={vendorId} />
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

            <TabsContent value="map">
              <div>
                <h2 className="font-display text-xl font-semibold mb-4 flex items-center">
                  <Map className="h-5 w-5 mr-2" />
                  Location & Service Area
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          Primary Location
                        </h3>
                        <div className="bg-gray-100 rounded-lg p-4">
                          <p className="font-medium">{vendor.location || 'Cape Town, South Africa'}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Main service area with no additional travel fees
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Service Coverage</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border-blue-200 bg-blue-50">
                            <CardContent className="p-4">
                              <div className="text-blue-600 font-semibold mb-2">Local Service Area</div>
                              <p className="text-sm text-blue-700">
                                Greater Cape Town metropolitan area
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="border-orange-200 bg-orange-50">
                            <CardContent className="p-4">
                              <div className="text-orange-600 font-semibold mb-2">Extended Coverage</div>
                              <p className="text-sm text-orange-700">
                                Destination events with travel fees
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Travel Policy</h4>
                            <p className="text-sm text-muted-foreground">
                              Additional fees may apply for events outside primary service area
                            </p>
                          </div>
                          <Button variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Discuss Location
                          </Button>
                        </div>
                      </div>
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
        </div>
        
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Contact {vendor.name}</CardTitle>
              <CardDescription>Reach out to learn more about their services</CardDescription>
            </CardHeader>
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
              
              <Button className="w-full bg-primary text-white hover:bg-primary/90">
                <Phone className="h-5 w-5 mr-2" />
                Request a Call
              </Button>
              
              <div className="flex space-x-2 mt-4">
                {vendor.instagramUrl && (
                  <a 
                    href={vendor.instagramUrl}
                    className="flex-1 flex justify-center items-center border border-gray-300 rounded-md py-2 hover:bg-accent transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                
                {vendor.websiteUrl && (
                  <a 
                    href={vendor.websiteUrl}
                    className="flex-1 flex justify-center items-center border border-gray-300 rounded-md py-2 hover:bg-accent transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-sm text-muted-foreground">
                <p>Tell them you found them on HowzEventz!</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <LikeButton 
              vendorId={vendor.id} 
              variant="outline"
              showText
              className="w-full justify-center border-primary text-primary hover:bg-accent"
            />
          </div>
        </div>
      </div>

      {/* Similar Vendors Section */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Similar Vendors</h2>
          {category && (
            <p className="text-muted-foreground">
              More {category.name.toLowerCase()} in your area
            </p>
          )}
        </div>
        

        {similarVendorsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : similarVendors.length > 0 ? (
          <div className="space-y-4">
            {similarVendors.map((similarVendor) => (
              <Card key={similarVendor.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="flex flex-row">
                  {/* Left side - Image */}
                  <div className="relative w-1/3 overflow-hidden">
                    <div className="h-full w-full">
                      <ImageViewer
                        imageUrl={similarVendor.imageUrl}
                        alt={similarVendor.name}
                        className="h-full w-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
                        fallbackUrl="https://placehold.co/300x200?text=No+Image"
                      />
                    </div>
                    
                    {similarVendor.subscriptionTier === 'premium' && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground z-10 text-xs px-2 py-0.5 rounded">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  {/* Right side - Content */}
                  <CardContent className="flex-grow p-3 w-2/3">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-base tracking-tight">{similarVendor.name}</h3>
                      <div className="flex items-center bg-primary/10 px-2 py-0.5 rounded text-xs">
                        <div className="h-3 w-3 mr-1 text-primary">★</div>
                        <span className="font-medium">{similarVendor.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground text-xs ml-1">({similarVendor.reviewCount})</span>
                      </div>
                    </div>
                    
                    {similarVendor.logoUrl && (
                      <div className="float-right ml-2 mb-1 bg-white rounded-full p-0.5 shadow-sm">
                        <ImageViewer
                          imageUrl={similarVendor.logoUrl}
                          alt={`${similarVendor.name} logo`}
                          className="h-8 w-8 object-contain rounded-full"
                          fallbackUrl="https://placehold.co/100x100?text=Logo"
                        />
                      </div>
                    )}
                    
                    <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                      {similarVendor.description.length > 80 ? `${similarVendor.description.slice(0, 80).trim()}...` : similarVendor.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      {similarVendor.priceRange && (
                        <div className="text-xs py-0 px-1.5 h-5 border border-gray-300 rounded bg-white">
                          {similarVendor.priceRange}
                        </div>
                      )}
                      
                      {similarVendor.location && (
                        <div className="text-xs py-0 px-1.5 h-5 border border-gray-300 rounded bg-white">
                          {similarVendor.location}
                        </div>
                      )}
                      
                      {similarVendor.isThemed && (
                        <div className="text-xs py-0 px-1.5 h-5 border border-gray-300 rounded bg-primary/5">
                          Themed
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
                
                <div className="p-3 pt-0">
                  <button 
                    className="w-full inline-flex justify-center py-1.5 px-3 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors"
                    onClick={() => {
                      window.location.href = `/vendors/${similarVendor.id}`;
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
