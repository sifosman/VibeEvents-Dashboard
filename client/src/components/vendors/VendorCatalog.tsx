import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ImagePlus, Trash2, Edit, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { CatalogItem, Vendor } from '@shared/schema';
import { formatCurrency } from '@/lib/currencyUtils';
import { cn } from '@/lib/utils';
import { ImageViewer } from '@/components/ui/image-viewer';

// Define props for the component
interface VendorCatalogProps {
  catalogItems?: CatalogItem[];
  vendorId?: number;
  isEditable?: boolean;
  onCatalogUpdate?: (items: CatalogItem[]) => void;
  maxItems?: number;
  currency?: string;
}

export function VendorCatalog({ 
  catalogItems: initialItems, 
  vendorId,
  isEditable = false, 
  onCatalogUpdate,
  maxItems = 100, 
  currency = 'ZAR'
}: VendorCatalogProps) {
  const { data: vendor } = useQuery<Vendor>({
    queryKey: vendorId ? ['/api/vendors', vendorId.toString()] : ['no-vendor'],
    enabled: !!vendorId
  });
  
  // Use either provided catalog items or fetch from vendor data
  const catalogItemsFromVendor = vendor?.catalogItems || [];
  const catalogItems = initialItems || catalogItemsFromVendor;
  // State for catalog items and editing
  const [items, setItems] = useState<CatalogItem[]>(catalogItems);
  
  // Update items when vendor data or initialItems change
  useEffect(() => {
    const updatedCatalogItems = initialItems || catalogItemsFromVendor;
    setItems(updatedCatalogItems);
  }, [initialItems, vendor]);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'grid' ? 12 : 8;
  
  // Extract unique categories from catalog items
  const categories = Array.from(new Set(items.map(item => item.category || 'Uncategorized')));
  
  // Helper function for creating a new blank item
  const createNewItem = (): CatalogItem => {
    return {
      id: `item_${Date.now()}`,
      name: '',
      description: '',
      imageUrl: '',
      price: '',
      category: categories[0] || 'General',
      inStock: true,
      featured: false,
      sortOrder: items.length,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };
  
  // Handler for adding a new item
  const handleAddItem = () => {
    if (items.length >= maxItems) {
      alert(`You can only add up to ${maxItems} items in your catalog.`);
      return;
    }
    
    const newItem = createNewItem();
    setEditingItem(newItem);
  };
  
  // Handler for editing an existing item
  const handleEditItem = (item: CatalogItem) => {
    setEditingItem({ ...item });
  };
  
  // Handler for deleting an item
  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      onCatalogUpdate?.(updatedItems);
    }
  };
  
  // Handler for saving edits to an item
  const handleSaveItem = () => {
    if (!editingItem) return;
    
    if (!editingItem.name || !editingItem.price) {
      alert('Name and price are required fields.');
      return;
    }
    
    // Check if item already exists (update) or is new (add)
    const itemExists = items.some(item => item.id === editingItem.id);
    let updatedItems: CatalogItem[];
    
    if (itemExists) {
      updatedItems = items.map(item => 
        item.id === editingItem.id ? { ...editingItem, updatedAt: new Date() } : item
      );
    } else {
      updatedItems = [...items, { ...editingItem, createdAt: new Date(), updatedAt: new Date() }];
    }
    
    setItems(updatedItems);
    setEditingItem(null);
    onCatalogUpdate?.(updatedItems);
  };
  
  // Handler for canceling edits
  const handleCancelEdit = () => {
    setEditingItem(null);
  };
  
  // Filter items by category if needed
  const filteredItems = categoryFilter 
    ? items.filter(item => item.category === categoryFilter) 
    : items;
  
  // Sort items by featured and then by sort order
  const sortedItems = [...filteredItems].sort((a, b) => {
    // Featured items first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Then sort by sortOrder
    return a.sortOrder - b.sortOrder;
  });
  
  // Paginate items
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  
  // Handlers for pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // If editing an item, show the edit form
  if (editingItem) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">
          {items.some(item => item.id === editingItem.id) ? 'Edit Item' : 'Add New Item'}
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="item-name">Item Name*</Label>
            <Input 
              id="item-name" 
              value={editingItem.name} 
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              placeholder="Item name"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="item-price">Price*</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">{currency}</span>
              <Input 
                id="item-price" 
                value={editingItem.price.toString().replace(/[^0-9.]/g, '')} 
                onChange={(e) => setEditingItem({ 
                  ...editingItem, 
                  price: e.target.value.replace(/[^0-9.]/g, '')
                })}
                className="pl-10"
                placeholder="0.00"
                type="text"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="item-category">Category</Label>
            <div className="flex gap-2">
              <Input 
                id="item-category" 
                value={editingItem.category || ''} 
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                placeholder="Category"
                list="category-options"
                className="flex-1"
              />
              <datalist id="category-options">
                {categories.map(category => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="item-description">Description</Label>
            <Textarea 
              id="item-description" 
              value={editingItem.description || ''} 
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              placeholder="Item description"
              className="w-full"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="item-image">Image URL</Label>
            <Input 
              id="item-image" 
              value={editingItem.imageUrl} 
              onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full"
            />
            {editingItem.imageUrl && (
              <div className="mt-2 relative w-32 h-32 border rounded overflow-hidden">
                <img 
                  src={editingItem.imageUrl} 
                  alt={editingItem.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=No+Image'}
                />
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="item-featured" className="cursor-pointer">
                <input 
                  id="item-featured" 
                  type="checkbox" 
                  checked={editingItem.featured} 
                  onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                  className="mr-2"
                />
                Featured Item
              </Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="item-stock" className="cursor-pointer">
                <input 
                  id="item-stock" 
                  type="checkbox" 
                  checked={editingItem.inStock} 
                  onChange={(e) => setEditingItem({ ...editingItem, inStock: e.target.checked })}
                  className="mr-2"
                />
                In Stock
              </Label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancelEdit} className="gap-1">
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button onClick={handleSaveItem} className="gap-1">
              <Check className="w-4 h-4" /> Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // If no catalog items and editable, show an empty state with add button
  if (items.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Your catalog is empty</h3>
        
        {isEditable ? (
          <>
            <p className="text-gray-500 mb-6">Add items to your catalog to showcase your products or services.</p>
            <Button onClick={handleAddItem} className="gap-1">
              <ImagePlus className="w-4 h-4" /> Add First Item
            </Button>
          </>
        ) : (
          <p className="text-gray-500">This vendor hasn't added any items to their catalog yet.</p>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Toolbar with controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={!categoryFilter ? "secondary" : "outline"} 
            onClick={() => setCategoryFilter(null)}
            className="cursor-pointer"
          >
            All
          </Badge>
          
          {categories.map(category => (
            <Badge 
              key={category} 
              variant={categoryFilter === category ? "secondary" : "outline"}
              onClick={() => setCategoryFilter(category)}
              className="cursor-pointer"
            >
              {category}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-3">
          {isEditable && (
            <Button onClick={handleAddItem} size="sm" className="gap-1">
              <ImagePlus className="w-4 h-4" /> Add Item
            </Button>
          )}
          
          <div className="flex border rounded-md">
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              Grid
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              List
            </Button>
          </div>
        </div>
      </div>
      
      {/* Catalog items display */}
      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
          : 'grid-cols-1'
      )}>
        {paginatedItems.map(item => (
          <Card 
            key={item.id} 
            className={cn(
              "overflow-hidden transition-all",
              viewMode === 'grid' 
                ? 'flex flex-col' 
                : 'flex flex-col sm:flex-row'
            )}
          >
            <div 
              className={cn(
                "relative overflow-hidden bg-gray-100",
                viewMode === 'grid' 
                  ? 'w-full h-48' 
                  : 'w-full sm:w-48 h-48'
              )}
            >
              <ImageViewer
                imageUrl={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
                fullClassName="w-full h-full object-contain"
                fallbackUrl="https://placehold.co/300x300?text=No+Image"
              />
              
              {item.featured && (
                <Badge variant="secondary" className="absolute top-2 left-2">
                  Featured
                </Badge>
              )}
              
              {!item.inStock && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg line-clamp-2">{item.name}</h3>
                <span className="font-semibold text-primary">
                  {formatCurrency(parseFloat(item.price), currency)}
                </span>
              </div>
              
              {item.category && (
                <Badge variant="outline" className="w-fit mb-2">
                  {item.category}
                </Badge>
              )}
              
              {item.description && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">{item.description}</p>
              )}
              
              {isEditable && (
                <div className="flex justify-end gap-2 mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditItem(item)}
                    className="gap-1"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteItem(item.id)}
                    className="gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-6">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, sortedItems.length)} of {sortedItems.length} items
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={page === currentPage ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}