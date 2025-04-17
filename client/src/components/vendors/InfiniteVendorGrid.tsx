import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import VendorCard from './VendorCard';
import { Loader2 } from 'lucide-react';

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

const InfiniteVendorGrid: React.FC<InfiniteVendorGridProps> = ({
  categoryId,
  searchTerm,
  location,
  priceRange,
  dietary,
  themed,
  themeTypes,
  servesAlcohol,
  initialVendors = [],
}) => {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const VENDORS_PER_PAGE = 9; // Load 9 vendors at a time for a 3x3 grid
  
  // Setup intersection observer
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
    rootMargin: '300px 0px', // Load more content before user reaches the bottom
  });

  // Construct query parameters for the API request
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (categoryId) params.append('categoryId', categoryId.toString());
    if (searchTerm) params.append('search', searchTerm);
    if (location) params.append('location', location);
    if (priceRange && priceRange.length) params.append('priceRange', priceRange.join(','));
    if (dietary && dietary.length) params.append('dietary', dietary.join(','));
    if (themed !== undefined) params.append('themed', themed.toString());
    if (themeTypes && themeTypes.length) params.append('themeTypes', themeTypes.join(','));
    if (servesAlcohol !== undefined) params.append('servesAlcohol', servesAlcohol.toString());
    
    params.append('page', page.toString());
    params.append('limit', VENDORS_PER_PAGE.toString());
    
    return params.toString();
  };

  // Query to fetch vendors
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [
      '/api/vendors',
      categoryId,
      searchTerm,
      location,
      priceRange,
      dietary,
      themed,
      themeTypes,
      servesAlcohol,
      page,
    ],
    queryFn: async () => {
      const queryParams = buildQueryParams();
      const res = await fetch(`/api/vendors${queryParams ? `?${queryParams}` : ''}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch vendors');
      }
      
      const data = await res.json();
      return data;
    },
    enabled: hasMore || page === 1, // Only fetch if there are more vendors to load or it's the first page
  });

  // Handle automatic loading of more vendors when user scrolls near the bottom
  useEffect(() => {
    if (inView && !isFetching && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView, isFetching, hasMore]);

  // Update vendors list when new data is fetched
  useEffect(() => {
    if (data && Array.isArray(data)) {
      if (page === 1) {
        // First page, replace existing vendors
        setVendors(data);
      } else {
        // Subsequent pages, append to existing vendors
        setVendors(prevVendors => [...prevVendors, ...data]);
      }
      
      // If we received fewer vendors than the limit, there are no more to load
      setHasMore(data.length === VENDORS_PER_PAGE);
    }
  }, [data, page]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setVendors([]);
    setHasMore(true);
  }, [categoryId, searchTerm, location, priceRange, dietary, themed, themeTypes, servesAlcohol]);

  if (isError) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="text-red-500">
          Error loading vendors: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  if (isLoading && page === 1 && vendors.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (vendors.length === 0 && !isLoading) {
    return (
      <div className="h-40 flex flex-col items-center justify-center space-y-4 text-center p-8">
        <h3 className="font-semibold text-xl">No vendors found</h3>
        <p className="text-muted-foreground">
          We couldn't find any vendors matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
      
      {/* Loading indicator */}
      {(isFetching || hasMore) && (
        <div
          ref={ref}
          className="h-24 flex items-center justify-center"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* End of results message */}
      {!hasMore && vendors.length > 0 && !isFetching && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">You've reached the end of the results</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteVendorGrid;