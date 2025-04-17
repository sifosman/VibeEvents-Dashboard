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
      <div className="relative pb-[56.25%] overflow-hidden">
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
      
      <CardContent className="flex-grow p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg tracking-tight">{vendor.name}</h3>
          <div className="flex items-center bg-primary/10 px-2 py-1 rounded text-sm">
            <StarIcon className="h-3.5 w-3.5 mr-1 text-primary" />
            <span className="font-medium">{vendor.rating.toFixed(1)}</span>
            <span className="text-muted-foreground text-xs ml-1">({vendor.reviewCount})</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3">{truncateDescription(vendor.description)}</p>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {vendor.priceRange && (
            <Badge variant="outline" className="text-xs">
              {vendor.priceRange}
            </Badge>
          )}
          
          {vendor.location && (
            <Badge variant="outline" className="text-xs">
              {vendor.location}
            </Badge>
          )}
          
          {vendor.isThemed && (
            <Badge variant="outline" className="text-xs bg-primary/5">
              Themed
            </Badge>
          )}
          
          {!vendor.servesAlcohol && (
            <Badge variant="outline" className="text-xs bg-primary/5">
              Alcohol-free
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link href={`/vendors/${vendor.id}`}>
          <a className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors">
            View Details
          </a>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default VendorCard;