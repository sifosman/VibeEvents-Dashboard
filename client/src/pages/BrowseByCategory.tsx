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
    subcategories: [1] // Venues category
  },
  {
    id: "vendors", 
    name: "Vendors",
    icon: Users,
    subcategories: [9, 10] // Market Vendors, Vendor Opportunities
  },
  {
    id: "service-providers",
    name: "Service Providers", 
    icon: Briefcase,
    subcategories: [2, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21] // All service categories
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
    setSelectedCategoryId(categoryId);
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
            <div className="space-y-2">
              {mainCategories.map((mainCat) => {
                const isExpanded = expandedCategory === mainCat.id;
                const subcategories = getSubcategoriesForMain(mainCat);
                const IconComponent = mainCat.icon;
                
                return (
                  <div key={mainCat.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Main Category Header */}
                    <button
                      onClick={() => toggleCategory(mainCat.id)}
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
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
                            className="w-full text-left p-4 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium text-gray-900">{subcategory.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{subcategory.description}</p>
                              </div>
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