import React from 'react';
import { Link } from 'wouter';
import { StarIcon } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Vendor {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  logoUrl?: string;
  categoryId: number;
  priceRange: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  location?: string;
  isThemed?: boolean;
  themeTypes?: string[];
  venueCapacity?: number;
  dietaryOptions?: string[];
  cuisineTypes?: string[];
  servesAlcohol?: boolean;
}

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  // Truncate description to fit card
  const truncateDescription = (text: string, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}...`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative pb-[40%] overflow-hidden">
        <img 
          src={vendor.imageUrl} 
          alt={vendor.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
        />
        
        {vendor.logoUrl && (
          <div className="absolute bottom-3 right-3 bg-white rounded-full p-1 shadow-md">
            <img 
              src={vendor.logoUrl} 
              alt={`${vendor.name} logo`} 
              className="h-10 w-10 object-contain rounded-full"
            />
          </div>
        )}
        
        {vendor.featured && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 bg-primary text-primary-foreground"
          >
            Featured
          </Badge>
        )}
      </div>
      
      <CardContent className="flex-grow p-3">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-base tracking-tight">{vendor.name}</h3>
          <div className="flex items-center bg-primary/10 px-2 py-0.5 rounded text-xs">
            <StarIcon className="h-3 w-3 mr-1 text-primary" />
            <span className="font-medium">{vendor.rating.toFixed(1)}</span>
            <span className="text-muted-foreground text-xs ml-1">({vendor.reviewCount})</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{truncateDescription(vendor.description, 80)}</p>
        
        <div className="flex flex-wrap gap-1 mt-1">
          {vendor.priceRange && (
            <Badge variant="outline" className="text-xs py-0 px-1.5 h-5">
              {vendor.priceRange}
            </Badge>
          )}
          
          {vendor.location && (
            <Badge variant="outline" className="text-xs py-0 px-1.5 h-5">
              {vendor.location}
            </Badge>
          )}
          
          {vendor.isThemed && (
            <Badge variant="outline" className="text-xs py-0 px-1.5 h-5 bg-primary/5">
              Themed
            </Badge>
          )}
          
          {!vendor.servesAlcohol && (
            <Badge variant="outline" className="text-xs py-0 px-1.5 h-5 bg-primary/5">
              Alcohol-free
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <Link href={`/vendors/${vendor.id}`} className="w-full inline-flex justify-center py-1.5 px-3 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors">
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}

export default VendorCard;