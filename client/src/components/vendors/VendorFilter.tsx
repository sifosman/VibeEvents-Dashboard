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
    province?: string;
    city?: string;
    vendorTag?: string;
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
    province?: string;
    city?: string;
    vendorTag?: string;
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
  const [province, setProvince] = useState(initialFilters.province || "");
  const [city, setCity] = useState(initialFilters.city || "");
  const [vendorTag, setVendorTag] = useState(initialFilters.vendorTag || "");

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
  
  const vendorTagOptions = [
    "Caterer", "Florist", "Photographer", "Videographer", "DJ", 
    "Live Band", "Decor", "Wedding Planner", "Venue", "Cake Baker",
    "Hair Stylist", "Makeup Artist", "Transportation", "Lighting",
    "Sound System", "Security", "Cleaning", "Event Planner", "Bartender",
    "Officiant", "Invitation Designer", "Jewelry", "Dress Designer",
    "Rental Service", "Photo Booth", "Entertainment"
  ];

  const provinces = [
    "Western Cape",
    "Eastern Cape",
    "Northern Cape",
    "Free State",
    "KwaZulu-Natal",
    "North West",
    "Gauteng",
    "Mpumalanga",
    "Limpopo"
  ];

  const citiesByProvince: { [key: string]: string[] } = {
    "Western Cape": ["Cape Town", "Stellenbosch", "Paarl", "George", "Mossel Bay"],
    "Eastern Cape": ["Port Elizabeth", "East London", "Uitenhage", "Grahamstown", "King William's Town"],
    "Northern Cape": ["Kimberley", "Upington", "Kuruman", "Springbok", "De Aar"],
    "Free State": ["Bloemfontein", "Welkom", "Kroonstad", "Bethlehem", "Sasolburg"],
    "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Newcastle", "Richards Bay", "Ladysmith"],
    "North West": ["Mahikeng", "Klerksdorp", "Rustenburg", "Potchefstroom", "Vryburg"],
    "Gauteng": ["Johannesburg", "Pretoria", "Soweto", "Vanderbijlpark", "Kempton Park"],
    "Mpumalanga": ["Nelspruit", "Witbank", "Middelburg", "Secunda", "Standerton"],
    "Limpopo": ["Polokwane", "Tzaneen", "Phalaborwa", "Musina", "Thohoyandou"]
  };

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
    if (province) filters.province = province;
    if (city) filters.city = city;
    if (vendorTag) filters.vendorTag = vendorTag;
    
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
      province,
      city,
      vendorTag
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
    setProvince("");
    setCity("");
    setVendorTag("");
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
            
            <AccordionItem value="vendorType" className="border-b-0">
              <AccordionTrigger className="py-2">Vendor Type</AccordionTrigger>
              <AccordionContent className="pt-1 pb-2">
                <div>
                  <Select value={vendorTag} onValueChange={setVendorTag}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select vendor type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Vendor Type</SelectItem>
                      {vendorTagOptions.map((option) => (
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
                    <Select value={country} onValueChange={(value) => {
                      setCountry(value);
                      setProvince("");
                      setCity("");
                    }}>
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
                  
                  {country === "South Africa" && (
                    <div>
                      <Label htmlFor="province" className="text-xs mb-1 block">Province</Label>
                      <Select value={province} onValueChange={(value) => {
                        setProvince(value);
                        setCity("");
                      }}>
                        <SelectTrigger id="province" className="h-8">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any Province</SelectItem>
                          {provinces.map((prov) => (
                            <SelectItem key={prov} value={prov}>
                              {prov}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {province && citiesByProvince[province] && (
                    <div>
                      <Label htmlFor="city" className="text-xs mb-1 block">City</Label>
                      <Select 
                        value={city} 
                        onValueChange={setCity}
                        disabled={!province}
                      >
                        <SelectTrigger id="city" className="h-8">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any City</SelectItem>
                          {citiesByProvince[province].map((cityName) => (
                            <SelectItem key={cityName} value={cityName}>
                              {cityName}
                            </SelectItem>
                          ))}
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
