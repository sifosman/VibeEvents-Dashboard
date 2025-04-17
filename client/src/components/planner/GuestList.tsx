import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  Upload,
  Mail,
  PhoneCall,
  Filter,
  User,
  Users,
  ChevronDown,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample event options
const eventOptions = [
  { id: 1, name: "Sarah & Michael's Wedding" },
  { id: 2, name: "Corporate Annual Gala" },
  { id: 3, name: "Emily's 30th Birthday" },
];

// Sample guest data
const sampleGuests = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+27 71 234 5678',
    group: 'Friends',
    status: 'confirmed',
    dietaryRestrictions: 'Vegetarian',
    plusOne: true,
    plusOneName: 'Sarah Smith',
    notes: 'Longtime friend of the groom',
  },
  {
    id: 2,
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    phone: '+27 82 345 6789',
    group: 'Family',
    status: 'confirmed',
    dietaryRestrictions: 'None',
    plusOne: false,
    plusOneName: null,
    notes: "Bride's cousin",
  },
  {
    id: 3,
    name: 'Robert Williams',
    email: 'robert.williams@example.com',
    phone: '+27 83 456 7890',
    group: 'Work',
    status: 'pending',
    dietaryRestrictions: 'Gluten-free',
    plusOne: true,
    plusOneName: 'Mary Williams',
    notes: 'Groom\'s work colleague',
  },
  {
    id: 4,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    phone: '+27 84 567 8901',
    group: 'Friends',
    status: 'declined',
    dietaryRestrictions: 'None',
    plusOne: false,
    plusOneName: null,
    notes: 'Will be out of town',
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+27 73 678 9012',
    group: 'Family',
    status: 'confirmed',
    dietaryRestrictions: 'Dairy-free',
    plusOne: true,
    plusOneName: 'Jennifer Brown',
    notes: "Groom's brother",
  },
  {
    id: 6,
    name: 'Rebecca Wilson',
    email: 'rebecca.wilson@example.com',
    phone: '+27 74 789 0123',
    group: 'Friends',
    status: 'pending',
    dietaryRestrictions: 'None',
    plusOne: false,
    plusOneName: null,
    notes: 'College friend of the bride',
  },
  {
    id: 7,
    name: 'David Thompson',
    email: 'david.thompson@example.com',
    phone: '+27 75 890 1234',
    group: 'Work',
    status: 'confirmed',
    dietaryRestrictions: 'None',
    plusOne: true,
    plusOneName: 'Karen Thompson',
    notes: '',
  },
];

// Sample group data
const guestGroups = [
  { id: 1, name: 'Family', count: 2 },
  { id: 2, name: 'Friends', count: 3 },
  { id: 3, name: 'Work', count: 2 },
];

export default function GuestList() {
  const { toast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState<number>(1);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isEditGuestOpen, setIsEditGuestOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isEmailGuestsOpen, setIsEmailGuestsOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkSelectedGuests, setBulkSelectedGuests] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'name',
    direction: 'asc',
  });
  
  // New guest form state
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    group: '',
    status: 'pending',
    dietaryRestrictions: '',
    plusOne: false,
    plusOneName: '',
    notes: '',
  });

  // New group form state
  const [newGroup, setNewGroup] = useState({
    name: '',
  });

  // Email form state
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: '',
    recipients: 'all', // all, confirmed, pending
  });

  // Filter and sort guests
  const filteredGuests = sampleGuests
    .filter(guest => {
      // Filter by status
      if (activeTab !== 'all' && guest.status !== activeTab) return false;
      
      // Additional filters
      if (filterStatus !== 'all' && guest.status !== filterStatus) return false;
      if (filterGroup !== 'all' && guest.group !== filterGroup) return false;
      
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          guest.name.toLowerCase().includes(query) ||
          guest.email.toLowerCase().includes(query) ||
          guest.phone.toLowerCase().includes(query) ||
          (guest.notes && guest.notes.toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by the selected field
      const field = sortBy.field;
      const direction = sortBy.direction === 'asc' ? 1 : -1;
      
      if (field === 'name') {
        return direction * a.name.localeCompare(b.name);
      }
      
      if (field === 'group') {
        return direction * a.group.localeCompare(b.group);
      }
      
      if (field === 'status') {
        const statusWeight = { confirmed: 3, pending: 2, declined: 1 };
        return direction * (statusWeight[a.status as keyof typeof statusWeight] - statusWeight[b.status as keyof typeof statusWeight]);
      }
      
      return 0;
    });

  // Guest stats
  const guestStats = {
    total: sampleGuests.length,
    confirmed: sampleGuests.filter(g => g.status === 'confirmed').length,
    pending: sampleGuests.filter(g => g.status === 'pending').length,
    declined: sampleGuests.filter(g => g.status === 'declined').length,
    totalPeople: sampleGuests.length + sampleGuests.filter(g => g.plusOne).length,
  };

  // Handle adding a new guest
  const handleAddGuest = () => {
    toast({
      title: "Guest added",
      description: `${newGuest.name} has been added to your guest list.`,
    });
    
    setIsAddGuestOpen(false);
    setNewGuest({
      name: '',
      email: '',
      phone: '',
      group: '',
      status: 'pending',
      dietaryRestrictions: '',
      plusOne: false,
      plusOneName: '',
      notes: '',
    });
  };

  // Handle editing a guest
  const handleEditGuest = () => {
    if (!selectedGuest) return;
    
    toast({
      title: "Guest updated",
      description: `${selectedGuest.name}'s information has been updated.`,
    });
    
    setIsEditGuestOpen(false);
    setSelectedGuest(null);
  };

  // Handle adding a new group
  const handleAddGroup = () => {
    toast({
      title: "Group added",
      description: `"${newGroup.name}" group has been created.`,
    });
    
    setIsAddGroupOpen(false);
    setNewGroup({ name: '' });
  };

  // Handle sending emails
  const handleSendEmails = () => {
    toast({
      title: "Emails sent",
      description: `Emails have been sent successfully.`,
    });
    
    setIsEmailGuestsOpen(false);
    setEmailForm({
      subject: '',
      message: '',
      recipients: 'all',
    });
  };

  // Handle deleting a guest
  const handleDeleteGuest = (guestId: number, guestName: string) => {
    toast({
      title: "Guest removed",
      description: `${guestName} has been removed from your guest list.`,
      variant: "destructive",
    });
  };

  // Handle toggling guest RSVP status
  const handleUpdateGuestStatus = (guestId: number, status: string) => {
    toast({
      title: "RSVP status updated",
      description: `Guest status updated to ${status}.`,
    });
  };

  // Handle bulk selection
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setBulkSelectedGuests(filteredGuests.map(guest => guest.id));
    } else {
      setBulkSelectedGuests([]);
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (bulkSelectedGuests.length === 0) {
      toast({
        title: "No guests selected",
        description: "Please select guests to perform this action.",
        variant: "destructive",
      });
      return;
    }

    let message = '';
    switch (action) {
      case 'confirm':
        message = `${bulkSelectedGuests.length} guests marked as confirmed.`;
        break;
      case 'pending':
        message = `${bulkSelectedGuests.length} guests marked as pending.`;
        break;
      case 'decline':
        message = `${bulkSelectedGuests.length} guests marked as declined.`;
        break;
      case 'delete':
        message = `${bulkSelectedGuests.length} guests removed from your list.`;
        break;
      case 'email':
        setIsEmailGuestsOpen(true);
        return;
    }
    
    toast({
      title: "Bulk action completed",
      description: message,
    });
    
    setBulkSelectedGuests([]);
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: string) => {
    if (sortBy.field === field) {
      setSortBy({
        field,
        direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortBy({
        field,
        direction: 'asc',
      });
    }
  };

  // Get sort icon based on current sort state
  const getSortIcon = (field: string) => {
    if (sortBy.field !== field) return null;
    
    return sortBy.direction === 'asc' ? 
      <SortAsc className="h-3 w-3 ml-1" /> : 
      <SortDesc className="h-3 w-3 ml-1" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Guest Manager</CardTitle>
              <CardDescription>
                Manage your event guest list and RSVPs
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
              <Button onClick={() => setIsAddGuestOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Guest
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Guest Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Guests</p>
                    <p className="text-2xl font-bold">{guestStats.total}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Confirmed</p>
                    <p className="text-2xl font-bold">{guestStats.confirmed}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{guestStats.pending}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <ChevronDown className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Declined</p>
                    <p className="text-2xl font-bold">{guestStats.declined}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total People</p>
                    <p className="text-2xl font-bold">{guestStats.totalPeople}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Guest filter and tabs */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="all">All Guests</TabsTrigger>
                  <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex flex-1 items-center border rounded-md px-3 py-1 focus-within:ring-1 focus-within:ring-ring max-w-md">
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input 
                  placeholder="Search guests..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterGroup} onValueChange={setFilterGroup}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    {guestGroups.map(group => (
                      <SelectItem key={group.id} value={group.name}>
                        {group.name} ({group.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterGroup('all');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={bulkSelectedGuests.length === 0}>
                      Bulk Actions ({bulkSelectedGuests.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction('confirm')}>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                      Mark as Confirmed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('pending')}>
                      <ChevronDown className="mr-2 h-4 w-4 text-yellow-600" />
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('decline')}>
                      <XCircle className="mr-2 h-4 w-4 text-red-600" />
                      Mark as Declined
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('email')}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email Selected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleBulkAction('delete')}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="outline" size="sm" onClick={() => setIsAddGroupOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Group
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export as Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>
          </div>
          
          {/* Guest Table */}
          <div className="rounded-md border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      onCheckedChange={(e) => handleSelectAll(e as any)}
                      checked={bulkSelectedGuests.length === filteredGuests.length && filteredGuests.length > 0}
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Guest {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('group')}>
                    <div className="flex items-center">
                      Group {getSortIcon('group')}
                    </div>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Dietary Needs</TableHead>
                  <TableHead className="hidden md:table-cell">Plus One</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      RSVP {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.length > 0 ? (
                  filteredGuests.map((guest) => {
                    const isSelected = bulkSelectedGuests.includes(guest.id);
                    
                    // Status styling
                    const getStatusBadgeStyle = () => {
                      switch (guest.status) {
                        case 'confirmed':
                          return 'bg-green-100 text-green-700 border-green-200';
                        case 'pending':
                          return 'bg-yellow-100 text-yellow-700 border-yellow-200';
                        case 'declined':
                          return 'bg-red-100 text-red-700 border-red-200';
                        default:
                          return 'bg-gray-100 text-gray-700 border-gray-200';
                      }
                    };
                    
                    return (
                      <TableRow key={guest.id} className={isSelected ? 'bg-muted/20' : ''}>
                        <TableCell>
                          <Checkbox 
                            checked={isSelected} 
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setBulkSelectedGuests([...bulkSelectedGuests, guest.id]);
                              } else {
                                setBulkSelectedGuests(bulkSelectedGuests.filter(id => id !== guest.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{guest.name}</div>
                            {guest.notes && (
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {guest.notes}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1 text-muted-foreground" /> 
                              <a href={`mailto:${guest.email}`} className="hover:underline">{guest.email}</a>
                            </div>
                            <div className="flex items-center mt-1">
                              <PhoneCall className="h-3 w-3 mr-1 text-muted-foreground" /> 
                              <a href={`tel:${guest.phone}`} className="hover:underline">{guest.phone}</a>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{guest.group}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {guest.dietaryRestrictions || 'None'}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {guest.plusOne ? (
                            <div>
                              <span className="text-green-600">Yes</span>
                              {guest.plusOneName && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {guest.plusOneName}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeStyle()}>
                            {guest.status === 'confirmed' ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : guest.status === 'pending' ? (
                              <ChevronDown className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            <span className="capitalize">
                              {guest.status}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedGuest(guest);
                                  setIsEditGuestOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem
                                onClick={() => handleUpdateGuestStatus(guest.id, 'confirmed')}
                                disabled={guest.status === 'confirmed'}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                Mark Confirmed
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateGuestStatus(guest.id, 'pending')}
                                disabled={guest.status === 'pending'}
                              >
                                <ChevronDown className="h-4 w-4 mr-2 text-yellow-600" />
                                Mark Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateGuestStatus(guest.id, 'declined')}
                                disabled={guest.status === 'declined'}
                              >
                                <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                Mark Declined
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteGuest(guest.id, guest.name)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No guests found</p>
                        <Button 
                          variant="link" 
                          onClick={() => {
                            setFilterStatus('all');
                            setFilterGroup('all');
                            setSearchQuery('');
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Guest Dialog */}
      <Dialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Guest</DialogTitle>
            <DialogDescription>
              Add a guest to your event.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="guest-name">Guest Name</Label>
              <Input
                id="guest-name"
                value={newGuest.name}
                onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                placeholder="e.g., John Smith"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="guest-email">Email</Label>
                <Input
                  id="guest-email"
                  type="email"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                  placeholder="e.g., john@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guest-phone">Phone</Label>
                <Input
                  id="guest-phone"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                  placeholder="e.g., +27 71 234 5678"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="guest-group">Group</Label>
                <Select 
                  value={newGuest.group} 
                  onValueChange={(value) => setNewGuest({...newGuest, group: value})}
                >
                  <SelectTrigger id="guest-group">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {guestGroups.map(group => (
                      <SelectItem key={group.id} value={group.name}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guest-status">RSVP Status</Label>
                <Select 
                  value={newGuest.status} 
                  onValueChange={(value) => setNewGuest({...newGuest, status: value})}
                >
                  <SelectTrigger id="guest-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="guest-dietary">Dietary Restrictions</Label>
              <Input
                id="guest-dietary"
                value={newGuest.dietaryRestrictions}
                onChange={(e) => setNewGuest({...newGuest, dietaryRestrictions: e.target.value})}
                placeholder="e.g., Vegetarian, Gluten-free, None"
              />
            </div>
            <div className="flex items-center space-x-2 py-2">
              <Switch
                id="guest-plus-one"
                checked={newGuest.plusOne}
                onCheckedChange={(checked) => setNewGuest({...newGuest, plusOne: checked})}
              />
              <Label htmlFor="guest-plus-one">Include Plus One</Label>
            </div>
            {newGuest.plusOne && (
              <div className="grid gap-2">
                <Label htmlFor="guest-plus-one-name">Plus One Name</Label>
                <Input
                  id="guest-plus-one-name"
                  value={newGuest.plusOneName}
                  onChange={(e) => setNewGuest({...newGuest, plusOneName: e.target.value})}
                  placeholder="e.g., Jane Smith"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="guest-notes">Notes (Optional)</Label>
              <Textarea
                id="guest-notes"
                value={newGuest.notes}
                onChange={(e) => setNewGuest({...newGuest, notes: e.target.value})}
                placeholder="Any additional information about this guest"
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddGuest}>Add Guest</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Guest Dialog */}
      {selectedGuest && (
        <Dialog open={isEditGuestOpen} onOpenChange={setIsEditGuestOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Guest</DialogTitle>
              <DialogDescription>
                Update guest details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-guest-name">Guest Name</Label>
                <Input
                  id="edit-guest-name"
                  value={selectedGuest.name}
                  onChange={(e) => setSelectedGuest({...selectedGuest, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-guest-email">Email</Label>
                  <Input
                    id="edit-guest-email"
                    type="email"
                    value={selectedGuest.email}
                    onChange={(e) => setSelectedGuest({...selectedGuest, email: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-guest-phone">Phone</Label>
                  <Input
                    id="edit-guest-phone"
                    value={selectedGuest.phone}
                    onChange={(e) => setSelectedGuest({...selectedGuest, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-guest-group">Group</Label>
                  <Select 
                    value={selectedGuest.group} 
                    onValueChange={(value) => setSelectedGuest({...selectedGuest, group: value})}
                  >
                    <SelectTrigger id="edit-guest-group">
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      {guestGroups.map(group => (
                        <SelectItem key={group.id} value={group.name}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-guest-status">RSVP Status</Label>
                  <Select 
                    value={selectedGuest.status} 
                    onValueChange={(value) => setSelectedGuest({...selectedGuest, status: value})}
                  >
                    <SelectTrigger id="edit-guest-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-guest-dietary">Dietary Restrictions</Label>
                <Input
                  id="edit-guest-dietary"
                  value={selectedGuest.dietaryRestrictions}
                  onChange={(e) => setSelectedGuest({...selectedGuest, dietaryRestrictions: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Switch
                  id="edit-guest-plus-one"
                  checked={selectedGuest.plusOne}
                  onCheckedChange={(checked) => setSelectedGuest({...selectedGuest, plusOne: checked})}
                />
                <Label htmlFor="edit-guest-plus-one">Include Plus One</Label>
              </div>
              {selectedGuest.plusOne && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-guest-plus-one-name">Plus One Name</Label>
                  <Input
                    id="edit-guest-plus-one-name"
                    value={selectedGuest.plusOneName || ''}
                    onChange={(e) => setSelectedGuest({...selectedGuest, plusOneName: e.target.value})}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="edit-guest-notes">Notes (Optional)</Label>
                <Textarea
                  id="edit-guest-notes"
                  value={selectedGuest.notes || ''}
                  onChange={(e) => setSelectedGuest({...selectedGuest, notes: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleEditGuest}>Update Guest</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Group Dialog */}
      <Dialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Group</DialogTitle>
            <DialogDescription>
              Create a new group for organizing your guests.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                placeholder="e.g., Family, Friends, Work"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddGroup}>Add Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Import Guests Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Import Guests</DialogTitle>
            <DialogDescription>
              Import a list of guests from a CSV or Excel file.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Drag and drop your file here, or click to browse
              </p>
              <Button variant="outline" className="mt-4">
                Browse Files
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Supported file types: CSV, Excel (.xlsx)
              </p>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">File Format</h4>
              <p className="text-xs text-muted-foreground">
                Your file should include these columns:<br />
                Name, Email, Phone, Group, RSVP Status, Dietary Restrictions, Plus One, Plus One Name, Notes
              </p>
              <a href="#" className="text-xs text-primary flex items-center mt-2">
                <Download className="h-3 w-3 mr-1" />
                Download template
              </a>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled>Import Guests</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Email Guests Dialog */}
      <Dialog open={isEmailGuestsOpen} onOpenChange={setIsEmailGuestsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Email Guests</DialogTitle>
            <DialogDescription>
              Send an email to the selected guests.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email-recipients">Recipients</Label>
              <Select 
                value={emailForm.recipients} 
                onValueChange={(value) => setEmailForm({...emailForm, recipients: value})}
              >
                <SelectTrigger id="email-recipients">
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selected">Selected Guests ({bulkSelectedGuests.length})</SelectItem>
                  <SelectItem value="all">All Guests ({guestStats.total})</SelectItem>
                  <SelectItem value="confirmed">Confirmed Guests ({guestStats.confirmed})</SelectItem>
                  <SelectItem value="pending">Pending Guests ({guestStats.pending})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                placeholder="e.g., Important update about our event"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-message">Message</Label>
              <Textarea
                id="email-message"
                value={emailForm.message}
                onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                placeholder="Write your message here..."
                className="min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSendEmails}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}