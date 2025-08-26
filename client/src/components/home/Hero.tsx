import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Category } from "@shared/schema";
import { Filter, Map, SortDesc, CalendarIcon, ChevronDown } from "lucide-react";

export default function Hero() {
  const [selectedServiceType, setSelectedServiceType] = useState<string>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const provinceDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (provinceDropdownRef.current && !provinceDropdownRef.current.contains(event.target as Node)) {
        setShowProvinceDropdown(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("");
  
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    retry: 3,
    retryDelay: 1000,
  });

  // Filter categories based on selected service type
  const getFilteredCategories = () => {
    if (!categories) return [];
    
    switch (selectedServiceType) {
      case "venues":
        return categories.filter(category => category.id >= 102 && category.id <= 131);
      case "vendors":
        return categories.filter(category => category.id >= 76 && category.id <= 101);
      case "service-providers":
        return categories.filter(category => category.id >= 22 && category.id <= 74);
      case "all":
      default:
        return categories.filter(category => 
          (category.id >= 22 && category.id <= 74) ||  // Service Providers
          (category.id >= 76 && category.id <= 101) || // Vendors
          (category.id >= 102 && category.id <= 131)   // Venues
        );
    }
  };

  // Province and city data
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

  // Helper functions for multi-select
  const handleProvinceChange = (province: string, checked: boolean) => {
    if (checked) {
      setSelectedProvinces([...selectedProvinces, province]);
    } else {
      setSelectedProvinces(selectedProvinces.filter(p => p !== province));
      // Remove cities from the deselected province
      const citiesToRemove = citiesByProvince[province] || [];
      setSelectedCities(selectedCities.filter(city => !citiesToRemove.includes(city)));
    }
  };

  const handleCityChange = (city: string, checked: boolean) => {
    if (checked) {
      setSelectedCities([...selectedCities, city]);
    } else {
      setSelectedCities(selectedCities.filter(c => c !== city));
    }
  };

  // Get available cities based on selected provinces
  const getAvailableCities = () => {
    if (selectedProvinces.length === 0) return [];
    return selectedProvinces.reduce((cities: string[], province) => {
      return [...cities, ...(citiesByProvince[province] || [])];
    }, []);
  };

  // Event capacity options
  const capacityOptions = [
    { value: "under_50", label: "Under 50" },
    { value: "under_200", label: "Under 200" },
    { value: "under_500", label: "Under 500" },
    { value: "under_1000", label: "Under 1000" },
    { value: "under_2000", label: "Under 2000" },
    { value: "2000_and_more", label: "2000 and More" }
  ];

  return (
    <section className="relative min-h-[600px] pb-8 bg-primary">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[600px] pt-8">
        <div className="text-center px-4 max-w-4xl w-full">
          <h1 className="text-xl md:text-2xl font-display font-bold text-white mb-4 drop-shadow-lg whitespace-nowrap">Connect, Collaborate, Celebrate</h1>
          <p className="text-white text-base md:text-lg mb-8 max-w-2xl mx-auto drop-shadow-md">Discover and book the best venues, vendors and service providers for all your events. From weddings and party celebrations, corporate functions, conferences, expos, market days, fundraisers, live concerts...and much more...</p>
          
          
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-4 mx-auto max-w-6xl" style={{ display: "block", visibility: "visible" }}>
            {/* Service Type Selector */}
            <div className="mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    setSelectedServiceType("venues");
                    setSelectedCategories([]);
                  }}
                  className={`px-3 py-2 text-sm rounded border transition-colors ${
                    selectedServiceType === "venues"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Venues
                </button>
                <button
                  onClick={() => {
                    setSelectedServiceType("vendors");
                    setSelectedCategories([]);
                  }}
                  className={`px-3 py-2 text-sm rounded border transition-colors ${
                    selectedServiceType === "vendors"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Vendors
                </button>
                <button
                  onClick={() => {
                    setSelectedServiceType("service-providers");
                    setSelectedCategories([]);
                  }}
                  className={`px-3 py-2 text-sm rounded border transition-colors ${
                    selectedServiceType === "service-providers"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Service Providers
                </button>
                <button
                  onClick={() => {
                    setSelectedServiceType("all");
                    setSelectedCategories([]);
                  }}
                  className={`px-3 py-2 text-sm rounded border transition-colors ${
                    selectedServiceType === "all"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* What are you looking for */}
              <div className="lg:col-span-1">
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full px-3 py-2 h-10 text-sm border border-gray-300 rounded focus:border-primary bg-white flex items-center justify-between text-left"
                  >
                    <span className="text-gray-900">
                      {categoriesLoading ? "Loading..." : 
                       categoriesError ? "Error loading categories" :
                       selectedCategories.length === 0 
                        ? "What are you looking for?" 
                        : selectedCategories.length === 1
                        ? getFilteredCategories()?.find(cat => (cat.slug || `category-${cat.id}`) === selectedCategories[0])?.name || selectedCategories[0]
                        : `${selectedCategories.length} services selected`}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  {showCategoryDropdown && !categoriesLoading && !categoriesError && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <label className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <Checkbox
                          checked={selectedCategories.includes("all-services")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories(["all-services"]);
                            } else {
                              setSelectedCategories(prev => prev.filter(cat => cat !== "all-services"));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">All Services</span>
                      </label>
                      {getFilteredCategories().map((category) => {
                        const categoryValue = category.slug || `category-${category.id}`;
                        return (
                          <label
                            key={category.id}
                            className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedCategories.includes(categoryValue)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCategories(prev => {
                                    // Remove "all-services" if selecting specific categories
                                    const filtered = prev.filter(cat => cat !== "all-services");
                                    return [...filtered, categoryValue];
                                  });
                                } else {
                                  setSelectedCategories(prev => prev.filter(cat => cat !== categoryValue));
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">{category.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Province Multi-Select */}
              <div className="lg:col-span-1 relative" ref={provinceDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowProvinceDropdown(!showProvinceDropdown)}
                  className="w-full px-3 py-2 h-10 text-sm border border-gray-300 rounded focus:border-primary bg-white text-left flex justify-between items-center"
                >
                  <span className="text-sm">
                    {selectedProvinces.length === 0 
                      ? "Select Provinces" 
                      : `${selectedProvinces.length} province${selectedProvinces.length > 1 ? 's' : ''} selected`}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showProvinceDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {provinces.map((province) => (
                      <label
                        key={province}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedProvinces.includes(province)}
                          onCheckedChange={(checked) => 
                            handleProvinceChange(province, checked as boolean)
                          }
                          className="mr-2"
                        />
                        <span className="text-sm">{province}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* City Multi-Select */}
              <div className="lg:col-span-1 relative" ref={cityDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="w-full px-3 py-2 h-10 text-sm border border-gray-300 rounded focus:border-primary bg-white text-left flex justify-between items-center"
                  disabled={selectedProvinces.length === 0}
                >
                  <span className="text-sm">
                    {selectedProvinces.length === 0 
                      ? "Select provinces first"
                      : selectedCities.length === 0 
                        ? "Select Cities" 
                        : `${selectedCities.length} city${selectedCities.length > 1 ? 'ies' : ''} selected`}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showCityDropdown && selectedProvinces.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {getAvailableCities().map((city) => (
                      <label
                        key={city}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedCities.includes(city)}
                          onCheckedChange={(checked) => 
                            handleCityChange(city, checked as boolean)
                          }
                          className="mr-2"
                        />
                        <span className="text-sm">{city}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Event Capacity */}
              <div className="lg:col-span-1">
                <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                  <SelectTrigger className="w-full px-3 py-2 h-10 text-sm border border-gray-300 rounded focus:border-primary bg-white">
                    <SelectValue placeholder="Event Capacity" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded shadow-lg">
                    <SelectItem value="all">All Capacities</SelectItem>
                    {capacityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Event Date Range */}
            <div className="mt-3 border-t pt-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-gray-600 whitespace-nowrap">Event Date:</span>
                
                {/* From Date */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">From:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-40 h-8 px-3 justify-start text-left font-normal bg-white border-gray-300"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {fromDate ? format(fromDate, "MMM dd") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* To Date */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">To:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-40 h-8 px-3 justify-start text-left font-normal bg-white border-gray-300"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {toDate ? format(toDate, "MMM dd") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Clear Dates */}
                {(fromDate || toDate) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setFromDate(undefined);
                      setToDate(undefined);
                    }}
                    className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear dates
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-3">
              {/* Search and Clear Buttons */}
              <div className="flex justify-center gap-3">
                <Link href={
                  selectedCategories.includes("all-services") || selectedCategories.length === 0 ? "/vendors" :
                  selectedCategories.length > 0 ? `/vendors?category=${selectedCategories.join(',')}${selectedProvinces.length > 0 ? `&provinces=${selectedProvinces.join(',')}` : ''}${selectedCities.length > 0 ? `&cities=${selectedCities.join(',')}` : ''}${selectedCapacity && selectedCapacity !== 'all' ? `&capacity=${selectedCapacity}` : ''}${fromDate ? `&fromDate=${format(fromDate, 'yyyy-MM-dd')}` : ''}${toDate ? `&toDate=${format(toDate, 'yyyy-MM-dd')}` : ''}` : "/vendors"
                }>
                  <Button className="w-48 bg-primary text-white text-sm px-4 h-10 hover:bg-primary/90 font-medium">
                    Search
                  </Button>
                </Link>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedServiceType("all");
                    setSelectedCategories([]);
                    setSelectedProvinces([]);
                    setSelectedCities([]);
                    setSelectedCapacity("");
                    setFromDate(undefined);
                    setToDate(undefined);
                    setShowCategoryDropdown(false);
                  }}
                  className="w-32 bg-white text-gray-600 text-sm px-4 h-10 border-gray-300 hover:bg-gray-50 font-medium"
                >
                  Clear All
                </Button>
              </div>
            </div>
            
            
            {/* Filter/Sort/Map strip */}
            <div className="flex gap-2 mt-4">
              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="flex-1">
                  <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-center gap-1 bg-white border-gray-300">
                    <Filter className="h-3 w-3" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/vendors?filter=capacity" className="w-full">
                      By Capacity
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/vendors?filter=rating" className="w-full">
                      By Rating
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/vendors?filter=date" className="w-full">
                      By Date
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="flex-1">
                  <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-center gap-1 bg-white border-gray-300">
                    <SortDesc className="h-3 w-3" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/vendors?sort=type" className="w-full">
                      Type
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/vendors?sort=alphabetically" className="w-full">
                      Alphabetically
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/vendors?sort=rating" className="w-full">
                      Rating
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/vendors?sort=area" className="w-full">
                      Area
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/vendors?sort=most-reviewed" className="w-full">
                      Most Reviewed
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
