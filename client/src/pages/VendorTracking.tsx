import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
  TableFooter
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Shortlist, InsertShortlist, Vendor } from '@shared/schema';
import { formatCurrency } from '@/lib/currencyUtils';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  MoreVertical, 
  DollarSign, 
  CheckCircle2, 
  Loader2,
  FileCheck,
  ClipboardList
} from 'lucide-react';

export default function VendorTracking() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [editingVendor, setEditingVendor] = useState<(Shortlist & { vendor: Vendor }) | null>(null);
  
  // Fetch shortlisted vendors with costs and notes
  const {
    data: shortlistedVendors,
    isLoading,
    error,
    refetch
  } = useQuery<(Shortlist & { vendor: Vendor })[]>({
    queryKey: ['/api/shortlist/tracking'],
    queryFn: async () => {
      const res = await fetch('/api/shortlist/tracking');
      if (!res.ok) {
        throw new Error('Failed to fetch vendor tracking data');
      }
      return res.json();
    }
  });

  // Fetch all available vendors for adding to tracking
  const { data: allVendors } = useQuery<Vendor[]>({
    queryKey: ['/api/vendors'],
    queryFn: async () => {
      const res = await fetch('/api/vendors');
      if (!res.ok) {
        throw new Error('Failed to fetch vendors');
      }
      return res.json();
    }
  });

  // Form state for adding/editing a vendor
  const [formData, setFormData] = useState<Partial<InsertShortlist>>({
    vendorId: 0,
    cost: undefined,
    notes: '',
    status: 'considering'
  });

  // Add a vendor to tracking
  const addVendorMutation = useMutation({
    mutationFn: async (data: InsertShortlist) => {
      const res = await apiRequest('POST', '/api/shortlist/tracking', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shortlist/tracking'] });
      toast({
        title: "Vendor added to tracking",
        description: "You can now track costs and progress for this vendor",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Failed to add vendor",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update a vendor in tracking
  const updateVendorMutation = useMutation({
    mutationFn: async (data: { id: number, updates: Partial<InsertShortlist> }) => {
      const res = await apiRequest('PATCH', `/api/shortlist/tracking/${data.id}`, data.updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shortlist/tracking'] });
      toast({
        title: "Vendor updated",
        description: "Vendor tracking information has been updated",
      });
      setIsEditDialogOpen(false);
      setEditingVendor(null);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Failed to update vendor",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Remove a vendor from tracking
  const removeVendorMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/shortlist/tracking/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shortlist/tracking'] });
      toast({
        title: "Vendor removed",
        description: "Vendor has been removed from tracking",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove vendor",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle number inputs separately to ensure they're stored as numbers
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value ? parseFloat(value) : undefined });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Reset the form
  const resetForm = () => {
    setFormData({
      vendorId: 0,
      cost: undefined,
      notes: '',
      status: 'considering'
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendorId) {
      toast({
        title: "Validation Error",
        description: "Please select a vendor",
        variant: "destructive",
      });
      return;
    }

    if (editingVendor) {
      updateVendorMutation.mutate({ 
        id: editingVendor.id,
        updates: formData
      });
    } else {
      addVendorMutation.mutate(formData as InsertShortlist);
    }
  };

  // Open edit dialog
  const openEditDialog = (item: Shortlist & { vendor: Vendor }) => {
    setEditingVendor(item);
    setFormData({
      vendorId: item.vendorId,
      cost: item.cost || undefined,
      notes: item.notes || '',
      status: item.status || 'considering'
    });
    setIsEditDialogOpen(true);
  };

  // Filter vendors based on search term and status
  const filteredVendors = shortlistedVendors?.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate total cost
  const totalCost = shortlistedVendors?.reduce((acc, curr) => {
    return acc + (curr.cost || 0);
  }, 0) || 0;

  // Get vendors not already in tracking
  const availableVendors = allVendors?.filter(vendor => {
    return !shortlistedVendors?.some(sv => sv.vendorId === vendor.id);
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Helmet>
        <title>Vendor Tracking - HowzEventz</title>
      </Helmet>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendor Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Track vendors you're working with, their costs, and progress
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Your Vendors</CardTitle>
              <CardDescription>
                Track vendors and expenses for your event
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Input
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="min-w-[200px]"
                />
              </div>
              <Select 
                value={statusFilter || ''} 
                onValueChange={(value) => setStatusFilter(value || null)}
              >
                <SelectTrigger className="min-w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="considering">Considering</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Error loading vendor data. Please try again.</p>
            </div>
          ) : filteredVendors?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-2" />
              <p>You haven't added any vendors to track yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Add Your First Vendor
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.vendor.name}</TableCell>
                      <TableCell>{item.vendor.categoryId}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'considering' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'booked' ? 'bg-amber-100 text-amber-800' :
                          item.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          item.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status === 'considering' ? 'Considering' :
                           item.status === 'booked' ? 'Booked' :
                           item.status === 'confirmed' ? 'Confirmed' :
                           item.status === 'completed' ? 'Completed' :
                           item.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.cost ? formatCurrency(item.cost) : '-'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {item.notes || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(item)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => removeVendorMutation.mutate(item.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total Cost</TableCell>
                    <TableCell className="text-right font-bold" colSpan={3}>
                      {formatCurrency(totalCost)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Vendor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Vendor to Tracking</DialogTitle>
            <DialogDescription>
              Add a vendor to your tracking list to monitor costs and booking status.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor" className="text-right">
                  Vendor
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={formData.vendorId?.toString() || ''} 
                    onValueChange={(value) => handleSelectChange('vendorId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVendors?.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id.toString()}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cost" className="text-right">
                  Cost
                </Label>
                <div className="col-span-3">
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cost"
                      name="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-8"
                      value={formData.cost || ''}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={formData.status || 'considering'} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="considering">Considering</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right pt-2">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Add any notes about this vendor..."
                  className="col-span-3"
                  value={formData.notes || ''}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={addVendorMutation.isPending}
              >
                {addVendorMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Vendor
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Vendor Details</DialogTitle>
            <DialogDescription>
              Update tracking information for this vendor.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Vendor
                </Label>
                <div className="col-span-3">
                  <p className="font-medium">{editingVendor?.vendor.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cost" className="text-right">
                  Cost
                </Label>
                <div className="col-span-3">
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit-cost"
                      name="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-8"
                      value={formData.cost || ''}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={formData.status || 'considering'} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="considering">Considering</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-notes" className="text-right pt-2">
                  Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  placeholder="Add any notes about this vendor..."
                  className="col-span-3"
                  value={formData.notes || ''}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingVendor(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateVendorMutation.isPending}
              >
                {updateVendorMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}