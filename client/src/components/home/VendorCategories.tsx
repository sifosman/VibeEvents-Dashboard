import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category, Vendor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ShortlistButton } from "../vendors/ShortlistButton";
import StarRating from "../ui/star-rating";

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
              <div key={index} className="bg-neutral rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vendors?.slice(0, 8).map((vendor) => (
              <div key={vendor.id} className="bg-neutral rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition">
                <div 
                  className="relative h-48 bg-cover bg-center" 
                  style={{ backgroundImage: `url('${vendor.imageUrl}')` }}
                >
                  <ShortlistButton vendorId={vendor.id} className="absolute top-4 right-4" size="sm" />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-medium text-lg mb-1 group-hover:text-primary transition">{vendor.name}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <StarRating rating={vendor.rating} reviewCount={vendor.reviewCount} size="sm" />
                    <span className="category-badge">
                      {categories?.find(c => c.id === vendor.categoryId)?.name || "Vendor"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{vendor.description}</p>
                  <Link href={`/vendors/${vendor.id}`} className="text-primary text-sm font-medium hover:underline">
                    View Details
                  </Link>
                </div>
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
