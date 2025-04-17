import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Heart, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  MessageSquare, 
  ArrowUpRight, 
  MoreHorizontal, 
  Trash2, 
  CalendarRange,
  ExternalLink
} from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for shortlisted vendors
const sampleShortlistedVendors = [
  {
    id: 1,
    name: 'Rose Garden Hall',
    category: 'Venues',
    imageUrl: 'https://via.placeholder.com/300',
    rating: 4.8,
    reviewCount: 125,
    location: 'Cape Town, South Africa',
    priceRange: 'R15,000 - R30,000',
    description: 'Beautiful garden venue with stunning views of Table Mountain. Perfect for outdoor ceremonies and elegant receptions.',
    notes: 'Available on our preferred date. Need to check about catering options.',
    phone: '+27 21 555 1234',
    email: 'info@rosegardenhall.co.za',
    website: 'https://example.com/rosegardenhall',
    shortlistedDate: new Date('2024-03-15'),
  },
  {
    id: 2,
    name: 'Sweet Delights Bakery',
    category: 'Catering',
    imageUrl: 'https://via.placeholder.com/300',
    rating: 4.9,
    reviewCount: 87,
    location: 'Stellenbosch, South Africa',
    priceRange: 'R3,000 - R8,000',
    description: 'Award-winning bakery specializing in custom wedding cakes, dessert tables, and pastries for all special occasions.',
    notes: 'Tasting scheduled for next month. Remember to ask about dietary restrictions.',
    phone: '+27 21 555 5678',
    email: 'cakes@sweetdelights.co.za',
    website: 'https://example.com/sweetdelights',
    shortlistedDate: new Date('2024-03-18'),
  },
  {
    id: 3,
    name: 'Moments Captured Photography',
    category: 'Photography',
    imageUrl: 'https://via.placeholder.com/300',
    rating: 4.7,
    reviewCount: 103,
    location: 'Johannesburg, South Africa',
    priceRange: 'R8,000 - R15,000',
    description: 'Professional photography team specializing in candid, natural light photography to capture your special moments.',
    notes: 'Like their portfolio style. Need to check availability and package options.',
    phone: '+27 11 555 9012',
    email: 'hello@momentscaptured.co.za',
    website: 'https://example.com/momentscaptured',
    shortlistedDate: new Date('2024-03-20'),
  },
];

// Sample event options
const eventOptions = [
  { id: 1, name: "Sarah & Michael's Wedding" },
  { id: 2, name: "Corporate Annual Gala" },
  { id: 3, name: "Emily's 30th Birthday" },
];

export default function VendorShortlists() {
  const { toast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<null | any>(null);
  const [notes, setNotes] = useState('');

  // Fetch shortlisted vendors - this would be replaced with an API call
  const { data: shortlistedVendors = sampleShortlistedVendors } = useQuery({
    queryKey: ['shortlistedVendors', selectedEventId],
  });

  // Get unique categories from vendors for filtering
  const categories = ['all', ...Array.from(new Set(shortlistedVendors.map(vendor => vendor.category)))];

  // Filter vendors based on search query and active category
  const filteredVendors = shortlistedVendors.filter(vendor => {
    const matchesSearch = 
      searchQuery === '' || 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || vendor.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle updating vendor notes
  const handleUpdateNotes = () => {
    if (!selectedVendor) return;
    
    toast({
      title: "Notes updated",
      description: `Notes for ${selectedVendor.name} have been updated.`,
    });
    
    setIsNotesDialogOpen(false);
  };

  // Handle removing a vendor from shortlist
  const handleRemoveVendor = (vendorId: number, vendorName: string) => {
    toast({
      title: "Vendor removed",
      description: `${vendorName} has been removed from your shortlist.`,
    });
  };

  // Handle contacting a vendor
  const handleContactVendor = (vendorId: number, vendorName: string) => {
    toast({
      title: "Contact initiated",
      description: `Opening conversation with ${vendorName}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Shortlisted Vendors</CardTitle>
              <CardDescription>
                Manage your favorite vendors for each event
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedEventId.toString()} onValueChange={(value) => setSelectedEventId(Number(value))}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {eventOptions.map(event => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full sm:w-auto">
              <TabsList className="w-full sm:w-auto grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap">
                {categories.map((category, index) => (
                  <TabsTrigger key={index} value={category} className="capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <div className="w-full sm:w-auto flex items-center border rounded-md px-3 py-1 focus-within:ring-1 focus-within:ring-ring">
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input 
                placeholder="Search vendors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-transparent"
              />
            </div>
          </div>
          
          {filteredVendors.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden">
                  <div className="h-48 bg-muted relative">
                    {vendor.imageUrl ? (
                      <img 
                        src={vendor.imageUrl} 
                        alt={vendor.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent">
                        <Heart className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-background text-foreground">
                      {vendor.category}
                    </Badge>
                  </div>
                  
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{vendor.name}</h3>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{vendor.rating}</span>
                          <span className="mx-1">•</span>
                          <span>{vendor.reviewCount} reviews</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{vendor.location}</p>
                        <p className="text-sm font-medium mt-1">{vendor.priceRange}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedVendor(vendor);
                            setNotes(vendor.notes || '');
                            setIsNotesDialogOpen(true);
                          }}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Edit Notes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(vendor.website, '_blank')}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Website
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRemoveVendor(vendor.id, vendor.name)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove from Shortlist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <p className="text-sm mt-3 line-clamp-2">{vendor.description}</p>
                    
                    {vendor.notes && (
                      <div className="mt-3 p-2 bg-muted rounded-md">
                        <p className="text-xs font-medium mb-1">Your Notes:</p>
                        <p className="text-xs line-clamp-2">{vendor.notes}</p>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-2 pt-0">
                    <div className="flex gap-2 w-full">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(`mailto:${vendor.email}`, '_blank')}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(`tel:${vendor.phone}`, '_blank')}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                    </div>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleContactVendor(vendor.id, vendor.name)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border rounded-lg bg-muted/10">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium">No vendors found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                {searchQuery || activeCategory !== 'all' ? 
                  "No vendors match your search or filter criteria. Try adjusting your search." : 
                  "You haven't shortlisted any vendors for this event yet. Browse the vendor directory to find vendors to add to your shortlist."}
              </p>
              <Button 
                className="mt-4"
                variant="outline"
                onClick={() => window.location.href = '/vendors'}
              >
                <Search className="mr-2 h-4 w-4" />
                Browse Vendors
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Notes Dialog */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Vendor Notes</DialogTitle>
            <DialogDescription>
              {selectedVendor && `Add your personal notes about ${selectedVendor.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any details, questions, or reminders..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}