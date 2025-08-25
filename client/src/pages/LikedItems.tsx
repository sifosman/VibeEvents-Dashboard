import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shortlist, Vendor } from '@shared/schema';
import { Link } from 'wouter';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const LikedItems: React.FC = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<number | null>(null);
  
  // Get current user
  useEffect(() => {
    // Temporary solution until auth is fully implemented
    // In a real implementation, this would come from auth context
    setUserId(1); // Using a placeholder user ID
  }, []);
  
  // Fetch liked items (shortlisted items)
  const { data: likedItems, isLoading, isError, refetch } = useQuery<(Shortlist & { vendor: Vendor })[]>({
    queryKey: ['/api/shortlists', userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(`/api/shortlists?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch liked items');
      }
      return response.json();
    },
    enabled: !!userId,
  });

  // Handle unlike (remove from shortlist)
  const handleUnlike = async (vendorId: number) => {
    if (!userId) return;
    
    try {
      await apiRequest('DELETE', `/api/shortlists/${userId}/${vendorId}`);
      
      toast({
        title: 'Removed from likes',
        description: 'Vendor has been removed from your liked items',
      });
      
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove vendor from likes',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/20 p-4 rounded-md text-center">
          <h2 className="text-xl font-bold text-destructive">Error loading your favourites</h2>
          <p>Please try again later</p>
          <Button onClick={() => refetch()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Favourites</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link to="/">Explore More</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/planner-dashboard">Go to Planner</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All ({likedItems?.length || 0})</TabsTrigger>
          {/* Add category-specific tabs if needed in the future */}
        </TabsList>

        <TabsContent value="all">
          {likedItems && likedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedItems.map((item) => (
                <Card key={item.id} className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.vendor.imageUrl} 
                      alt={item.vendor.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 opacity-90 hover:opacity-100"
                      onClick={() => handleUnlike(item.vendor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span>{item.vendor.name}</span>
                      <div className="flex items-center text-sm">
                        <span className="text-amber-500 mr-1">★</span>
                        <span>{item.vendor.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground ml-1">({item.vendor.reviewCount})</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pb-4 flex-grow">
                    <p className="text-muted-foreground text-sm mb-2">
                      {getCategoryName(item.vendor.categoryId)}
                    </p>
                    <p className="line-clamp-3 text-sm">{item.vendor.description}</p>
                    
                    {item.notes && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <h4 className="text-sm font-medium mb-1">Your Notes:</h4>
                        <p className="text-sm italic">{item.notes}</p>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/vendors/${item.vendor.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Favourites Yet</h2>
              <p className="text-muted-foreground mb-6">
                As you explore vendors, click the heart icon to add them to your favourites
              </p>
              <Button asChild>
                <Link to="/">Discover Vendors</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to get category name (this would be replaced with proper category fetching)
function getCategoryName(categoryId: number): string {
  const categories: Record<number, string> = {
    1: 'Venues',
    2: 'Catering',
    3: 'Photography',
    4: 'Decoration',
    5: 'Entertainment',
    // Add more as needed
  };
  return categories[categoryId] || 'Other';
}

export default LikedItems;