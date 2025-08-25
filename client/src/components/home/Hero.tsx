import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Category } from "@shared/schema";
import SouthAfricanBadge from "../shared/SouthAfricanBadge";
import { Filter, Map, SortDesc } from "lucide-react";

export default function Hero() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  return (
    <section className="relative h-[400px] bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4 max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Venues, Vendors, Vibes</h1>
          <p className="text-white text-sm md:text-base mb-5 max-w-xl mx-auto">Discover and book the best service providers for all your events - wedding and party celebrations, corporate functions, market days, expos, fundraisers, live concerts...and much more</p>
          
          
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-3 mx-auto max-w-xl">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="flex-grow px-3 py-2 h-9 text-sm rounded focus:border-primary">
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
                <Button className="bg-primary text-white text-sm px-4 h-9 hover:bg-primary/90 whitespace-nowrap">
                  Search
                </Button>
              </Link>
            </div>
            
            {/* Filter/Sort/Map strip */}
            <div className="flex gap-1 mt-2">
              <Link href="/vendors?filter=true">
                <Button variant="outline" className="flex-1 h-7 text-xs flex items-center justify-center gap-1 bg-white/90 hover:bg-white">
                  <Filter className="h-3 w-3" />
                  Filter
                </Button>
              </Link>
              
              <Link href="/vendors?sort=popular">
                <Button variant="outline" className="flex-1 h-7 text-xs flex items-center justify-center gap-1 bg-white/90 hover:bg-white">
                  <SortDesc className="h-3 w-3" />
                  Sort
                </Button>
              </Link>
              
              <Link href="/map">
                <Button variant="outline" className="flex-1 h-7 text-xs flex items-center justify-center gap-1 bg-white/90 hover:bg-white">
                  <Map className="h-3 w-3" />
                  Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
