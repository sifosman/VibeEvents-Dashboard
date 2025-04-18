import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category, Vendor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { VendorCard } from "../vendors/VendorCard";

export default function VendorCategories() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const { data: vendors, isLoading } = useQuery<Vendor[]>({
    queryKey: ['/api/vendors', activeCategory ? `category=${activeCategory}` : ''],
    queryFn: async () => {
      const url = activeCategory
        ? `/api/vendors?category=${activeCategory}`
        : '/api/vendors';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch vendors');
      return res.json();
    },
  });

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-4">Browse Vendors by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Find the perfect match for each aspect of your event</p>
        </div>
        
        <div className="bg-neutral rounded-lg shadow overflow-hidden mb-8">
          <div className="flex flex-wrap">
            <Button
              className={`px-6 py-3 rounded-none ${
                activeCategory === null ? 'bg-primary text-white' : 'bg-transparent hover:bg-accent hover:text-primary'
              }`}
              onClick={() => setActiveCategory(null)}
            >
              All Categories
            </Button>
            
            {categories?.map((category) => (
              <Button
                key={category.id}
                className={`px-6 py-3 rounded-none ${
                  activeCategory === category.id ? 'bg-primary text-white' : 'bg-transparent hover:bg-accent hover:text-primary'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vendors?.slice(0, 8).map((vendor) => (
              <div key={vendor.id}>
                <VendorCard vendor={vendor} />
              </div>
            ))}
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
    </section>
  );
}
