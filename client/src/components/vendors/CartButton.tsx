import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2,
  X
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CatalogItem } from "@shared/schema";

interface CartItem extends CatalogItem {
  vendorId: number;
  vendorName: string;
  quantity: number;
  notes?: string;
}

interface CartButtonProps {
  catalogItem: CatalogItem;
  vendorId: number;
  vendorName: string;
}

export function CartButton({ catalogItem, vendorId, vendorName }: CartButtonProps) {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    eventType: "",
    eventDate: "",
    eventLocation: "",
    guestCount: "",
    requirements: ""
  });

  const addToCart = (item: CatalogItem) => {
    const existingItem = cart.find(cartItem => 
      cartItem.id === item.id && cartItem.vendorId === vendorId
    );

    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id && cartItem.vendorId === vendorId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        ...item,
        vendorId,
        vendorName,
        quantity: 1
      }]);
    }

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (itemId: string, vendorId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, vendorId);
      return;
    }

    setCart(cart.map(item =>
      item.id === itemId && item.vendorId === vendorId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (itemId: string, vendorId: number) => {
    setCart(cart.filter(item => !(item.id === itemId && item.vendorId === vendorId)));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    });
  };

  const updateNotes = (itemId: string, vendorId: number, notes: string) => {
    setCart(cart.map(item =>
      item.id === itemId && item.vendorId === vendorId
        ? { ...item, notes }
        : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const submitQuoteRequest = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before requesting a quote.",
        variant: "destructive",
      });
      return;
    }

    if (!quoteForm.customerName || !quoteForm.customerEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Group items by vendor
      const itemsByVendor = cart.reduce((acc, item) => {
        if (!acc[item.vendorId]) {
          acc[item.vendorId] = [];
        }
        acc[item.vendorId].push(item);
        return acc;
      }, {} as Record<number, CartItem[]>);

      // Submit quote request for each vendor
      for (const [vendorIdStr, items] of Object.entries(itemsByVendor)) {
        const vendorId = parseInt(vendorIdStr);
        const quoteData = {
          vendorId,
          userId: 1, // This should come from auth context
          customerName: quoteForm.customerName,
          customerEmail: quoteForm.customerEmail,
          customerPhone: quoteForm.customerPhone,
          eventType: quoteForm.eventType,
          eventDate: quoteForm.eventDate ? new Date(quoteForm.eventDate) : null,
          eventLocation: quoteForm.eventLocation,
          guestCount: quoteForm.guestCount ? parseInt(quoteForm.guestCount) : null,
          customerRequirements: quoteForm.requirements,
          items: items.map(item => ({
            catalogItemId: item.id,
            catalogItemName: item.name,
            quantity: item.quantity,
            unitPrice: parseFloat(item.price.replace(/[^\d.]/g, '')) || 0,
            totalPrice: (parseFloat(item.price.replace(/[^\d.]/g, '')) || 0) * item.quantity,
            customerNotes: item.notes
          }))
        };

        // This would typically be an API call
        console.log('Quote request submitted:', quoteData);
      }

      toast({
        title: "Quote Request Submitted",
        description: `Your quote request has been sent to ${Object.keys(itemsByVendor).length} vendor(s). You'll hear back within 24 hours.`,
      });

      // Clear cart and form
      setCart([]);
      setQuoteForm({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        eventType: "",
        eventDate: "",
        eventLocation: "",
        guestCount: "",
        requirements: ""
      });
      setIsCartOpen(false);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Add to Cart Button */}
      <Button 
        onClick={() => addToCart(catalogItem)}
        variant="outline" 
        size="sm"
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add to Cart
      </Button>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <Button 
              className="fixed bottom-20 right-4 md:bottom-4 md:right-4 z-50 rounded-full w-14 h-14 shadow-lg"
              size="lg"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {getCartItemCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Your Cart ({getCartItemCount()} items)</SheetTitle>
              <SheetDescription>
                Review your items and request a quote from vendors
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={`${item.id}-${item.vendorId}`} className="border">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm">{item.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">{item.vendorName}</p>
                          <p className="text-sm font-medium mt-1">{item.price}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id, item.vendorId)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Quantity:</Label>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.vendorId, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.vendorId, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <Label className="text-xs">Special Requirements:</Label>
                        <Input
                          placeholder="Any special requirements..."
                          value={item.notes || ""}
                          onChange={(e) => updateNotes(item.id, item.vendorId, e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Cart Total */}
              <div className="flex justify-between items-center font-medium">
                <span>Estimated Total:</span>
                <span>R{getCartTotal().toFixed(2)}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={clearCart} className="flex-1">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              </div>

              <Separator />

              {/* Quote Request Form */}
              <div className="space-y-4">
                <h3 className="font-medium">Request Quote</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="customerName">Your Name *</Label>
                    <Input
                      id="customerName"
                      value={quoteForm.customerName}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerEmail">Email Address *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={quoteForm.customerEmail}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      value={quoteForm.customerPhone}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="+27 XX XXX XXXX"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="eventType">Event Type</Label>
                      <Input
                        id="eventType"
                        value={quoteForm.eventType}
                        onChange={(e) => setQuoteForm(prev => ({ ...prev, eventType: e.target.value }))}
                        placeholder="Wedding, Party, etc."
                      />
                    </div>

                    <div>
                      <Label htmlFor="guestCount">Guest Count</Label>
                      <Input
                        id="guestCount"
                        type="number"
                        value={quoteForm.guestCount}
                        onChange={(e) => setQuoteForm(prev => ({ ...prev, guestCount: e.target.value }))}
                        placeholder="50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={quoteForm.eventDate}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, eventDate: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="eventLocation">Event Location</Label>
                    <Input
                      id="eventLocation"
                      value={quoteForm.eventLocation}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, eventLocation: e.target.value }))}
                      placeholder="City, venue, or address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Additional Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={quoteForm.requirements}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, requirements: e.target.value }))}
                      placeholder="Any specific requirements, dietary restrictions, theme details, etc."
                      className="min-h-20"
                    />
                  </div>
                </div>

                <Button onClick={submitQuoteRequest} className="w-full" size="lg">
                  Request Quote
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Vendors will respond with customized quotes within 24 hours
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}