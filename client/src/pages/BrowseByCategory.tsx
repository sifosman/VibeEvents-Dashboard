import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category, Vendor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { VendorCard } from "../components/vendors/VendorCard";
import { Helmet } from "react-helmet";
import { ChevronDown, ChevronRight, MapPin, Users, Briefcase, Search } from "lucide-react";

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
  const [selectedSubcategories, setSelectedSubcategories] = useState<{[key: string]: number[]}>({});
  
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

  const toggleSubcategory = (mainCategoryId: string, subcategoryId: number) => {
    setSelectedSubcategories(prev => {
      const currentSelections = prev[mainCategoryId] || [];
      const isSelected = currentSelections.includes(subcategoryId);
      
      return {
        ...prev,
        [mainCategoryId]: isSelected 
          ? currentSelections.filter(id => id !== subcategoryId)
          : [...currentSelections, subcategoryId]
      };
    });
  };

  const searchSelectedCategories = (mainCategoryId: string) => {
    const selected = selectedSubcategories[mainCategoryId] || [];
    if (selected.length === 0) return;
    
    // Determine search URL based on main category
    if (mainCategoryId === 'venues') {
      window.location.href = `/venue-search?categories=${selected.join(',')}`;
    } else if (mainCategoryId === 'vendors') {
      window.location.href = `/vendor-search?categories=${selected.join(',')}`;
    } else if (mainCategoryId === 'service-providers') {
      window.location.href = `/service-provider-search?categories=${selected.join(',')}`;
    }
  };

  const clearSelections = (mainCategoryId: string) => {
    setSelectedSubcategories(prev => ({
      ...prev,
      [mainCategoryId]: []
    }));
  };

  const getSubcategoriesForMain = (mainCat: MainCategory) => {
    if (!categories) return [];
    return categories.filter(cat => mainCat.subcategories.includes(cat.id));
  };

  const selectedCategory = categories?.find(cat => cat.id === selectedCategoryId);

  return (
    <>
      <Helmet>
        <title>Browse by Category | Vibeventz</title>
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
                        {/* Selection Controls */}
                        <div className="p-3 border-b border-gray-200 bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              {(selectedSubcategories[mainCat.id] || []).length} selected
                            </span>
                            <div className="flex gap-2">
                              {(selectedSubcategories[mainCat.id] || []).length > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => clearSelections(mainCat.id)}
                                  className="h-6 px-2 text-xs"
                                >
                                  Clear
                                </Button>
                              )}
                              {(selectedSubcategories[mainCat.id] || []).length > 0 && (
                                <Button
                                  size="sm"
                                  onClick={() => searchSelectedCategories(mainCat.id)}
                                  className="h-6 px-2 text-xs bg-primary hover:bg-primary/90"
                                >
                                  <Search className="h-3 w-3 mr-1" />
                                  Search
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Subcategory List with Checkboxes */}
                        <div className="max-h-60 overflow-y-auto">
                          {subcategories.map((subcategory) => {
                            const isSelected = (selectedSubcategories[mainCat.id] || []).includes(subcategory.id);
                            return (
                              <label
                                key={subcategory.id}
                                className="flex items-center py-2 px-4 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleSubcategory(mainCat.id, subcategory.id)}
                                  className="mr-3"
                                />
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900" style={{ fontFamily: 'Calibri, sans-serif' }}>{subcategory.name}</h3>
                                </div>
                              </label>
                            );
                          })}
                        </div>
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