import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Star } from 'lucide-react';
import { useLocation } from 'wouter';

interface FeaturedVendorAdProps {
  categoryId?: number;
  limit?: number;
  className?: string;
  showHeader?: boolean;
}

interface FeaturedVendor {
  id: number;
  campaignId: number;
  vendorId: number;
  name: string;
  description: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
}

export default function FeaturedVendorAd({ 
  categoryId, 
  limit = 3, 
  className = "",
  showHeader = true 
}: FeaturedVendorAdProps) {
  const [, setLocation] = useLocation();
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  // Fetch featured vendors
  const { data: featuredVendors, isLoading } = useQuery<FeaturedVendor[]>({
    queryKey: ['/api/ads/featured-vendors', { categoryId, limit }],
  });

  // Track impressions once loaded
  useEffect(() => {
    if (featuredVendors?.length && !hasTrackedImpression) {
      // Record impressions in the backend
      const impressionPromises = featuredVendors.map(vendor => 
        apiRequest("POST", `/api/ads/campaigns/${vendor.campaignId}/impression`, {})
      );
      
      Promise.all(impressionPromises)
        .then(() => setHasTrackedImpression(true))
        .catch(error => console.error("Failed to track impressions:", error));
    }
  }, [featuredVendors, hasTrackedImpression]);

  // Handle click on a vendor
  const handleVendorClick = (vendor: FeaturedVendor) => {
    // Record click in the backend
    apiRequest("POST", `/api/ads/campaigns/${vendor.campaignId}/click`, {})
      .catch(error => console.error("Failed to track click:", error));
    
    // Navigate to vendor details page
    setLocation(`/vendors/${vendor.vendorId}`);
  };

  if (isLoading) {
    // Show loading placeholders
    return (
      <div className={className}>
        {showHeader && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">Featured Vendors</h2>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(limit).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden animate-pulse">
              <div className="h-48 bg-accent/20"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-accent/30 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-accent/20 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-accent/10 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!featuredVendors?.length) {
    // Don't show anything if no featured vendors
    return null;
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Featured Vendors</h2>
          <Button 
            variant="link" 
            className="text-primary" 
            onClick={() => setLocation("/vendors")}
          >
            View all vendors <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredVendors.map((vendor) => (
          <Card 
            key={vendor.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleVendorClick(vendor)}
          >
            <div className="relative">
              <img 
                src={vendor.imageUrl} 
                alt={vendor.name} 
                className="h-48 w-full object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-primary flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> Featured
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{vendor.name}</h3>
                <span className="text-sm text-muted-foreground">{vendor.priceRange}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {vendor.description}
              </p>
              
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {vendor.categoryName}
                </Badge>
                <div className="flex items-center text-xs text-amber-500">
                  <Star className="h-3 w-3 fill-current mr-1" />
                  <span>{vendor.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1">
                    ({vendor.reviewCount})
                  </span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="px-4 py-3 bg-accent/10 flex justify-between">
              <span className="text-xs text-muted-foreground">Promoted</span>
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVendorClick(vendor);
                }}
              >
                View Details <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}