import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@shared/schema";

interface ShortlistedVendor {
  id: number;
  userId: number;
  vendorId: number;
  notes?: string;
  createdAt: Date;
  vendor: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    categoryId: number;
    priceRange: string;
    rating: number;
    reviewCount: number;
  };
}

export default function ShortlistView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: shortlists, isLoading } = useQuery<ShortlistedVendor[]>({
    queryKey: [user ? `/api/shortlists?userId=${user.id}` : null],
    enabled: !!user,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const removeMutation = useMutation({
    mutationFn: async (vendorId: number) => {
      return apiRequest('DELETE', `/api/shortlists/${user?.id}/${vendorId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/shortlists?userId=${user?.id}`] });
      toast({
        title: "Vendor removed",
        description: "The vendor has been removed from your shortlist.",
      });
    },
  });

  // Group vendors by category for tab display
  const vendorsByCategory = React.useMemo(() => {
    if (!shortlists || !categories) return {};
    
    const grouped: Record<string, ShortlistedVendor[]> = {};
    
    // Initialize with empty arrays for all categories
    categories.forEach(category => {
      grouped[category.id.toString()] = [];
    });
    
    // Add vendors to their categories
    shortlists.forEach(item => {
      const categoryId = item.vendor.categoryId.toString();
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(item);
    });
    
    return grouped;
  }, [shortlists, categories]);

  const handleRemove = (vendorId: number) => {
    removeMutation.mutate(vendorId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Shortlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border border-gray-200 rounded animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-grow">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!shortlists || shortlists.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Shortlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">Your shortlist is empty</h3>
            <p className="text-muted-foreground mb-6">Start browsing vendors and add your favorites to compare</p>
            <Link href="/vendors">
              <Button className="bg-primary text-white hover:bg-primary/90">
                Browse Vendors
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Shortlist</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="all">All ({shortlists.length})</TabsTrigger>
            {categories?.map(category => {
              const count = vendorsByCategory[category.id.toString()]?.length || 0;
              if (count === 0) return null;
              return (
                <TabsTrigger key={category.id} value={category.id.toString()}>
                  {category.name} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {shortlists.map(item => (
              <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded hover:bg-accent hover:bg-opacity-30 transition">
                <img 
                  src={item.vendor.imageUrl} 
                  className="w-16 h-16 object-cover rounded" 
                  alt={item.vendor.name} 
                />
                <div className="flex-grow">
                  <h4 className="font-medium text-base">{item.vendor.name}</h4>
                  <span className="text-xs text-muted-foreground">
                    {categories?.find(c => c.id === item.vendor.categoryId)?.name || "Vendor"} • {item.vendor.priceRange}
                  </span>
                </div>
                <div className="flex flex-col space-y-2">
                  <Link href={`/vendors/${item.vendor.id}`}>
                    <Button size="icon" variant="ghost" className="text-primary hover:text-opacity-80 transition">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-destructive hover:text-opacity-80 transition"
                    onClick={() => handleRemove(item.vendor.id)}
                    disabled={removeMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
          
          {categories?.map(category => (
            <TabsContent key={category.id} value={category.id.toString()} className="space-y-4">
              {vendorsByCategory[category.id.toString()]?.length ? (
                vendorsByCategory[category.id.toString()].map(item => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded hover:bg-accent hover:bg-opacity-30 transition">
                    <img 
                      src={item.vendor.imageUrl} 
                      className="w-16 h-16 object-cover rounded" 
                      alt={item.vendor.name} 
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium text-base">{item.vendor.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {category.name} • {item.vendor.priceRange}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Link href={`/vendors/${item.vendor.id}`}>
                        <Button size="icon" variant="ghost" className="text-primary hover:text-opacity-80 transition">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive hover:text-opacity-80 transition"
                        onClick={() => handleRemove(item.vendor.id)}
                        disabled={removeMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No vendors shortlisted in this category</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
