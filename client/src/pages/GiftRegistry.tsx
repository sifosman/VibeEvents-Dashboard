import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  PlusCircle, 
  Trash, 
  Gift, 
  Share2, 
  LucideIcon, 
  ShoppingCart, 
  Link, 
  Pencil, 
  Copy, 
  CheckCircle2, 
  Search,
  DollarSign,
  Store,
  Heart,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample event data
const events = [
  { id: 1, name: "Sarah & Michael's Wedding", date: "June 15, 2025" },
  { id: 2, name: "Emily's 30th Birthday", date: "September 10, 2024" },
  { id: 3, name: "Baby Shower for Jessica", date: "December 5, 2024" },
];

// Sample gift categories
const categories = [
  { id: 1, name: "Kitchen" },
  { id: 2, name: "Living Room" },
  { id: 3, name: "Bedroom" },
  { id: 4, name: "Bathroom" },
  { id: 5, name: "Dining" },
  { id: 6, name: "Electronics" },
  { id: 7, name: "Honeymoon Fund" },
  { id: 8, name: "Charity Donations" },
  { id: 9, name: "Experiences" },
];

// Sample gift items
const initialGifts = [
  { 
    id: 1, 
    name: "KitchenAid Stand Mixer", 
    price: 3499.99, 
    description: "Professional 5-quart mixer in Silver",
    category: "Kitchen",
    priority: "high",
    url: "https://www.example.com/mixer",
    image: "https://placehold.co/300x200",
    purchasedBy: null,
    received: true,
    thanked: false,
    quantity: 1,
    minimumContribution: null,
    currentContribution: null,
    isGroupGift: false,
    contributors: [],
  },
  { 
    id: 2, 
    name: "Cash Fund for Honeymoon", 
    price: 20000, 
    description: "Help us enjoy our dream honeymoon in Bali!",
    category: "Honeymoon Fund",
    priority: "high",
    url: null,
    image: "https://placehold.co/300x200",
    purchasedBy: null,
    received: false,
    thanked: false,
    quantity: 1,
    minimumContribution: 500,
    currentContribution: 8500,
    isGroupGift: true,
    contributors: [
      { name: "John & Mary Smith", amount: 2000 },
      { name: "David Wilson", amount: 1500 },
      { name: "Emma Thompson", amount: 5000 },
    ],
  },
  { 
    id: 3, 
    name: "Le Creuset Dutch Oven", 
    price: 4950, 
    description: "5.5-quart round dutch oven in Flame orange",
    category: "Kitchen",
    priority: "medium",
    url: "https://www.example.com/dutchoven",
    image: "https://placehold.co/300x200",
    purchasedBy: "Aunt Jenna",
    received: true,
    thanked: true,
    quantity: 1,
    minimumContribution: null,
    currentContribution: null,
    isGroupGift: false,
    contributors: [],
  },
  { 
    id: 4, 
    name: "Dyson Vacuum Cleaner", 
    price: 5499, 
    description: "V11 Cordless Vacuum",
    category: "Electronics",
    priority: "medium",
    url: "https://www.example.com/vacuum",
    image: "https://placehold.co/300x200",
    purchasedBy: "The Wilson Family",
    received: false,
    thanked: false,
    quantity: 1,
    minimumContribution: null,
    currentContribution: null,
    isGroupGift: false,
    contributors: [],
  },
  { 
    id: 5, 
    name: "Luxury Egyptian Cotton Towel Set", 
    price: 1299, 
    description: "Set of 6 premium towels in white",
    category: "Bathroom",
    priority: "low",
    url: "https://www.example.com/towels",
    image: "https://placehold.co/300x200",
    purchasedBy: null,
    received: false,
    thanked: false,
    quantity: 2,
    minimumContribution: null,
    currentContribution: null,
    isGroupGift: false,
    contributors: [],
  },
  { 
    id: 6, 
    name: "Donation to Wildlife Conservation", 
    price: 5000, 
    description: "Help us support wildlife conservation efforts",
    category: "Charity Donations",
    priority: "medium",
    url: "https://www.example.com/wildlife",
    image: "https://placehold.co/300x200",
    purchasedBy: null,
    received: false,
    thanked: false,
    quantity: 1,
    minimumContribution: 200,
    currentContribution: 1800,
    isGroupGift: true,
    contributors: [
      { name: "Robert Johnson", amount: 1000 },
      { name: "Lisa Brown", amount: 500 },
      { name: "Mark Taylor", amount: 300 },
    ],
  },
];

export default function GiftRegistry() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("items");
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [gifts, setGifts] = useState(initialGifts);
  const [sortBy, setSortBy] = useState("priority");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for new gift item form
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    priority: "medium",
    url: "",
    image: "",
    isGroupGift: false,
    minimumContribution: "",
    quantity: "1",
  });
  
  // Filter and sort gifts
  const filteredGifts = gifts.filter(gift => {
    // Filter by category
    if (filterCategory !== "all" && gift.category !== filterCategory) return false;
    
    // Filter by status
    if (filterStatus === "purchased" && !gift.purchasedBy) return false;
    if (filterStatus === "available" && gift.purchasedBy) return false;
    if (filterStatus === "received" && !gift.received) return false;
    
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        gift.name.toLowerCase().includes(query) ||
        gift.description.toLowerCase().includes(query) ||
        gift.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  }).sort((a, b) => {
    // Sort function
    const direction = sortDirection === "asc" ? 1 : -1;
    
    if (sortBy === "price") {
      return direction * (a.price - b.price);
    }
    
    if (sortBy === "name") {
      return direction * a.name.localeCompare(b.name);
    }
    
    if (sortBy === "priority") {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return direction * (priorityWeight[a.priority as keyof typeof priorityWeight] - priorityWeight[b.priority as keyof typeof priorityWeight]);
    }
    
    return 0;
  });
  
  // Stats
  const stats = {
    total: gifts.length,
    purchased: gifts.filter(g => g.purchasedBy).length,
    received: gifts.filter(g => g.received).length,
    available: gifts.filter(g => !g.purchasedBy).length,
    totalValue: gifts.reduce((sum, gift) => sum + gift.price, 0),
    receivedValue: gifts.filter(g => g.received).reduce((sum, gift) => sum + gift.price, 0),
  };
  
  // Handle adding a new gift item
  const handleAddItem = () => {
    // Validation
    if (!newItem.name || !newItem.price) {
      toast({
        title: "Missing information",
        description: "Please provide at least a name and price for the item",
        variant: "destructive",
      });
      return;
    }
    
    // Add new item
    const newGift = {
      id: gifts.length + 1,
      name: newItem.name,
      price: parseFloat(newItem.price),
      description: newItem.description,
      category: newItem.category,
      priority: newItem.priority,
      url: newItem.url || null,
      image: newItem.image || "https://placehold.co/300x200",
      purchasedBy: null,
      received: false,
      thanked: false,
      quantity: parseInt(newItem.quantity),
      minimumContribution: newItem.isGroupGift ? parseFloat(newItem.minimumContribution) : null,
      currentContribution: newItem.isGroupGift ? 0 : null,
      isGroupGift: newItem.isGroupGift,
      contributors: [],
    };
    
    setGifts([...gifts, newGift]);
    
    // Reset form and close dialog
    setNewItem({
      name: "",
      price: "",
      description: "",
      category: "",
      priority: "medium",
      url: "",
      image: "",
      isGroupGift: false,
      minimumContribution: "",
      quantity: "1",
    });
    
    setIsAddItemOpen(false);
    
    toast({
      title: "Gift added",
      description: `${newItem.name} has been added to your registry`,
    });
  };
  
  // Handle editing a gift item
  const handleEditItem = () => {
    if (!selectedItem) return;
    
    const updatedGifts = gifts.map(gift => 
      gift.id === selectedItem.id ? selectedItem : gift
    );
    
    setGifts(updatedGifts);
    setIsEditItemOpen(false);
    
    toast({
      title: "Gift updated",
      description: `${selectedItem.name} has been updated`,
    });
  };
  
  // Handle deleting a gift item
  const handleDeleteItem = (itemId: number) => {
    const itemToDelete = gifts.find(gift => gift.id === itemId);
    
    if (!itemToDelete) return;
    
    setGifts(gifts.filter(gift => gift.id !== itemId));
    
    toast({
      title: "Gift removed",
      description: `${itemToDelete.name} has been removed from your registry`,
      variant: "destructive",
    });
  };
  
  // Handle toggling received status
  const handleToggleReceived = (itemId: number, received: boolean) => {
    const updatedGifts = gifts.map(gift => 
      gift.id === itemId ? { ...gift, received } : gift
    );
    
    setGifts(updatedGifts);
    
    const item = gifts.find(gift => gift.id === itemId);
    
    toast({
      title: received ? "Gift marked as received" : "Gift marked as not received",
      description: `${item?.name} has been ${received ? 'marked as received' : 'unmarked as received'}`,
    });
  };
  
  // Handle toggling thanked status
  const handleToggleThanked = (itemId: number, thanked: boolean) => {
    const updatedGifts = gifts.map(gift => 
      gift.id === itemId ? { ...gift, thanked } : gift
    );
    
    setGifts(updatedGifts);
    
    const item = gifts.find(gift => gift.id === itemId);
    
    toast({
      title: thanked ? "Thank you note sent" : "Thank you note pending",
      description: `${item?.name} has been ${thanked ? 'marked as thanked' : 'unmarked as thanked'}`,
    });
  };
  
  // Handle copying registry link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://example.com/registry/${selectedEvent.id}`);
    
    toast({
      title: "Link copied",
      description: "Registry link has been copied to clipboard",
    });
  };
  
  // Toggle sort direction
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };
  
  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gift Registry</h1>
          <p className="text-muted-foreground">
            Create and manage your registry for upcoming events
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Select 
            value={selectedEvent.id.toString()} 
            onValueChange={(value) => setSelectedEvent(events.find(e => e.id.toString() === value) || events[0])}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id.toString()}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={() => setIsAddItemOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Gift
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar with stats */}
        <div className="w-full lg:w-1/4 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Registry Details</CardTitle>
              <CardDescription>{selectedEvent.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Event Date:</span>
                <span className="font-medium">{selectedEvent.date}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Items:</span>
                <span className="font-medium">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Available:</span>
                <span className="font-medium">{stats.available}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Purchased:</span>
                <span className="font-medium">{stats.purchased}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Received:</span>
                <span className="font-medium">{stats.received}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Value:</span>
                <span className="font-medium">R{stats.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Received Value:</span>
                <span className="font-medium">R{stats.receivedValue.toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button variant="outline" className="w-full" onClick={handleCopyLink}>
                <Link className="h-4 w-4 mr-2" />
                Copy Registry Link
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share Registry
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Gift Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-0">
              <div className="grid divide-y divide-border">
                <button 
                  className={`flex justify-between items-center px-4 py-2 text-sm hover:bg-muted transition-colors ${filterCategory === "all" ? "bg-muted/50 font-medium" : ""}`}
                  onClick={() => setFilterCategory("all")}
                >
                  <span>All Categories</span>
                  <Badge variant="outline">{stats.total}</Badge>
                </button>
                
                {categories.map(category => {
                  const count = gifts.filter(g => g.category === category.name).length;
                  if (count === 0) return null;
                  
                  return (
                    <button 
                      key={category.id}
                      className={`flex justify-between items-center px-4 py-2 text-sm hover:bg-muted transition-colors ${filterCategory === category.name ? "bg-muted/50 font-medium" : ""}`}
                      onClick={() => setFilterCategory(category.name)}
                    >
                      <span>{category.name}</span>
                      <Badge variant="outline">{count}</Badge>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Gift Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-0">
              <div className="grid divide-y divide-border">
                <button 
                  className={`flex justify-between items-center px-4 py-2 text-sm hover:bg-muted transition-colors ${filterStatus === "all" ? "bg-muted/50 font-medium" : ""}`}
                  onClick={() => setFilterStatus("all")}
                >
                  <span>All Gifts</span>
                  <Badge variant="outline">{stats.total}</Badge>
                </button>
                
                <button 
                  className={`flex justify-between items-center px-4 py-2 text-sm hover:bg-muted transition-colors ${filterStatus === "available" ? "bg-muted/50 font-medium" : ""}`}
                  onClick={() => setFilterStatus("available")}
                >
                  <span>Available</span>
                  <Badge variant="outline">{stats.available}</Badge>
                </button>
                
                <button 
                  className={`flex justify-between items-center px-4 py-2 text-sm hover:bg-muted transition-colors ${filterStatus === "purchased" ? "bg-muted/50 font-medium" : ""}`}
                  onClick={() => setFilterStatus("purchased")}
                >
                  <span>Purchased</span>
                  <Badge variant="outline">{stats.purchased}</Badge>
                </button>
                
                <button 
                  className={`flex justify-between items-center px-4 py-2 text-sm hover:bg-muted transition-colors ${filterStatus === "received" ? "bg-muted/50 font-medium" : ""}`}
                  onClick={() => setFilterStatus("received")}
                >
                  <span>Received</span>
                  <Badge variant="outline">{stats.received}</Badge>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="w-full lg:w-3/4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="items">All Items</TabsTrigger>
                    <TabsTrigger value="received">Received Gifts</TabsTrigger>
                    <TabsTrigger value="thankyou">Thank You Notes</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="mt-4 sm:mt-0 relative w-full sm:w-auto">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search gifts..."
                    className="pl-8 w-full sm:w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="items">
                <div className="space-y-6">
                  {/* Sort controls */}
                  <div className="flex justify-between items-center text-sm text-muted-foreground border-b pb-2">
                    <div>
                      {filteredGifts.length} item{filteredGifts.length !== 1 ? 's' : ''} found
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Sort by:</span>
                      <button 
                        className={`flex items-center ${sortBy === "priority" ? "font-medium text-foreground" : ""}`}
                        onClick={() => handleSort("priority")}
                      >
                        Priority
                        {sortBy === "priority" && (
                          sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </button>
                      <span>•</span>
                      <button 
                        className={`flex items-center ${sortBy === "price" ? "font-medium text-foreground" : ""}`}
                        onClick={() => handleSort("price")}
                      >
                        Price
                        {sortBy === "price" && (
                          sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </button>
                      <span>•</span>
                      <button 
                        className={`flex items-center ${sortBy === "name" ? "font-medium text-foreground" : ""}`}
                        onClick={() => handleSort("name")}
                      >
                        Name
                        {sortBy === "name" && (
                          sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Gift items grid */}
                  {filteredGifts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredGifts.map((gift) => (
                        <Card key={gift.id} className={`overflow-hidden h-full ${gift.purchasedBy ? 'bg-muted/30' : ''}`}>
                          <div className="aspect-video overflow-hidden relative">
                            <img 
                              src={gift.image} 
                              alt={gift.name} 
                              className="object-cover w-full h-full"
                              style={{ opacity: gift.purchasedBy ? 0.7 : 1 }}
                            />
                            {gift.purchasedBy && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Badge className="absolute top-2 right-2 bg-primary">{gift.received ? "Received" : "Purchased"}</Badge>
                              </div>
                            )}
                            {gift.isGroupGift && (
                              <Badge className="absolute top-2 left-2 bg-secondary">Group Gift</Badge>
                            )}
                            {!gift.purchasedBy && (
                              <Badge className={`absolute top-2 right-2 ${
                                gift.priority === 'high' ? 'bg-red-500' : 
                                gift.priority === 'medium' ? 'bg-amber-500' : 
                                'bg-green-500'
                              }`}>
                                {gift.priority.charAt(0).toUpperCase() + gift.priority.slice(1)} Priority
                              </Badge>
                            )}
                          </div>
                          
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold tracking-tight line-clamp-1">{gift.name}</div>
                              <div className="flex gap-1 items-center">
                                {gift.received && (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                            </div>
                            
                            <div className="text-sm text-muted-foreground mb-2 line-clamp-2" title={gift.description}>
                              {gift.description}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="font-medium">
                                {gift.isGroupGift ? (
                                  <div className="text-sm">
                                    <div className="flex items-center">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      <span>
                                        R{gift.currentContribution?.toLocaleString()} of R{gift.price.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                                      <div 
                                        className="h-full bg-primary" 
                                        style={{ width: `${Math.min(100, (gift.currentContribution || 0) / gift.price * 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    <span>R{gift.price.toLocaleString()}</span>
                                    {gift.quantity > 1 && (
                                      <span className="text-xs text-muted-foreground ml-1">
                                        (Qty: {gift.quantity})
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              <Badge variant="outline">{gift.category}</Badge>
                            </div>
                            
                            {gift.purchasedBy && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                <div>Purchased by: {gift.purchasedBy}</div>
                              </div>
                            )}
                          </CardContent>
                          
                          <CardFooter className="p-4 pt-0 mt-auto flex justify-between">
                            {gift.url ? (
                              <Button variant="outline" size="sm" asChild className="text-xs">
                                <a href={gift.url} target="_blank" rel="noopener noreferrer">
                                  <ShoppingCart className="h-3 w-3 mr-1" />
                                  View Item
                                </a>
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" className="text-xs" disabled>
                                <Store className="h-3 w-3 mr-1" />
                                No Link
                              </Button>
                            )}
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setSelectedItem(gift);
                                  setIsEditItemOpen(true);
                                }}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit Gift
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem
                                  onClick={() => handleToggleReceived(gift.id, !gift.received)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  {gift.received ? "Mark as Not Received" : "Mark as Received"}
                                </DropdownMenuItem>
                                
                                {gift.received && !gift.thanked && (
                                  <DropdownMenuItem onClick={() => handleToggleThanked(gift.id, true)}>
                                    <Heart className="h-4 w-4 mr-2" />
                                    Mark as Thanked
                                  </DropdownMenuItem>
                                )}
                                
                                {gift.received && gift.thanked && (
                                  <DropdownMenuItem onClick={() => handleToggleThanked(gift.id, false)}>
                                    <Heart className="h-4 w-4 mr-2" />
                                    Unmark as Thanked
                                  </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteItem(gift.id)}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete Gift
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">No gifts found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery || filterCategory !== 'all' || filterStatus !== 'all' 
                          ? "Try adjusting your filters or search" 
                          : "Start by adding gifts to your registry"}
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery('');
                          setFilterCategory('all');
                          setFilterStatus('all');
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="received">
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm text-muted-foreground border-b pb-2">
                    <div>
                      {gifts.filter(g => g.received).length} received gift{gifts.filter(g => g.received).length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  {gifts.filter(g => g.received).length > 0 ? (
                    <div className="divide-y">
                      {gifts.filter(g => g.received).map((gift) => (
                        <div key={gift.id} className="py-4 flex items-center">
                          <div className="mr-4">
                            <Checkbox
                              id={`received-${gift.id}`}
                              checked={gift.received}
                              onCheckedChange={(checked) => handleToggleReceived(gift.id, !!checked)}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                              <div>
                                <label 
                                  htmlFor={`received-${gift.id}`}
                                  className={`font-medium ${gift.received ? 'line-through text-muted-foreground' : ''}`}
                                >
                                  {gift.name}
                                </label>
                                <div className="text-sm text-muted-foreground">
                                  {gift.purchasedBy ? `From: ${gift.purchasedBy}` : 'Buyer unknown'}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                <Badge variant="outline">{gift.category}</Badge>
                                <div className="font-medium text-sm">R{gift.price.toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleToggleReceived(gift.id, false)}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Mark as Not Received
                                </DropdownMenuItem>
                                
                                {!gift.thanked ? (
                                  <DropdownMenuItem onClick={() => handleToggleThanked(gift.id, true)}>
                                    <Heart className="h-4 w-4 mr-2" />
                                    Mark as Thanked
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleToggleThanked(gift.id, false)}>
                                    <Heart className="h-4 w-4 mr-2" />
                                    Unmark as Thanked
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">No received gifts yet</h3>
                      <p className="text-muted-foreground">
                        Gifts marked as received will appear here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="thankyou">
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm text-muted-foreground border-b pb-2">
                    <div>
                      {gifts.filter(g => g.received && !g.thanked).length} thank you note{gifts.filter(g => g.received && !g.thanked).length !== 1 ? 's' : ''} pending
                    </div>
                  </div>
                  
                  {gifts.filter(g => g.received).length > 0 ? (
                    <div className="grid gap-4">
                      <div className="rounded-md border">
                        <div className="p-4 bg-muted font-medium">
                          Pending Thank You Notes
                        </div>
                        <div className="divide-y">
                          {gifts.filter(g => g.received && !g.thanked).length > 0 ? (
                            gifts.filter(g => g.received && !g.thanked).map((gift) => (
                              <div key={gift.id} className="p-4 flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{gift.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    From: {gift.purchasedBy || 'Unknown'}
                                  </div>
                                </div>
                                <Button size="sm" onClick={() => handleToggleThanked(gift.id, true)}>
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Mark Thanked
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-muted-foreground">
                              No pending thank you notes
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="rounded-md border">
                        <div className="p-4 bg-muted font-medium">
                          Completed Thank You Notes
                        </div>
                        <div className="divide-y">
                          {gifts.filter(g => g.received && g.thanked).length > 0 ? (
                            gifts.filter(g => g.received && g.thanked).map((gift) => (
                              <div key={gift.id} className="p-4 flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{gift.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    From: {gift.purchasedBy || 'Unknown'}
                                  </div>
                                </div>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Thanked
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-muted-foreground">
                              No completed thank you notes
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">No gifts received yet</h3>
                      <p className="text-muted-foreground">
                        Once you start receiving gifts, you can track thank you notes here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Gift Dialog */}
      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Gift</DialogTitle>
            <DialogDescription>
              Add a new item to your gift registry.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="gift-name">Gift Name</Label>
              <Input
                id="gift-name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="e.g., KitchenAid Stand Mixer"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gift-price">Price (R)</Label>
                <Input
                  id="gift-price"
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  placeholder="e.g., 3500"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="gift-category">Category</Label>
                <Select 
                  value={newItem.category} 
                  onValueChange={(value) => setNewItem({...newItem, category: value})}
                >
                  <SelectTrigger id="gift-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="gift-description">Description</Label>
              <Textarea
                id="gift-description"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                placeholder="Describe the gift item"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gift-priority">Priority</Label>
                <Select 
                  value={newItem.priority} 
                  onValueChange={(value) => setNewItem({...newItem, priority: value})}
                >
                  <SelectTrigger id="gift-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="gift-quantity">Quantity</Label>
                <Input
                  id="gift-quantity"
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="gift-url">Product URL (Optional)</Label>
              <Input
                id="gift-url"
                value={newItem.url}
                onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                placeholder="e.g., https://www.example.com/product"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="gift-image">Image URL (Optional)</Label>
              <Input
                id="gift-image"
                value={newItem.image}
                onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                placeholder="e.g., https://www.example.com/image.jpg"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gift-group"
                checked={newItem.isGroupGift}
                onCheckedChange={(checked) => setNewItem({...newItem, isGroupGift: !!checked})}
              />
              <label
                htmlFor="gift-group"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                This is a group gift (allows partial contributions)
              </label>
            </div>
            
            {newItem.isGroupGift && (
              <div className="grid gap-2">
                <Label htmlFor="gift-min-contribution">Minimum Contribution (R)</Label>
                <Input
                  id="gift-min-contribution"
                  type="number"
                  value={newItem.minimumContribution}
                  onChange={(e) => setNewItem({...newItem, minimumContribution: e.target.value})}
                  placeholder="e.g., 100"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={handleAddItem}>Add Gift</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Gift Dialog */}
      {selectedItem && (
        <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Gift</DialogTitle>
              <DialogDescription>
                Update the details of this gift item.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-gift-name">Gift Name</Label>
                <Input
                  id="edit-gift-name"
                  value={selectedItem.name}
                  onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-gift-price">Price (R)</Label>
                  <Input
                    id="edit-gift-price"
                    type="number"
                    value={selectedItem.price}
                    onChange={(e) => setSelectedItem({...selectedItem, price: parseFloat(e.target.value)})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-gift-category">Category</Label>
                  <Select 
                    value={selectedItem.category} 
                    onValueChange={(value) => setSelectedItem({...selectedItem, category: value})}
                  >
                    <SelectTrigger id="edit-gift-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-gift-description">Description</Label>
                <Textarea
                  id="edit-gift-description"
                  value={selectedItem.description}
                  onChange={(e) => setSelectedItem({...selectedItem, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-gift-priority">Priority</Label>
                  <Select 
                    value={selectedItem.priority} 
                    onValueChange={(value) => setSelectedItem({...selectedItem, priority: value})}
                  >
                    <SelectTrigger id="edit-gift-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-gift-quantity">Quantity</Label>
                  <Input
                    id="edit-gift-quantity"
                    type="number"
                    min="1"
                    value={selectedItem.quantity}
                    onChange={(e) => setSelectedItem({...selectedItem, quantity: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-gift-url">Product URL</Label>
                <Input
                  id="edit-gift-url"
                  value={selectedItem.url || ''}
                  onChange={(e) => setSelectedItem({...selectedItem, url: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-gift-image">Image URL</Label>
                <Input
                  id="edit-gift-image"
                  value={selectedItem.image || ''}
                  onChange={(e) => setSelectedItem({...selectedItem, image: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-gift-received"
                    checked={selectedItem.received}
                    onCheckedChange={(checked) => setSelectedItem({...selectedItem, received: !!checked})}
                  />
                  <label
                    htmlFor="edit-gift-received"
                    className="text-sm font-medium leading-none"
                  >
                    Gift has been received
                  </label>
                </div>
                
                {selectedItem.received && (
                  <div className="flex items-center space-x-2 pl-6">
                    <Checkbox
                      id="edit-gift-thanked"
                      checked={selectedItem.thanked}
                      onCheckedChange={(checked) => setSelectedItem({...selectedItem, thanked: !!checked})}
                    />
                    <label
                      htmlFor="edit-gift-thanked"
                      className="text-sm font-medium leading-none"
                    >
                      Thank you note has been sent
                    </label>
                  </div>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-gift-purchaser">Purchased By</Label>
                <Input
                  id="edit-gift-purchaser"
                  value={selectedItem.purchasedBy || ''}
                  onChange={(e) => setSelectedItem({...selectedItem, purchasedBy: e.target.value || null})}
                  placeholder="Leave blank if not purchased yet"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" onClick={handleEditItem}>Update Gift</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}