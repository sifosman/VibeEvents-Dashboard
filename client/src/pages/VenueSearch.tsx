import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category, Vendor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { VendorCard } from "../components/vendors/VendorCard";
import { Helmet } from "react-helmet";
import { ChevronDown, Filter, MapPin, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// South African provinces and their cities
const PROVINCES_CITIES = {
  "Eastern Cape": ["Port Elizabeth", "East London", "Grahamstown", "King William's Town", "Mthatha", "Queenstown"],
  "Free State": ["Bloemfontein", "Welkom", "Kroonstad", "Bethlehem", "Sasolburg", "Phuthaditjhaba"],
  "Gauteng": ["Johannesburg", "Pretoria", "Soweto", "Sandton", "Randburg", "Roodepoort", "Benoni", "Boksburg", "Germiston", "Kempton Park", "Springs", "Vanderbijlpark", "Vereeniging", "Centurion", "Alberton", "Edenvale"],
  "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Newcastle", "Pinetown", "Chatsworth", "Umlazi", "Port Shepstone", "Margate", "Ladysmith", "Richards Bay", "Empangeni"],
  "Limpopo": ["Polokwane", "Thohoyandou", "Tzaneen", "Phalaborwa", "Musina", "Louis Trichardt"],
  "Mpumalanga": ["Nelspruit", "Witbank", "Secunda", "Middelburg", "Standerton", "Ermelo"],
  "Northern Cape": ["Kimberley", "Upington", "Kuruman", "Springbok", "Alexander Bay"],
  "North West": ["Mafikeng", "Rustenburg", "Klerksdorp", "Potchefstroom", "Brits"],
  "Western Cape": ["Cape Town", "George", "Mossel Bay", "Paarl", "Stellenbosch", "Worcester", "Hermanus", "Oudtshoorn", "Knysna", "Plettenberg Bay", "Somerset West", "Strand", "Bellville", "Goodwood", "Parow", "Wynberg"]
};

const CAPACITY_OPTIONS = [
  { value: "under_50", label: "Under 50" },
  { value: "under_200", label: "Under 200" },
  { value: "under_500", label: "Under 500" },
  { value: "under_1000", label: "Under 1000" },
  { value: "2000_and_more", label: "2000 and More" }
];


interface VenueSearchProps {
  categoryId: number;
}

export default function VenueSearch({ categoryId }: VenueSearchProps) {
  const [selectedCapacity, setSelectedCapacity] = useState<string>("");
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const { data: category } = useQuery<Category>({
    queryKey: ['/api/categories', categoryId],
    queryFn: async () => {
      const res = await fetch(`/api/categories/${categoryId}`);
      if (!res.ok) throw new Error('Failed to fetch category');
      return res.json();
    }
  });

  const { data: venues, isLoading } = useQuery<Vendor[]>({
    queryKey: ['/api/venues/search', {
      categoryId,
      capacity: selectedCapacity,
      provinces: selectedProvinces,
      cities: selectedCities
    }],
    queryFn: async () => {
      const params = new URLSearchParams({
        categoryId: categoryId.toString(),
        capacity: selectedCapacity,
        provinces: selectedProvinces.join(','),
        cities: selectedCities.join(',')
      });
      
      const res = await fetch(`/api/venues/search?${params}`);
      if (!res.ok) throw new Error('Failed to fetch venues');
      return res.json();
    }
  });

  const toggleProvince = (province: string) => {
    setSelectedProvinces(prev => 
      prev.includes(province) 
        ? prev.filter(p => p !== province)
        : [...prev, province]
    );
  };

  const toggleCity = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  // Get available cities based on selected provinces
  const getAvailableCities = () => {
    if (selectedProvinces.length === 0) {
      return Object.values(PROVINCES_CITIES).flat().sort();
    }
    return selectedProvinces
      .flatMap(province => PROVINCES_CITIES[province as keyof typeof PROVINCES_CITIES] || [])
      .sort();
  };

  return (
    <>
      <Helmet>
        <title>{category?.name ? `${category.name} Search` : 'Venue Search'} | HowzEventz</title>
        <meta name="description" content={`Find ${category?.name?.toLowerCase() || 'venues'} for your event`} />
      </Helmet>

      <div className="container-custom py-8">
        <div className="mb-6">
          <Link href="/browse-categories">
            <Button variant="outline" className="mb-4">
              ← Back to Categories
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{category?.name}</h1>
          <p className="text-muted-foreground">Find the perfect venue for your event</p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <h3 className="font-semibold">Search Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Venue Capacity */}
            <div>
              <label className="block text-sm font-medium mb-2">Venue Capacity</label>
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="search-dropdown"
              >
                <option value="">Any Capacity</option>
                {CAPACITY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Province */}
            <div>
              <label className="block text-sm font-medium mb-2">Province</label>
              <div className="relative">
                <button
                  onClick={() => setShowProvinceDropdown(!showProvinceDropdown)}
                  className="search-dropdown-button"
                >
                  <span className="text-sm">
                    {selectedProvinces.length === 0 
                      ? "Any Province" 
                      : `${selectedProvinces.length} selected`}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showProvinceDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {Object.keys(PROVINCES_CITIES).map(province => (
                      <label
                        key={province}
                        className="search-dropdown-item"
                      >
                        <Checkbox
                          checked={selectedProvinces.includes(province)}
                          onCheckedChange={() => toggleProvince(province)}
                          className="mr-2"
                        />
                        <span className="text-sm">{province}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Town/City */}
            <div>
              <label className="block text-sm font-medium mb-2">Town/City</label>
              <div className="relative">
                <button
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="search-dropdown-button"
                >
                  <span className="text-sm">
                    {selectedCities.length === 0 
                      ? "Any City" 
                      : `${selectedCities.length} selected`}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showCityDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {getAvailableCities().map(city => (
                      <label
                        key={city}
                        className="search-dropdown-item"
                      >
                        <Checkbox
                          checked={selectedCities.includes(city)}
                          onCheckedChange={() => toggleCity(city)}
                          className="mr-2"
                        />
                        <span className="text-sm">{city}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {venues ? `${venues.length} venues found` : 'Searching venues...'}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[4/3] rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : venues && venues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <VendorCard key={venue.id} vendor={venue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
              <p className="text-gray-600">Try adjusting your search filters to find more venues.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}