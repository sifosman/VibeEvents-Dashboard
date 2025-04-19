import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category, Vendor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { VendorCard } from "../components/vendors/VendorCard";
import { Helmet } from "react-helmet";

export default function BrowseByCategory() {
  type TabType = 'all' | 'venues' | 'services' | 'vendors';
  
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const { data: vendors, isLoading } = useQuery<Vendor[]>({
    queryKey: ['/api/vendors', activeCategory ? `category=${activeCategory}` : '', activeTab !== 'all' ? `tab=${activeTab}` : ''],
    queryFn: async () => {
      let url = '/api/vendors';
      const params = new URLSearchParams();
      
      if (activeCategory) {
        params.append('category', activeCategory.toString());
      }
      
      if (activeTab !== 'all') {
        params.append('type', activeTab);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch vendors');
      return res.json();
    },
  });

  return (
    <>
      <Helmet>
        <title>Browse Vendors by Category | HowzEvent</title>
        <meta name="description" content="Find the perfect match for each aspect of your event by browsing vendors in different categories." />
      </Helmet>

      <div className="container-custom py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-4">Browse Vendors by Category</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Find the perfect match for each aspect of your event</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-accent/20 rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="flex flex-wrap">
            <Button
              className={`px-8 py-3 rounded-none ${
                activeTab === 'all' ? 'bg-primary text-white' : 'bg-transparent text-foreground hover:bg-accent hover:text-primary'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All
            </Button>
            
            <Button
              className={`px-8 py-3 rounded-none ${
                activeTab === 'venues' ? 'bg-primary text-white' : 'bg-transparent text-foreground hover:bg-accent hover:text-primary'
              }`}
              onClick={() => setActiveTab('venues')}
            >
              Venues
            </Button>

            <Button
              className={`px-8 py-3 rounded-none ${
                activeTab === 'services' ? 'bg-primary text-white' : 'bg-transparent text-foreground hover:bg-accent hover:text-primary'
              }`}
              onClick={() => setActiveTab('services')}
            >
              Services
            </Button>

            <Button
              className={`px-8 py-3 rounded-none ${
                activeTab === 'vendors' ? 'bg-primary text-white' : 'bg-transparent text-foreground hover:bg-accent hover:text-primary'
              }`}
              onClick={() => setActiveTab('vendors')}
            >
              Vendors
            </Button>
          </div>
        </div>
        
        {/* Category Selection */}
        <div className="bg-neutral rounded-lg shadow overflow-hidden mb-8">
          <div className="flex flex-wrap">
            <Button
              className={`px-6 py-3 rounded-none ${
                activeCategory === null ? 'bg-primary/90 text-white' : 'bg-transparent text-foreground hover:bg-accent hover:text-primary'
              }`}
              onClick={() => setActiveCategory(null)}
            >
              All Categories
            </Button>
            
            {categories?.map((category) => (
              <Button
                key={category.id}
                className={`px-6 py-3 rounded-none ${
                  activeCategory === category.id ? 'bg-primary/90 text-white' : 'bg-transparent text-foreground hover:bg-accent hover:text-primary'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="flex flex-row">
                  {/* Left side - Image placeholder */}
                  <div className="w-1/3 bg-gray-200 h-40"></div>
                  
                  {/* Right side - Content placeholder */}
                  <div className="p-3 w-2/3">
                    <div className="flex justify-between">
                      <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
                      <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-100 rounded w-full my-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                    <div className="flex gap-1 mt-2">
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
                
                {/* Footer placeholder */}
                <div className="p-3 pt-1">
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : vendors && vendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <div key={vendor.id}>
                <VendorCard vendor={vendor} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg bg-background">
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search filters or browse a different category
            </p>
            <Button 
              className="bg-primary text-white"
              onClick={() => {
                setActiveTab('all');
                setActiveCategory(null);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link href="/vendors">
            <Button className="bg-primary text-white rounded-lg hover:bg-primary/90 px-6 py-3">
              View All Vendors
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}