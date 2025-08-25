import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category, Vendor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { VendorCard } from "../components/vendors/VendorCard";
import { Helmet } from "react-helmet";
import { ChevronDown, ChevronRight, MapPin, Users, Briefcase } from "lucide-react";

type MainCategory = {
  id: string;
  name: string;
  icon: React.ElementType;
  subcategories: number[];
};

const mainCategories: MainCategory[] = [
  {
    id: "venues",
    name: "Venues",
    icon: MapPin,
    // All the new comprehensive venue categories (alphabetically ordered)
    subcategories: [102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131]
  },
  {
    id: "vendors", 
    name: "Vendors",
    icon: Users,
    // All the new comprehensive vendor categories
    subcategories: [76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101]
  },
  {
    id: "service-providers",
    name: "Service Providers", 
    icon: Briefcase,
    // All the new comprehensive service provider categories
    subcategories: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74]
  }
];

export default function BrowseByCategory() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const { data: vendors, isLoading } = useQuery<Vendor[]>({
    queryKey: ['/api/vendors', selectedCategoryId],
    queryFn: async () => {
      if (!selectedCategoryId) return [];
      
      const res = await fetch(`/api/vendors?categoryId=${selectedCategoryId}`);
      if (!res.ok) throw new Error('Failed to fetch vendors');
      return res.json();
    },
    enabled: !!selectedCategoryId
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    setSelectedCategoryId(null); // Reset selected subcategory when toggling main category
  };

  const selectSubcategory = (categoryId: number) => {
    // Check if this is a venue category (venue category IDs are 102-131)
    if (categoryId >= 102 && categoryId <= 131) {
      // Navigate to venue search page
      window.location.href = `/venue-search/${categoryId}`;
    } else {
      // Show vendors for non-venue categories
      setSelectedCategoryId(categoryId);
    }
  };

  const getSubcategoriesForMain = (mainCat: MainCategory) => {
    if (!categories) return [];
    return categories.filter(cat => mainCat.subcategories.includes(cat.id));
  };

  const selectedCategory = categories?.find(cat => cat.id === selectedCategoryId);

  return (
    <>
      <Helmet>
        <title>Browse by Category | HowzEventz</title>
        <meta name="description" content="Find the perfect vendors and services for your event by browsing our organized categories." />
      </Helmet>

      <div className="container-custom py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-4">Browse by Category</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Find the perfect vendors and services for your event</p>
        </div>
        
        {!selectedCategoryId ? (
          <div className="max-w-2xl mx-auto">
            {/* Main Categories */}
            <div className="space-y-1">
              {mainCategories.map((mainCat) => {
                const isExpanded = expandedCategory === mainCat.id;
                const subcategories = getSubcategoriesForMain(mainCat);
                const IconComponent = mainCat.icon;
                
                return (
                  <div key={mainCat.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Main Category Header */}
                    <button
                      onClick={() => toggleCategory(mainCat.id)}
                      className="w-full flex items-center justify-between py-3 px-4 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold text-left">{mainCat.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    {/* Subcategories */}
                    {isExpanded && (
                      <div className="bg-gray-50 border-t border-gray-200">
                        {subcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            onClick={() => selectSubcategory(subcategory.id)}
                            className="w-full text-left py-2 px-4 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900">{subcategory.name}</h3>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {/* Back to Categories */}
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => setSelectedCategoryId(null)}
                className="mb-4"
              >
                ← Back to Categories
              </Button>
              <h2 className="text-2xl font-bold">{selectedCategory?.name}</h2>
              <p className="text-muted-foreground">{selectedCategory?.description}</p>
            </div>

            {/* Vendors Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[4/3] rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : vendors && vendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No vendors found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}