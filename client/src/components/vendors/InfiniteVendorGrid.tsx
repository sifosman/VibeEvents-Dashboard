import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { VendorCard } from './VendorCard';

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

interface InfiniteVendorGridProps {
  categoryId?: number;
  searchTerm?: string;
  location?: string;
  priceRange?: string[];
  dietary?: string[];
  themed?: boolean;
  themeTypes?: string[];
  servesAlcohol?: boolean;
  initialVendors?: Vendor[];
}

export function InfiniteVendorGrid({
  categoryId,
  searchTerm,
  location,
  priceRange,
  dietary,
  themed,
  themeTypes,
  servesAlcohol,
  initialVendors
}: InfiniteVendorGridProps) {
  const [page, setPage] = useState(1);
  const [allVendors, setAllVendors] = useState<Vendor[]>(initialVendors || []);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20; // vendors per page
  
  // Create reference to track if this is the initial load
  const isInitialLoad = useRef(true);
  
  // Set up intersection observer for infinite scrolling
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px' // Load more content before user reaches the bottom
  });
  
  // Construct the query key with all filter parameters
  const queryKey = [
    '/api/vendors',
    {
      page,
      limit,
      categoryId,
      search: searchTerm,
      location,
      priceRange: priceRange?.join(','),
      dietary: dietary?.join(','),
      themed: themed?.toString(),
      themeTypes: themeTypes?.join(','),
      servesAlcohol: servesAlcohol !== undefined ? servesAlcohol.toString() : undefined
    }
  ];
  
  // Fetch vendors from the API
  const { data, isLoading, isError, error } = useQuery<Vendor[]>({
    queryKey,
    enabled: hasMore || isInitialLoad.current, // Only fetch if there are more vendors to load or it's the initial load
  });
  
  // Update vendors list when new data is fetched
  useEffect(() => {
    // Skip if no data or loading
    if (!data) return;
    
    // If this is the initial load and we have initialVendors, don't append
    if (isInitialLoad.current && initialVendors?.length) {
      isInitialLoad.current = false;
      return;
    }
    
    // If we received fewer items than the limit, we've reached the end
    if (data.length < limit) {
      setHasMore(false);
    }
    
    // Append new vendors to the list, avoiding duplicates by ID
    setAllVendors(prev => {
      const vendorIds = new Set(prev.map(v => v.id));
      const newVendors = data.filter(v => !vendorIds.has(v.id));
      return [...prev, ...newVendors];
    });
    
    isInitialLoad.current = false;
  }, [data, initialVendors, limit]);
  
  // Load more vendors when user scrolls to the bottom
  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView, isLoading, hasMore]);
  
  // Handle filter changes by resetting to page 1
  useEffect(() => {
    // Skip the initial render
    if (isInitialLoad.current) return;
    
    setPage(1);
    setAllVendors([]);
    setHasMore(true);
  }, [categoryId, searchTerm, location, priceRange, dietary, themed, themeTypes, servesAlcohol]);
  
  return (
    <div className="w-full">
      {/* Vendors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allVendors.map(vendor => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="w-full flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* Error message */}
      {isError && (
        <div className="w-full flex justify-center my-8 text-destructive">
          <p>Error loading vendors: {(error as Error)?.message || 'Unknown error'}</p>
        </div>
      )}
      
      {/* No results message */}
      {!isLoading && allVendors.length === 0 && (
        <div className="w-full flex justify-center my-8 text-center">
          <div>
            <p className="text-xl font-semibold mb-2">No vendors found</p>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms to find more vendors.
            </p>
          </div>
        </div>
      )}
      
      {/* Loading trigger element - when this comes into view, load more vendors */}
      {hasMore && <div ref={ref} className="h-10" />}
      
      {/* End of results message */}
      {!hasMore && allVendors.length > 0 && (
        <div className="w-full flex justify-center my-8 text-center text-muted-foreground">
          <p>You've seen all available vendors</p>
        </div>
      )}
    </div>
  );
}

export default InfiniteVendorGrid;