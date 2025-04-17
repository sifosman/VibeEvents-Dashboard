import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Vendor, Category } from "@shared/schema";
import { VendorFilter } from "@/components/vendors/VendorFilter";
import { VendorCard } from "@/components/vendors/VendorCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default function VendorListing() {
  const [location] = useLocation();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    priceRange: "",
    isThemed: false,
    themeType: "",
    dietary: "",
    cuisine: "",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Parse URL params on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search") || "";
    const categoryParam = params.get("category") || "";
    const priceRangeParam = params.get("priceRange") || "";
    const isThemedParam = params.get("isThemed") === "true";
    const themeTypeParam = params.get("themeType") || "";
    const dietaryParam = params.get("dietary") || "";
    const cuisineParam = params.get("cuisine") || "";
    
    setFilters({
      search: searchParam,
      category: categoryParam,
      priceRange: priceRangeParam,
      isThemed: isThemedParam,
      themeType: themeTypeParam,
      dietary: dietaryParam,
      cuisine: cuisineParam,
    });
  }, [location]);

  // Get category by slug if applicable
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Find category by slug or ID
  const selectedCategory = categories?.find(
    (c) => c.slug === filters.category || c.id.toString() === filters.category
  );

  // Build the query string for the API
  const buildQueryString = () => {
    const queryParts = [];
    
    if (filters.search) {
      queryParts.push(`search=${encodeURIComponent(filters.search)}`);
    }
    
    if (filters.category) {
      // Category could be a slug or ID
      if (selectedCategory) {
        queryParts.push(`category=${selectedCategory.id}`);
      } else {
        queryParts.push(`category=${encodeURIComponent(filters.category)}`);
      }
    }
    
    // Price range filtering would be implemented in the backend
    
    return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  };

  // Get filtered vendors
  const { data: vendors, isLoading } = useQuery<Vendor[]>({
    queryKey: [`/api/vendors${buildQueryString()}`],
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
    setShowMobileFilters(false);
  };

  return (
    <>
      <Helmet>
        <title>
          {selectedCategory 
            ? `${selectedCategory.name} - HowzEvent` 
            : "Browse Vendors - WeddingPro"}
        </title>
        <meta 
          name="description" 
          content={selectedCategory 
            ? `Find the best ${selectedCategory.name} vendors for your event.` 
            : "Browse and discover event vendors across all categories."}
        />
      </Helmet>
      
      <div className="bg-neutral py-10">
        <div className="container-custom">
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <Button variant="ghost" asChild className="p-0 mr-3 hover:bg-transparent">
                <a href="javascript:history.back()">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </a>
              </Button>
              <h1 className="text-3xl font-display font-bold">
                {selectedCategory 
                  ? selectedCategory.name 
                  : filters.search 
                    ? `Search Results for: ${filters.search}` 
                    : "Browse All Vendors"}
              </h1>
            </div>
            
            {selectedCategory && (
              <p className="text-muted-foreground">{selectedCategory.description}</p>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Filters */}
            <div className="hidden md:block md:w-1/4">
              <VendorFilter onFilter={handleFilterChange} initialFilters={filters} />
            </div>
            
            {/* Mobile Filters */}
            <div className="md:hidden mb-4">
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter Vendors
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Vendors</SheetTitle>
                    <SheetDescription>
                      Customize your search results
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <VendorFilter onFilter={handleFilterChange} initialFilters={filters} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Vendor Listings */}
            <div className="md:w-3/4">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                        </div>
                        <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : vendors && vendors.length > 0 ? (
                <>
                  <div className="mb-4 flex justify-between items-center">
                    <p className="text-muted-foreground">
                      Showing {vendors.length} {vendors.length === 1 ? "vendor" : "vendors"}
                    </p>
                    <div className="flex gap-2">
                      {/* Additional sorting options could go here */}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendors.map((vendor) => (
                      <VendorCard 
                        key={vendor.id} 
                        vendor={vendor} 
                        category={categories?.find(c => c.id === vendor.categoryId)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium mb-2">No vendors found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button 
                    onClick={() => handleFilterChange({ search: "", category: "", priceRange: "" })}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
