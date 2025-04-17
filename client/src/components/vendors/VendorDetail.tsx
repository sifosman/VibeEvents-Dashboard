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
import { MapPin, Globe, Instagram, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import StarRating from "../ui/star-rating";
import { LikeButton } from "./ShortlistButton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Reviews from "./Reviews";

interface VendorDetailProps {
  vendorId: number;
}

export function VendorDetail({ vendorId }: VendorDetailProps) {
  const { data: vendor, isLoading: vendorLoading } = useQuery<Vendor>({
    queryKey: [`/api/vendors/${vendorId}`],
  });

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [vendor ? `/api/categories/${vendor.categoryId}` : null],
    enabled: !!vendor,
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
      <div className="relative h-64 md:h-96 bg-cover bg-center rounded-lg overflow-hidden" style={{ backgroundImage: `url('${vendor.imageUrl}')` }}>
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
                      {vendor.calendarView && (
                        <Button className="mt-4 w-full" variant="outline">View Calendar</Button>
                      )}
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
    </div>
  );
}
