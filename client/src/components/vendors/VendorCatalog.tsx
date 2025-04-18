import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageViewer } from "../ui/image-viewer";
import { Loader2 } from "lucide-react";

interface VendorCatalogProps {
  vendorId: number;
}

interface CatalogItem {
  id: number;
  vendorId: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  price?: string;
  featured: boolean;
}

export default function VendorCatalog({ vendorId }: VendorCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // This would fetch from an API endpoint in a real implementation
  // For now, we'll create some sample data
  const sampleCatalogItems: CatalogItem[] = [
    {
      id: 1,
      vendorId: vendorId,
      title: "Wedding Package Basic",
      description: "Our entry-level wedding package includes all essential services for a memorable ceremony.",
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "wedding",
      price: "R5,000+",
      featured: true
    },
    {
      id: 2, 
      vendorId: vendorId,
      title: "Premium Corporate Event",
      description: "Full-service corporate event management with premium catering and decor.",
      imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "corporate",
      price: "R15,000+",
      featured: false
    },
    {
      id: 3,
      vendorId: vendorId,
      title: "Birthday Celebration",
      description: "Make your birthday special with our custom party planning services.",
      imageUrl: "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "birthday",
      price: "R3,500+",
      featured: false
    },
    {
      id: 4,
      vendorId: vendorId,
      title: "Wedding Package Deluxe",
      description: "Our premium wedding package with all bells and whistles for your perfect day.",
      imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "wedding",
      price: "R25,000+",
      featured: true
    },
    {
      id: 5,
      vendorId: vendorId,
      title: "Anniversary Special",
      description: "Celebrate your milestone anniversary with our specially curated package.",
      imageUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "anniversary",
      price: "R7,500+",
      featured: false
    }
  ];
  
  // Get unique categories from the catalog items
  const uniqueCategories = Array.from(new Set(sampleCatalogItems.map(item => item.category)));
  const categories = ["all", ...uniqueCategories];
  
  // Filter items based on active category
  const filteredItems = activeCategory === "all" 
    ? sampleCatalogItems 
    : sampleCatalogItems.filter(item => item.category === activeCategory);

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-4">Service Catalog</h2>
      <p className="text-muted-foreground mb-6">
        Browse our range of services and packages for different events.
      </p>
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="mb-6">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <ImageViewer 
                src={item.imageUrl} 
                alt={item.title}
                className="h-48 relative"
              >
                <div className="h-full w-full relative">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="h-full w-full object-cover"
                  />
                  {item.featured && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 left-3 bg-primary text-primary-foreground"
                    >
                      Featured
                    </Badge>
                  )}
                </div>
              </ImageViewer>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                {item.price && (
                  <div className="text-sm font-medium text-muted-foreground">
                    Starting at {item.price}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Tabs>
    </div>
  );
}