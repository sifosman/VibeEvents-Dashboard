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
            
            <AccordionItem value="eventType">
              <AccordionTrigger>Event Type</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Event Type</SelectItem>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="themed">
              <AccordionTrigger>Themed Services</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isThemed"
                      checked={isThemed}
                      onChange={(e) => setIsThemed(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                    />
                    <label htmlFor="isThemed" className="ml-2 text-sm">
                      Show themed vendors only
                    </label>
                  </div>
                  
                  {isThemed && (
                    <div className="ml-2 pt-2 border-t border-gray-200">
                      <Label htmlFor="themeType" className="mb-2 block text-sm">Theme Type</Label>
                      <Select value={themeType} onValueChange={setThemeType}>
                        <SelectTrigger>
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
            
            <AccordionItem value="dietary">
              <AccordionTrigger>Dietary Options</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Select value={dietary} onValueChange={setDietary}>
                    <SelectTrigger>
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
            
            <AccordionItem value="cuisine">
              <AccordionTrigger>Cuisine Types</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Select value={cuisine} onValueChange={setCuisine}>
                    <SelectTrigger>
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
            
            <AccordionItem value="location">
              <AccordionTrigger>Location</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger id="country">
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
                    <div className="space-y-2">
                      <Label htmlFor="region" className="text-sm">Region</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger id="region">
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
                    <div className="space-y-2">
                      <Label htmlFor="province" className="text-sm">Province</Label>
                      <Select value={province} onValueChange={setProvince}>
                        <SelectTrigger id="province">
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
                    <div className="space-y-2">
                      <Label htmlFor="area" className="text-sm">Area</Label>
                      <Select value={area} onValueChange={setArea}>
                        <SelectTrigger id="area">
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
                    <div className="space-y-2">
                      <Label htmlFor="town" className="text-sm">Town</Label>
                      <Select value={town} onValueChange={setTown}>
                        <SelectTrigger id="town">
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
