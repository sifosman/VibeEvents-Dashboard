import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Vendor, Category } from "@shared/schema";
import { VendorFilter } from "@/components/vendors/VendorFilter";
import { VendorCard } from "@/components/vendors/VendorCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, Map, SortDesc } from "lucide-react";
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
    eventType: "",
    isThemed: false,
    themeType: "",
    dietary: "",
    cuisine: "",
    country: "",
    provinces: [] as string[],
    cities: [] as string[],
    vendorTag: "",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular"); // Default sort option

  // Parse URL params on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search") || "";
    const categoryParam = params.get("category") || "";
    const priceRangeParam = params.get("priceRange") || "";
    const eventTypeParam = params.get("eventType") || "";
    const isThemedParam = params.get("isThemed") === "true";
    const themeTypeParam = params.get("themeType") || "";
    const dietaryParam = params.get("dietary") || "";
    const cuisineParam = params.get("cuisine") || "";
    const countryParam = params.get("country") || "";
    const provincesParam = params.get("provinces")?.split(',').filter(p => p) || [];
    const citiesParam = params.get("cities")?.split(',').filter(c => c) || [];
    const vendorTagParam = params.get("vendorTag") || "";
    
    setFilters({
      search: searchParam,
      category: categoryParam,
      priceRange: priceRangeParam,
      eventType: eventTypeParam,
      isThemed: isThemedParam,
      themeType: themeTypeParam,
      dietary: dietaryParam,
      cuisine: cuisineParam,
      country: countryParam,
      provinces: provincesParam,
      cities: citiesParam,
      vendorTag: vendorTagParam,
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
    
    if (filters.vendorTag) {
      queryParts.push(`vendorTag=${encodeURIComponent(filters.vendorTag)}`);
    }
    
    if (filters.priceRange) {
      queryParts.push(`priceRange=${encodeURIComponent(filters.priceRange)}`);
    }
    
    if (filters.eventType) {
      queryParts.push(`eventType=${encodeURIComponent(filters.eventType)}`);
    }
    
    if (filters.isThemed) {
      queryParts.push(`isThemed=true`);
    }
    
    if (filters.themeType) {
      queryParts.push(`themeType=${encodeURIComponent(filters.themeType)}`);
    }
    
    if (filters.dietary) {
      queryParts.push(`dietary=${encodeURIComponent(filters.dietary)}`);
    }
    
    if (filters.cuisine) {
      queryParts.push(`cuisine=${encodeURIComponent(filters.cuisine)}`);
    }
    
    if (filters.country) {
      queryParts.push(`country=${encodeURIComponent(filters.country)}`);
    }
    
    if (filters.provinces && filters.provinces.length > 0) {
      queryParts.push(`provinces=${encodeURIComponent(filters.provinces.join(','))}`);
    }
    
    if (filters.cities && filters.cities.length > 0) {
      queryParts.push(`cities=${encodeURIComponent(filters.cities.join(','))}`);
    }
    
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
            ? `${selectedCategory.name} - HowzEventz` 
            : "Browse Vendors - HowzEventz"}
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
              <Button 
                variant="ghost" 
                className="p-0 mr-3 hover:bg-transparent"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
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

          {/* Filter/Sort/Map icons strip */}
          <div className="flex gap-2 mb-4 border-b pb-4">
            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
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
            
            <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
              <SortDesc className="h-4 w-4" />
              Sort
            </Button>
            
            <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
              <Map className="h-4 w-4" />
              Map
            </Button>
          </div>
          
          {/* Vendor Listings */}
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-32 bg-gray-200"></div>
                    <div className="p-3">
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {vendors.map((vendor) => (
                    <VendorCard 
                      key={vendor.id} 
                      vendor={vendor} 
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
                  onClick={() => handleFilterChange({ 
                    search: "", 
                    category: "", 
                    priceRange: "",
                    eventType: "",
                    isThemed: false,
                    themeType: "",
                    dietary: "",
                    cuisine: "",
                    country: "",
                    region: "",
                    province: "",
                    area: "",
                    town: "",
                    vendorTag: ""
                  })}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}