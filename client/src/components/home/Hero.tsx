import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Category } from "@shared/schema";
import SouthAfricanBadge from "../shared/SouthAfricanBadge";
import { Filter, Map, SortDesc } from "lucide-react";

export default function Hero() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchByName, setSearchByName] = useState<string>("");
  const [searchByArea, setSearchByArea] = useState<string>("");
  const [selectedCapacity, setSelectedCapacity] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("");
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Sample areas for the dropdown
  const areas = [
    "Cape Town", "Johannesburg", "Durban", "Pretoria", "Port Elizabeth", 
    "Bloemfontein", "East London", "Pietermaritzburg", "Kimberley", "Polokwane"
  ];

  // Event capacity options
  const capacityOptions = [
    { value: "under_50", label: "Under 50" },
    { value: "under_200", label: "Under 200" },
    { value: "under_500", label: "Under 500" },
    { value: "under_1000", label: "Under 1000" },
    { value: "2000_and_more", label: "2000 and More" }
  ];

  return (
    <section className="relative h-[400px] bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4 max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Venues, Vendors, Vibes</h1>
          <p className="text-white text-sm md:text-base mb-5 max-w-xl mx-auto">Discover and book the best service providers for all your events - wedding and party celebrations, corporate functions, market days, expos, fundraisers, live concerts...and much more</p>
          
          
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-4 mx-auto max-w-6xl" style={{ display: "block", visibility: "visible" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* What are you looking for */}
              <div className="lg:col-span-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full px-3 py-2 h-10 text-sm border border-gray-300 rounded focus:border-primary bg-white">
                    <SelectValue placeholder="What are you looking for?" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded shadow-lg">
                    <SelectItem value="all-services">All Services</SelectItem>
                    {categories?.filter((category) => 
                      (category.id >= 22 && category.id <= 74) ||  // Service Providers
                      (category.id >= 76 && category.id <= 101) || // Vendors
                      (category.id >= 102 && category.id <= 131)   // Venues
                    ).map((category) => (
                      <SelectItem key={category.id} value={category.slug || `category-${category.id}`}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Province */}
              <div className="lg:col-span-1">
                <Select value={searchByArea} onValueChange={setSearchByArea}>
                  <SelectTrigger className="w-full px-3 py-2 h-10 text-sm border border-gray-300 rounded focus:border-primary bg-white">
                    <SelectValue placeholder="Province" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded shadow-lg">
                    <SelectItem value="all">All Provinces</SelectItem>
                    <SelectItem value="gauteng">Gauteng</SelectItem>
                    <SelectItem value="western-cape">Western Cape</SelectItem>
                    <SelectItem value="kwazulu-natal">KwaZulu-Natal</SelectItem>
                    <SelectItem value="eastern-cape">Eastern Cape</SelectItem>
                    <SelectItem value="limpopo">Limpopo</SelectItem>
                    <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                    <SelectItem value="north-west">North West</SelectItem>
                    <SelectItem value="northern-cape">Northern Cape</SelectItem>
                    <SelectItem value="free-state">Free State</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div className="lg:col-span-1">
                <Select value={searchByName} onValueChange={setSearchByName}>
                  <SelectTrigger className="w-full px-3 py-2 h-10 text-sm border border-gray-300 rounded focus:border-primary bg-white">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded shadow-lg">
                    <SelectItem value="all">All Cities</SelectItem>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area.toLowerCase().replace(' ', '-')}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              {/* Search Button */}
              <div className="lg:col-span-1">
                <Link href={
                  selectedCategory === "all-services" ? "/vendors" :
                  selectedCategory ? `/vendors?category=${selectedCategory}${searchByName && searchByName !== 'all' ? `&name=${searchByName}` : ''}${searchByArea && searchByArea !== 'all' ? `&area=${searchByArea}` : ''}${selectedCapacity && selectedCapacity !== 'all' ? `&capacity=${selectedCapacity}` : ''}` : "/vendors"
                }>
                  <Button className="w-full bg-primary text-white text-sm px-4 h-10 hover:bg-primary/90 font-medium">
                    Search
                  </Button>
                </Link>
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
              
              {/* Map Link */}
              <Link href="/map" className="flex-1">
                <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-center gap-1 bg-white border-gray-300">
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
