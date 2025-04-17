import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  PieChart as PieChartIcon, 
  DollarSign, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  FileText, 
  FileEdit,
  CircleDollarSign,
  PieChart
} from 'lucide-react';

export default function BudgetPlanner() {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState('Sarah & Michael\'s Wedding');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<null | { id: number, name: string }>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    allocatedAmount: '',
  });
  const [newItem, setNewItem] = useState({
    name: '',
    estimatedCost: '',
    vendor: '',
  });

  // Sample data for demonstration - would be replaced with API data
  const eventOptions = [
    "Sarah & Michael's Wedding",
    "Corporate Annual Gala",
    "Emily's 30th Birthday",
  ];

  // Sample budget data
  const budget = {
    totalBudget: 120000,
    spent: 42000,
    allocated: 95000,
    remaining: 25000,
    categories: [
      {
        id: 1,
        name: 'Venue & Rentals',
        allocatedAmount: 50000,
        spent: 25000,
        items: [
          { id: 1, name: 'Reception Venue', estimatedCost: 30000, actualCost: 25000, paymentStatus: 'paid', vendor: 'Rose Garden Hall' },
          { id: 2, name: 'Chairs and Tables', estimatedCost: 5000, actualCost: null, paymentStatus: 'pending', vendor: 'Elite Event Rentals' },
          { id: 3, name: 'Tent Rental', estimatedCost: 8000, actualCost: null, paymentStatus: 'pending', vendor: 'Cape Town Tent Co.' },
        ],
      },
      {
        id: 2,
        name: 'Food & Beverages',
        allocatedAmount: 25000,
        spent: 10000,
        items: [
          { id: 4, name: 'Catering', estimatedCost: 15000, actualCost: 10000, paymentStatus: 'partial', vendor: 'Gourmet Delights' },
          { id: 5, name: 'Wedding Cake', estimatedCost: 3000, actualCost: null, paymentStatus: 'pending', vendor: 'Sweet Delights Bakery' },
          { id: 6, name: 'Bar Service', estimatedCost: 7000, actualCost: null, paymentStatus: 'pending', vendor: 'Mobile Mixers' },
        ],
      },
      {
        id: 3,
        name: 'Photography & Video',
        allocatedAmount: 15000,
        spent: 7000,
        items: [
          { id: 7, name: 'Photographer', estimatedCost: 10000, actualCost: 7000, paymentStatus: 'partial', vendor: 'Moments Captured' },
          { id: 8, name: 'Videographer', estimatedCost: 5000, actualCost: null, paymentStatus: 'pending', vendor: 'Motion Pictures' },
        ],
      },
      {
        id: 4,
        name: 'Attire & Beauty',
        allocatedAmount: 20000,
        spent: 0,
        items: [
          { id: 9, name: 'Wedding Dress', estimatedCost: 12000, actualCost: null, paymentStatus: 'pending', vendor: 'Bridal Elegance' },
          { id: 10, name: 'Groom\'s Tuxedo', estimatedCost: 3000, actualCost: null, paymentStatus: 'pending', vendor: 'Men\'s Formal Wear' },
          { id: 11, name: 'Hair & Makeup', estimatedCost: 2500, actualCost: null, paymentStatus: 'pending', vendor: 'Beauty Bar' },
          { id: 12, name: 'Accessories', estimatedCost: 2500, actualCost: null, paymentStatus: 'pending', vendor: 'Fashion Finesse' },
        ],
      },
    ],
  };

  // Calculate spending metrics
  const percentSpent = Math.round((budget.spent / budget.totalBudget) * 100);
  const percentAllocated = Math.round((budget.allocated / budget.totalBudget) * 100);

  const handleAddCategory = () => {
    toast({
      title: "Category added",
      description: `"${newCategory.name}" has been added to your budget.`,
    });
    setIsAddCategoryOpen(false);
    setNewCategory({ name: '', allocatedAmount: '' });
  };

  const handleAddItem = () => {
    if (!activeCategory) return;
    
    toast({
      title: "Item added",
      description: `"${newItem.name}" has been added to ${activeCategory.name}.`,
    });
    setIsAddItemOpen(false);
    setNewItem({ name: '', estimatedCost: '', vendor: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Budget Planner</CardTitle>
              <CardDescription>
                Track and manage your event budget
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {eventOptions.map((event, index) => (
                    <SelectItem key={index} value={event}>
                      {event}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-1">
          {/* Budget Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="bg-muted/50">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-medium">Total Budget</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <div className="text-2xl font-bold">R{budget.totalBudget.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-medium">Spent</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <div className="text-2xl font-bold">R{budget.spent.toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={percentSpent} className="h-2" />
                  <span className="text-xs">{percentSpent}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-medium">Allocated</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <div className="text-2xl font-bold">R{budget.allocated.toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={percentAllocated} className="h-2" />
                  <span className="text-xs">{percentAllocated}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-medium">Remaining</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <div className="text-2xl font-bold">R{budget.remaining.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Categories */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Budget Categories</h3>
              <Button onClick={() => setIsAddCategoryOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Allocated</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead className="text-right">Progress</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budget.categories.map((category) => {
                    const categorySpent = category.spent;
                    const categoryRemaining = category.allocatedAmount - categorySpent;
                    const categoryProgress = Math.round((categorySpent / category.allocatedAmount) * 100);
                    
                    return (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">R{category.allocatedAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">R{categorySpent.toLocaleString()}</TableCell>
                        <TableCell className="text-right">R{categoryRemaining.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={categoryProgress} className="h-2" />
                            <span className="text-xs w-9">{categoryProgress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setActiveCategory({ id: category.id, name: category.name });
                                setIsAddItemOpen(true);
                              }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Budget Items */}
          <div className="space-y-4 mt-8">
            <h3 className="text-lg font-medium">Budget Items</h3>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Estimated</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budget.categories.flatMap(category => 
                    category.items.map(item => {
                      const statusColor = 
                        item.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                        item.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-700' : 
                        'bg-blue-100 text-blue-700';
                      
                      const StatusIcon = 
                        item.paymentStatus === 'paid' ? CheckCircle2 : 
                        item.paymentStatus === 'partial' ? Clock : 
                        CircleDollarSign;
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{category.name}</TableCell>
                          <TableCell className="text-right">R{item.estimatedCost.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            {item.actualCost ? `R${item.actualCost.toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell>{item.vendor || '-'}</TableCell>
                          <TableCell>
                            <Badge className={`${statusColor} gap-1`}>
                              <StatusIcon className="h-3 w-3" />
                              <span className="capitalize">{item.paymentStatus}</span>
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
                                <DropdownMenuItem>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Mark as Paid
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Budget Category</DialogTitle>
            <DialogDescription>
              Create a new budget category to organize your expenses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                placeholder="e.g., Venue, Food & Drinks, Photography"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="allocated-amount">Allocated Amount (R)</Label>
              <Input
                id="allocated-amount"
                type="number"
                value={newCategory.allocatedAmount}
                onChange={(e) => setNewCategory({...newCategory, allocatedAmount: e.target.value})}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Item Dialog */}
      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Budget Item</DialogTitle>
            <DialogDescription>
              {activeCategory ? 
                `Add a new expense item to ${activeCategory.name}.` : 
                'Add a new expense item to your budget.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="e.g., Venue Deposit, Wedding Cake"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estimated-cost">Estimated Cost (R)</Label>
              <Input
                id="estimated-cost"
                type="number"
                value={newItem.estimatedCost}
                onChange={(e) => setNewItem({...newItem, estimatedCost: e.target.value})}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vendor">Vendor (Optional)</Label>
              <Input
                id="vendor"
                value={newItem.vendor}
                onChange={(e) => setNewItem({...newItem, vendor: e.target.value})}
                placeholder="e.g., Rose Garden Hall"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}