import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Share2, 
  Heart, 
  AlertCircle, 
  ShoppingCart, 
  Tag, 
  Package, 
  Check, 
  Plus, 
  Trash, 
  MoreHorizontal, 
  Edit, 
  Bookmark, 
  ExternalLink 
} from 'lucide-react';

// Sample wishlist data
const sampleWishlists = [
  {
    id: 1,
    name: "Wedding Registry",
    description: "Our wedding gift wishlist",
    isPublic: true,
    itemCount: 42,
    purchased: 15,
    createdAt: new Date("2024-03-15"),
  },
  {
    id: 2,
    name: "Home Decor Ideas",
    description: "Inspiration for our new house",
    isPublic: false,
    itemCount: 28,
    purchased: 8,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: 3,
    name: "Corporate Event Vendors",
    description: "Preferred vendors for our annual gala",
    isPublic: true,
    itemCount: 12,
    purchased: 0,
    createdAt: new Date("2024-04-05"),
  }
];

// Sample wishlist items
const sampleItems = [
  {
    id: 1,
    wishlistId: 1,
    name: "KitchenAid Stand Mixer",
    description: "Professional 5 Quart in Copper Pearl",
    price: 4299,
    url: "https://example.com/stand-mixer",
    imageUrl: "https://via.placeholder.com/150",
    priority: "high",
    purchased: true,
    purchasedBy: "John & Sarah Smith",
    addedAt: new Date("2024-03-18"),
  },
  {
    id: 2,
    wishlistId: 1,
    name: "Egyptian Cotton Sheet Set",
    description: "King size, 800 thread count in white",
    price: 2199,
    url: "https://example.com/sheets",
    imageUrl: "https://via.placeholder.com/150",
    priority: "medium",
    purchased: false,
    purchasedBy: null,
    addedAt: new Date("2024-03-20"),
  },
  {
    id: 3,
    wishlistId: 1,
    name: "Le Creuset Dutch Oven",
    description: "5.5 Quart in Flame Orange",
    price: 3899,
    url: "https://example.com/dutch-oven",
    imageUrl: "https://via.placeholder.com/150",
    priority: "medium",
    purchased: true,
    purchasedBy: "The Williams Family",
    addedAt: new Date("2024-03-22"),
  },
  {
    id: 4,
    wishlistId: 1,
    name: "Robot Vacuum Cleaner",
    description: "Smart mapping and app control",
    price: 5499,
    url: "https://example.com/vacuum",
    imageUrl: "https://via.placeholder.com/150",
    priority: "low",
    purchased: false,
    purchasedBy: null,
    addedAt: new Date("2024-03-25"),
  },
  {
    id: 5,
    wishlistId: 2,
    name: "Sectional Couch",
    description: "Grey L-shaped with chaise lounge",
    price: 12999,
    url: "https://example.com/couch",
    imageUrl: "https://via.placeholder.com/150",
    priority: "high",
    purchased: false,
    purchasedBy: null,
    addedAt: new Date("2024-02-12"),
  },
  {
    id: 6,
    wishlistId: 2,
    name: "Area Rug - 8x10",
    description: "Geometric pattern in blue/grey",
    price: 3299,
    url: "https://example.com/rug",
    imageUrl: "https://via.placeholder.com/150",
    priority: "medium",
    purchased: true,
    purchasedBy: "Self-purchased",
    addedAt: new Date("2024-02-15"),
  },
];

export default function Wishlist() {
  const { toast } = useToast();
  const [selectedWishlistId, setSelectedWishlistId] = useState<number | null>(1); // Default to first wishlist
  const [isNewWishlistOpen, setIsNewWishlistOpen] = useState(false);
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form states
  const [newWishlist, setNewWishlist] = useState({
    name: '',
    description: '',
    isPublic: true,
  });
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    url: '',
    priority: 'medium',
  });

  // Get current wishlist
  const currentWishlist = sampleWishlists.find(w => w.id === selectedWishlistId);
  
  // Filter items by current wishlist and other filters
  const filteredItems = sampleItems.filter(item => {
    const matchesWishlist = item.wishlistId === selectedWishlistId;
    const matchesSearch = 
      searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesWishlist && matchesSearch;
    if (activeTab === 'purchased') return matchesWishlist && matchesSearch && item.purchased;
    if (activeTab === 'available') return matchesWishlist && matchesSearch && !item.purchased;
    
    return matchesWishlist && matchesSearch;
  });

  // Handle creating a new wishlist
  const handleCreateWishlist = () => {
    toast({
      title: "Wishlist created",
      description: `Your wishlist "${newWishlist.name}" has been created.`,
    });
    setIsNewWishlistOpen(false);
    setNewWishlist({
      name: '',
      description: '',
      isPublic: true,
    });
  };
  
  // Handle adding a new item
  const handleAddItem = () => {
    toast({
      title: "Item added",
      description: `"${newItem.name}" has been added to your wishlist.`,
    });
    setIsNewItemOpen(false);
    setNewItem({
      name: '',
      description: '',
      price: '',
      url: '',
      priority: 'medium',
    });
  };
  
  // Handle marking an item as purchased
  const handleMarkPurchased = (itemId: number, isPurchased: boolean) => {
    const itemName = sampleItems.find(i => i.id === itemId)?.name;
    toast({
      title: isPurchased ? "Item marked as purchased" : "Item marked as available",
      description: `"${itemName}" has been updated.`,
    });
  };
  
  // Handle sharing a wishlist
  const handleShareWishlist = () => {
    navigator.clipboard.writeText(`https://howzeventz.com/wishlist/${selectedWishlistId}`);
    toast({
      title: "Link copied",
      description: "Wishlist link has been copied to clipboard.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Wishlists - HowzEventz</title>
      </Helmet>
      
      <div className="bg-neutral min-h-screen py-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Wishlists</h1>
              <p className="text-muted-foreground">Create and manage your wishlists and gift registries</p>
            </div>
            <div className="flex mt-4 md:mt-0">
              <Button onClick={() => setIsNewWishlistOpen(true)} className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Create Wishlist
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-4">
            {/* Wishlist selection sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">My Wishlists</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-0">
                  {sampleWishlists.map((wishlist) => (
                    <div
                      key={wishlist.id}
                      className={`px-6 py-3 cursor-pointer hover:bg-muted flex items-center justify-between ${
                        selectedWishlistId === wishlist.id ? 'bg-muted font-medium' : ''
                      }`}
                      onClick={() => setSelectedWishlistId(wishlist.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${wishlist.isPublic ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <span>{wishlist.name}</span>
                      </div>
                      <Badge>{wishlist.itemCount}</Badge>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="pt-3">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setIsNewWishlistOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Wishlist
                  </Button>
                </CardFooter>
              </Card>
              
              {currentWishlist && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Wishlist Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${currentWishlist.isPublic ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <span className="text-sm">{currentWishlist.isPublic ? 'Public' : 'Private'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm">{currentWishlist.createdAt.toLocaleDateString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Items</p>
                      <p className="text-sm">{currentWishlist.itemCount} items ({currentWishlist.purchased} purchased)</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full" onClick={handleShareWishlist}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Wishlist
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Wishlist items main content */}
            <div className="md:col-span-3">
              {currentWishlist ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{currentWishlist.name}</CardTitle>
                        <CardDescription>{currentWishlist.description}</CardDescription>
                      </div>
                      
                      <Button onClick={() => setIsNewItemOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                        <TabsList>
                          <TabsTrigger value="all">All Items</TabsTrigger>
                          <TabsTrigger value="available">Available</TabsTrigger>
                          <TabsTrigger value="purchased">Purchased</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      
                      <Input 
                        placeholder="Search items..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredItems.map((item) => (
                        <Card key={item.id} className={item.purchased ? 'bg-muted/50' : ''}>
                          <div className="relative">
                            <div className={`absolute top-2 right-2 z-10 rounded-full p-1 ${
                              item.priority === 'high' ? 'bg-red-100 text-red-700' : 
                              item.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 
                              'bg-green-100 text-green-700'
                            }`}>
                              <Tag className="h-4 w-4" />
                            </div>
                            <div className="h-48 bg-muted rounded-t-lg flex items-center justify-center overflow-hidden">
                              {item.imageUrl ? (
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <Package className="h-12 w-12 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          
                          <CardContent className="pt-4">
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{item.name}</h3>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => window.open(item.url, '_blank')}>
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      View Item
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Item
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Trash className="mr-2 h-4 w-4" />
                                      Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                              <p className="text-base font-medium pt-1">R{item.price.toLocaleString()}</p>
                            </div>
                          </CardContent>
                          
                          <CardFooter className="pt-0">
                            {item.purchased ? (
                              <div className="w-full">
                                <Badge className="w-full justify-center bg-green-100 text-green-700 hover:bg-green-200">
                                  <Check className="mr-1 h-3 w-3" />
                                  Purchased
                                </Badge>
                                {item.purchasedBy && (
                                  <p className="text-xs text-center mt-2 text-muted-foreground">
                                    by {item.purchasedBy}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="w-full flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => window.open(item.url, '_blank')}
                                >
                                  <ExternalLink className="mr-2 h-3 w-3" />
                                  View
                                </Button>
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => handleMarkPurchased(item.id, true)}
                                >
                                  <Check className="mr-2 h-3 w-3" />
                                  Mark Purchased
                                </Button>
                              </div>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                      
                      {filteredItems.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12">
                          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No items found</h3>
                          <p className="text-muted-foreground text-center mt-2">
                            {searchQuery ? 
                              "Try changing your search terms or filters" : 
                              "This wishlist is empty. Add some items to get started!"}
                          </p>
                          {!searchQuery && (
                            <Button onClick={() => setIsNewItemOpen(true)} className="mt-4">
                              <Plus className="mr-2 h-4 w-4" />
                              Add First Item
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="flex flex-col items-center justify-center p-12">
                  <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No wishlist selected</h3>
                  <p className="text-muted-foreground text-center mt-2">
                    Select a wishlist from the left or create a new one
                  </p>
                  <Button onClick={() => setIsNewWishlistOpen(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Wishlist
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Create New Wishlist Dialog */}
      <Dialog open={isNewWishlistOpen} onOpenChange={setIsNewWishlistOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Wishlist</DialogTitle>
            <DialogDescription>
              Create a new wishlist or gift registry to share with friends and family.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Wishlist Name
              </label>
              <Input
                id="name"
                value={newWishlist.name}
                onChange={(e) => setNewWishlist({...newWishlist, name: e.target.value})}
                placeholder="e.g., Wedding Registry, Birthday Wishlist"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Input
                id="description"
                value={newWishlist.description}
                onChange={(e) => setNewWishlist({...newWishlist, description: e.target.value})}
                placeholder="Add a short description"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-public"
                checked={newWishlist.isPublic}
                onChange={(e) => setNewWishlist({...newWishlist, isPublic: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="is-public" className="text-sm font-medium">
                Make this wishlist public and shareable
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateWishlist}>Create Wishlist</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add New Item Dialog */}
      <Dialog open={isNewItemOpen} onOpenChange={setIsNewItemOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Item to Wishlist</DialogTitle>
            <DialogDescription>
              Add a new item to your wishlist.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="item-name" className="text-sm font-medium">
                Item Name
              </label>
              <Input
                id="item-name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="e.g., KitchenAid Stand Mixer"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="item-description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Input
                id="item-description"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                placeholder="e.g., 5-Quart Artisan in Red"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="item-price" className="text-sm font-medium">
                Price (R)
              </label>
              <Input
                id="item-price"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                placeholder="e.g., 4999"
                type="number"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="item-url" className="text-sm font-medium">
                Link to Item (Optional)
              </label>
              <Input
                id="item-url"
                value={newItem.url}
                onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                placeholder="https://example.com/product"
                type="url"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="item-priority" className="text-sm font-medium">
                Priority
              </label>
              <select
                id="item-priority"
                value={newItem.priority}
                onChange={(e) => setNewItem({...newItem, priority: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}