import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { useLocation } from "wouter";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface VendorFilterProps {
  onFilter: (filters: {
    search?: string;
    category?: string;
    priceRange?: string;
  }) => void;
  initialFilters?: {
    search?: string;
    category?: string;
    priceRange?: string;
  };
}

export function VendorFilter({ onFilter, initialFilters = {} }: VendorFilterProps) {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState(initialFilters.search || "");
  const [category, setCategory] = useState(initialFilters.category || "");
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange || "");

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters: Record<string, string> = {};
    if (search) filters.search = search;
    if (category) filters.category = category;
    if (priceRange) filters.priceRange = priceRange;
    
    onFilter({ search, category, priceRange });
    
    // Update URL with query params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, value);
    });
    
    const queryString = params.toString();
    setLocation(`/vendors${queryString ? `?${queryString}` : ''}`);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setPriceRange("");
    onFilter({});
    setLocation("/vendors");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Vendors</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="Search vendors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="categories">
              <AccordionTrigger>Categories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="price">
              <AccordionTrigger>Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Price</SelectItem>
                      <SelectItem value="$">$ - Budget</SelectItem>
                      <SelectItem value="$$">$$ - Moderate</SelectItem>
                      <SelectItem value="$$$">$$$ - Premium</SelectItem>
                      <SelectItem value="$$$$">$$$$ - Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex flex-col space-y-2">
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
              Apply Filters
            </Button>
            <Button 
              type="button" 
              onClick={handleReset} 
              variant="outline" 
              className="border-primary text-primary hover:bg-accent"
            >
              Reset Filters
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
