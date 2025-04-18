import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { useLocation } from "wouter";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { eventTypes } from "@/lib/eventTypes";
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
    eventType?: string;
    isThemed?: boolean;
    themeType?: string;
    dietary?: string;
    cuisine?: string;
    country?: string;
    region?: string;
    province?: string;
    area?: string;
    town?: string;
  }) => void;
  initialFilters?: {
    search?: string;
    category?: string;
    priceRange?: string;
    eventType?: string;
    isThemed?: boolean;
    themeType?: string;
    dietary?: string;
    cuisine?: string;
    country?: string;
    region?: string;
    province?: string;
    area?: string;
    town?: string;
  };
}

export function VendorFilter({ onFilter, initialFilters = {} }: VendorFilterProps) {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState(initialFilters.search || "");
  const [category, setCategory] = useState(initialFilters.category || "");
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange || "");
  const [eventType, setEventType] = useState(initialFilters.eventType || "");
  const [isThemed, setIsThemed] = useState(initialFilters.isThemed || false);
  const [themeType, setThemeType] = useState(initialFilters.themeType || "");
  const [dietary, setDietary] = useState(initialFilters.dietary || "");
  const [cuisine, setCuisine] = useState(initialFilters.cuisine || "");
  const [country, setCountry] = useState(initialFilters.country || "");
  const [region, setRegion] = useState(initialFilters.region || "");
  const [province, setProvince] = useState(initialFilters.province || "");
  const [area, setArea] = useState(initialFilters.area || "");
  const [town, setTown] = useState(initialFilters.town || "");

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const themeOptions = [
    "Fairy Tale", "Rustic", "Beach", "Vintage", "Modern", "Boho",
    "Garden", "Minimalist", "Luxury", "Cultural", "Fantasy", 
    "Seasonal", "Sports", "Movie", "Historical", "Magical"
  ];

  const dietaryOptions = [
    "Halaal", "Kosher", "Vegan", "Vegetarian", "Gluten-Free", 
    "Dairy-Free", "Nut-Free", "Alcohol-Free"
  ];

  const cuisineOptions = [
    "Mediterranean", "Indian", "Asian", "Mexican", "Italian", 
    "French", "American", "African", "Middle Eastern", "Latin American",
    "Greek", "Japanese", "Thai", "Chinese", "Spanish", "Fusion"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters: Record<string, string> = {};
    if (search) filters.search = search;
    if (category) filters.category = category;
    if (priceRange) filters.priceRange = priceRange;
    if (eventType) filters.eventType = eventType;
    if (isThemed) filters.isThemed = 'true';
    if (themeType) filters.themeType = themeType;
    if (dietary) filters.dietary = dietary;
    if (cuisine) filters.cuisine = cuisine;
    if (country) filters.country = country;
    if (region) filters.region = region;
    if (province) filters.province = province;
    if (area) filters.area = area;
    if (town) filters.town = town;
    
    onFilter({ 
      search, 
      category, 
      priceRange,
      eventType,
      isThemed,
      themeType,
      dietary,
      cuisine,
      country,
      region,
      province,
      area,
      town
    });
    
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
    setEventType("");
    setIsThemed(false);
    setThemeType("");
    setDietary("");
    setCuisine("");
    setCountry("");
    setRegion("");
    setProvince("");
    setArea("");
    setTown("");
    onFilter({});
    setLocation("/vendors");
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-base">Filter Vendors</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="search" className="text-sm">Search</Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="Search vendors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-1">
            <AccordionItem value="categories" className="border-b-0">
              <AccordionTrigger className="py-2">Categories</AccordionTrigger>
              <AccordionContent className="pt-1 pb-2">
                <div>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-8">
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

            <AccordionItem value="price" className="border-b-0">
              <AccordionTrigger className="py-2">Price Range</AccordionTrigger>
              <AccordionContent className="pt-1 pb-2">
                <div>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="h-8">
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
            
            <AccordionItem value="eventType" className="border-b-0">
              <AccordionTrigger className="py-2">Event Type</AccordionTrigger>
              <AccordionContent className="pt-1 pb-2">
                <div>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Event Type</SelectItem>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="themed" className="border-b-0">
              <AccordionTrigger className="py-2">Themed Services</AccordionTrigger>
              <AccordionContent className="pt-1 pb-2">
                <div className="space-y-2">
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id="isThemed"
                      checked={isThemed}
                      onChange={(e) => setIsThemed(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                    />
                    <label htmlFor="isThemed" className="ml-2 text-xs">
                      Show themed vendors only
                    </label>
                  </div>
                  
                  {isThemed && (
                    <div className="ml-1 pt-1 border-t border-gray-200">
                      <Label htmlFor="themeType" className="text-xs block mt-1 mb-1">Theme Type</Label>
                      <Select value={themeType} onValueChange={setThemeType}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any Theme</SelectItem>
                          {themeOptions.map((theme) => (
                            <SelectItem key={theme} value={theme}>
                              {theme}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="dietary" className="border-b-0">
              <AccordionTrigger className="py-2">Dietary Options</AccordionTrigger>
              <AccordionContent className="pt-1 pb-2">
                <div>
                  <Select value={dietary} onValueChange={setDietary}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select dietary requirement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Dietary Option</SelectItem>
                      {dietaryOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="cuisine" className="border-b-0">
              <AccordionTrigger className="py-2">Cuisine Types</AccordionTrigger>
              <AccordionContent className="pt-1 pb-2">
                <div>
                  <Select value={cuisine} onValueChange={setCuisine}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select cuisine type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Cuisine</SelectItem>
                      {cuisineOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="location" className="border-b-0">
              <AccordionTrigger className="py-2">Location</AccordionTrigger>
              <AccordionContent className="pt-1 pb-2">
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="country" className="text-xs mb-1 block">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger id="country" className="h-8">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Country</SelectItem>
                        <SelectItem value="South Africa">South Africa</SelectItem>
                        <SelectItem value="Nigeria">Nigeria</SelectItem>
                        <SelectItem value="Ghana">Ghana</SelectItem>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="Egypt">Egypt</SelectItem>
                        <SelectItem value="Morocco">Morocco</SelectItem>
                        <SelectItem value="Tanzania">Tanzania</SelectItem>
                        <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {country && (
                    <div>
                      <Label htmlFor="region" className="text-xs mb-1 block">Region</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger id="region" className="h-8">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any Region</SelectItem>
                          {country === "South Africa" && (
                            <>
                              <SelectItem value="Gauteng">Gauteng</SelectItem>
                              <SelectItem value="Western Cape">Western Cape</SelectItem>
                              <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                              <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                              <SelectItem value="Free State">Free State</SelectItem>
                              <SelectItem value="North West">North West</SelectItem>
                              <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                              <SelectItem value="Limpopo">Limpopo</SelectItem>
                              <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {region && (
                    <div>
                      <Label htmlFor="province" className="text-xs mb-1 block">Province</Label>
                      <Select value={province} onValueChange={setProvince}>
                        <SelectTrigger id="province" className="h-8">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any Province</SelectItem>
                          {/* Province options would be dynamically loaded based on region */}
                          <SelectItem value="Example Province 1">Example Province 1</SelectItem>
                          <SelectItem value="Example Province 2">Example Province 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {province && (
                    <div>
                      <Label htmlFor="area" className="text-xs mb-1 block">Area</Label>
                      <Select value={area} onValueChange={setArea}>
                        <SelectTrigger id="area" className="h-8">
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any Area</SelectItem>
                          {/* Area options would be dynamically loaded based on province */}
                          <SelectItem value="Example Area 1">Example Area 1</SelectItem>
                          <SelectItem value="Example Area 2">Example Area 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {area && (
                    <div>
                      <Label htmlFor="town" className="text-xs mb-1 block">Town</Label>
                      <Select value={town} onValueChange={setTown}>
                        <SelectTrigger id="town" className="h-8">
                          <SelectValue placeholder="Select town" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any Town</SelectItem>
                          {/* Town options would be dynamically loaded based on area */}
                          <SelectItem value="Example Town 1">Example Town 1</SelectItem>
                          <SelectItem value="Example Town 2">Example Town 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex gap-2 mt-2">
            <Button 
              type="submit" 
              className="flex-1 bg-primary text-white hover:bg-primary/90 h-8 text-sm"
            >
              Apply
            </Button>
            <Button 
              type="button" 
              onClick={handleReset} 
              variant="outline" 
              className="flex-1 border-primary text-primary hover:bg-accent h-8 text-sm"
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
