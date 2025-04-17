import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Category } from "@shared/schema";
import SouthAfricanBadge from "../shared/SouthAfricanBadge";

export default function Hero() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  return (
    <section className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      {/* South African Badge - positioned top right */}
      <div className="absolute top-4 right-4 z-10">
        <SouthAfricanBadge />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Venues, Vendors, Vibes</h1>
          <p className="text-white text-lg mb-8">Discover and book the best service providers for all your events - wedding and party celebrations, corporate functions, market days, expos, fundraisers, live concerts...and much more</p>
          
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mx-auto max-w-2xl">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="flex-grow px-4 py-3 rounded focus:border-primary">
                  <SelectValue placeholder="What are you looking for?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-services">All Services</SelectItem>
                  <SelectItem value="market-vendors">Market Vendors</SelectItem>
                  <SelectItem value="vendor-opportunities">Vendor Opportunities</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Link href={
                selectedCategory === "all-services" ? "/services" :
                selectedCategory === "market-vendors" ? "/market-vendors" :
                selectedCategory === "vendor-opportunities" ? "/opportunities" :
                selectedCategory ? `/vendors?category=${selectedCategory}` : "/services"
              }>
                <Button className="bg-primary text-white px-6 py-6 h-12 hover:bg-primary/90 whitespace-nowrap">
                  Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
