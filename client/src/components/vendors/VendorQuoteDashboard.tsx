import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  DollarSign, 
  MessageCircle, 
  Send, 
  Edit, 
  FileText, 
  Check, 
  X,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Package
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface QuoteLineItem {
  id: string;
  catalogItemId: string;
  catalogItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customerNotes?: string;
  vendorNotes?: string;
}

interface QuoteRequest {
  id: number;
  vendorId: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  eventType?: string;
  eventDate?: Date;
  eventLocation?: string;
  guestCount?: number;
  status: 'requested' | 'pending' | 'accepted' | 'rejected' | 'amendment_requested';
  totalAmount?: number;
  vendorNotes?: string;
  customerRequirements?: string;
  submittedAt: Date;
  quotedAt?: Date;
  respondedAt?: Date;
  lineItems: QuoteLineItem[];
}

interface QuoteMessage {
  id: number;
  quoteRequestId: number;
  senderId: number;
  senderType: 'vendor' | 'customer';
  senderName: string;
  message: string;
  messageType: 'text' | 'quote_update' | 'amendment_request';
  isRead: boolean;
  sentAt: Date;
}

export function VendorQuoteDashboard() {
  const { toast } = useToast();
  
  // Mock data - in real app this would come from API
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([
    {
      id: 1,
      vendorId: 1,
      userId: 1,
      customerName: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      customerPhone: "+27 83 123 4567",
      eventType: "Wedding",
      eventDate: new Date('2024-08-15'),
      eventLocation: "Cape Town",
      guestCount: 120,
      status: 'requested',
      customerRequirements: "Looking for elegant flower arrangements for ceremony and reception. Prefer white and blush pink roses with eucalyptus. Need bridal bouquet, 5 bridesmaids bouquets, and centerpieces for 12 tables.",
      submittedAt: new Date('2024-01-20'),
      lineItems: [
        {
          id: '1',
          catalogItemId: 'item_1',
          catalogItemName: 'Bridal Bouquet - Premium',
          quantity: 1,
          unitPrice: 1200,
          totalPrice: 1200,
          customerNotes: 'White roses with eucalyptus'
        },
        {
          id: '2',
          catalogItemId: 'item_2',
          catalogItemName: 'Bridesmaid Bouquet',
          quantity: 5,
          unitPrice: 450,
          totalPrice: 2250,
          customerNotes: 'Blush pink theme'
        },
        {
          id: '3',
          catalogItemId: 'item_3',
          catalogItemName: 'Table Centerpiece',
          quantity: 12,
          unitPrice: 180,
          totalPrice: 2160,
          customerNotes: 'Low arrangements'
        }
      ]
    },
    {
      id: 2,
      vendorId: 1,
      userId: 2,
      customerName: "Michael Chen",
      customerEmail: "michael@company.com",
      customerPhone: "+27 82 456 7890",
      eventType: "Corporate Event",
      eventDate: new Date('2024-02-28'),
      eventLocation: "Johannesburg",
      guestCount: 80,
      status: 'pending',
      totalAmount: 3500,
      vendorNotes: "Quote includes setup and breakdown. Additional charges may apply for venue access restrictions.",
      customerRequirements: "Corporate launch event decoration. Modern and professional theme with company colors (blue and silver).",
      submittedAt: new Date('2024-01-18'),
      quotedAt: new Date('2024-01-19'),
      lineItems: [
        {
          id: '4',
          catalogItemId: 'item_4',
          catalogItemName: 'Corporate Display Setup',
          quantity: 1,
          unitPrice: 2500,
          totalPrice: 2500,
          vendorNotes: 'Includes backdrop and signage'
        },
        {
          id: '5',
          catalogItemId: 'item_5',
          catalogItemName: 'Table Arrangements',
          quantity: 8,
          unitPrice: 125,
          totalPrice: 1000,
          vendorNotes: 'Corporate color scheme'
        }
      ]
    },
    {
      id: 3,
      vendorId: 1,
      userId: 3,
      customerName: "Emma Williams",
      customerEmail: "emma@example.com",
      customerPhone: "+27 84 789 0123",
      eventType: "Birthday Party",
      eventDate: new Date('2024-03-10'),
      eventLocation: "Durban",
      guestCount: 25,
      status: 'accepted',
      totalAmount: 850,
      vendorNotes: "Customer approved the quote. Delivery scheduled for day before event.",
      customerRequirements: "Children's birthday party decorations with unicorn theme. Bright colors and fun arrangements.",
      submittedAt: new Date('2024-01-15'),
      quotedAt: new Date('2024-01-16'),
      respondedAt: new Date('2024-01-17'),
      lineItems: [
        {
          id: '6',
          catalogItemId: 'item_6',
          catalogItemName: 'Unicorn Theme Package',
          quantity: 1,
          unitPrice: 850,
          totalPrice: 850,
          vendorNotes: 'Complete package with balloons and decorations'
        }
      ]
    }
  ]);

  const [messages, setMessages] = useState<QuoteMessage[]>([
    {
      id: 1,
      quoteRequestId: 2,
      senderId: 1,
      senderType: 'vendor',
      senderName: 'Elegant Gardens Venue',
      message: 'Thank you for your quote request. I\'ve prepared a detailed quote based on your requirements. Please review and let me know if you have any questions.',
      messageType: 'quote_update',
      isRead: true,
      sentAt: new Date('2024-01-19T10:30:00')
    },
    {
      id: 2,
      quoteRequestId: 2,
      senderId: 2,
      senderType: 'customer',
      senderName: 'Michael Chen',
      message: 'The quote looks good overall. Could you clarify what\'s included in the setup service?',
      messageType: 'text',
      isRead: true,
      sentAt: new Date('2024-01-19T14:15:00')
    }
  ]);

  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [editingQuote, setEditingQuote] = useState<QuoteRequest | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const getQuotesByStatus = (status: string) => {
    return quoteRequests.filter(quote => quote.status === status);
  };

  const handleEditQuote = (quote: QuoteRequest) => {
    setEditingQuote({ ...quote });
  };

  const handleSaveQuote = () => {
    if (!editingQuote) return;

    const updatedQuotes = quoteRequests.map(quote =>
      quote.id === editingQuote.id
        ? { ...editingQuote, quotedAt: new Date() }
        : quote
    );

    setQuoteRequests(updatedQuotes);
    setEditingQuote(null);
    setSelectedQuote(editingQuote);

    toast({
      title: "Quote Updated",
      description: "The quote has been updated and sent to the customer.",
    });
  };

  const handleSendMessage = (quoteRequestId: number) => {
    if (!newMessage.trim()) return;

    const message: QuoteMessage = {
      id: messages.length + 1,
      quoteRequestId,
      senderId: 1, // Vendor ID
      senderType: 'vendor',
      senderName: 'Elegant Gardens Venue',
      message: newMessage,
      messageType: 'text',
      isRead: false,
      sentAt: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage("");

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the customer.",
    });
  };

  const handleConvertToInvoice = (quote: QuoteRequest) => {
    // In real app, this would create an invoice
    toast({
      title: "Invoice Created",
      description: `Invoice #INV-${quote.id.toString().padStart(4, '0')} has been created for ${quote.customerName}.`,
    });
  };

  const getQuoteMessages = (quoteRequestId: number) => {
    return messages.filter(msg => msg.quoteRequestId === quoteRequestId);
  };

  const calculateTotal = (lineItems: QuoteLineItem[]) => {
    return lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quote Management</h1>
        <div className="text-sm text-muted-foreground">
          Total Pending: {getQuotesByStatus('pending').length} | 
          Accepted: {getQuotesByStatus('accepted').length}
        </div>
      </div>

      <Tabs defaultValue="requested" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requested" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Quotes Requested ({getQuotesByStatus('requested').length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Quotes Pending ({getQuotesByStatus('pending').length})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Accepted Quotes ({getQuotesByStatus('accepted').length})
          </TabsTrigger>
        </TabsList>

        {/* Quotes Requested Tab */}
        <TabsContent value="requested" className="space-y-4">
          {getQuotesByStatus('requested').map((quote) => (
            <Card key={quote.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {quote.customerName}
                      <Badge variant="outline">{quote.eventType}</Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {quote.customerEmail}
                        </span>
                        {quote.customerPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {quote.customerPhone}
                          </span>
                        )}
                        {quote.eventDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(quote.eventDate)}
                          </span>
                        )}
                        {quote.eventLocation && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {quote.eventLocation}
                          </span>
                        )}
                        {quote.guestCount && (
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {quote.guestCount} guests
                          </span>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(quote.submittedAt)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Requested Items
                    </h4>
                    <div className="space-y-2">
                      {quote.lineItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{item.catalogItemName}</span>
                            <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                            {item.customerNotes && (
                              <p className="text-xs text-muted-foreground mt-1">{item.customerNotes}</p>
                            )}
                          </div>
                          <div className="text-sm">
                            {formatCurrency(item.unitPrice)} each
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {quote.customerRequirements && (
                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
                        {quote.customerRequirements}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      Estimated Total: {formatCurrency(calculateTotal(quote.lineItems))}
                    </span>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message Customer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Message to {quote.customerName}</DialogTitle>
                            <DialogDescription>
                              Ask for clarification or provide updates about their quote request.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Type your message here..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <Button onClick={() => handleSendMessage(quote.id)} className="w-full">
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button onClick={() => handleEditQuote(quote)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Create Quote
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Quotes Pending Tab */}
        <TabsContent value="pending" className="space-y-4">
          {getQuotesByStatus('pending').map((quote) => (
            <Card key={quote.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {quote.customerName}
                      <Badge variant="secondary">{quote.eventType}</Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Quote sent on {quote.quotedAt && formatDate(quote.quotedAt)} • Waiting for customer response
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatCurrency(quote.totalAmount || 0)}</div>
                    <div className="text-sm text-muted-foreground">Quote Total</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quote.vendorNotes && (
                    <div className="bg-green-50 p-3 rounded">
                      <h4 className="font-medium text-green-800 mb-1">Your Notes</h4>
                      <p className="text-sm text-green-700">{quote.vendorNotes}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">
                        {getQuoteMessages(quote.id).length} messages
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            View Messages
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Messages with {quote.customerName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {getQuoteMessages(quote.id).map((message) => (
                              <div
                                key={message.id}
                                className={`p-3 rounded ${
                                  message.senderType === 'vendor'
                                    ? 'bg-blue-50 ml-4'
                                    : 'bg-gray-50 mr-4'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-medium">{message.senderName}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {message.sentAt.toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-sm">{message.message}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 pt-4 border-t">
                            <Textarea
                              placeholder="Type your message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              className="flex-1"
                            />
                            <Button onClick={() => handleSendMessage(quote.id)}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button onClick={() => handleEditQuote(quote)} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Quote
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Accepted Quotes Tab */}
        <TabsContent value="accepted" className="space-y-4">
          {getQuotesByStatus('accepted').map((quote) => (
            <Card key={quote.id} className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {quote.customerName}
                      <Badge variant="default" className="bg-green-600">{quote.eventType}</Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Accepted on {quote.respondedAt && formatDate(quote.respondedAt)}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(quote.totalAmount || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Accepted Quote</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-3 rounded">
                    <div className="flex items-center gap-2 text-green-800 mb-2">
                      <Check className="h-4 w-4" />
                      <span className="font-medium">Quote Accepted</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Customer has accepted your quote. You can now convert this to an invoice.
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Event Date: {quote.eventDate && formatDate(quote.eventDate)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Guests: {quote.guestCount}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Customer
                      </Button>
                      <Button onClick={() => handleConvertToInvoice(quote)} className="bg-green-600 hover:bg-green-700">
                        <FileText className="h-4 w-4 mr-2" />
                        Convert to Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Edit Quote Dialog */}
      {editingQuote && (
        <Dialog open={!!editingQuote} onOpenChange={() => setEditingQuote(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Quote for {editingQuote.customerName}</DialogTitle>
              <DialogDescription>
                Update pricing and add notes for the customer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <p className="text-sm text-muted-foreground">{editingQuote.customerName}</p>
                </div>
                <div>
                  <Label>Event</Label>
                  <p className="text-sm text-muted-foreground">
                    {editingQuote.eventType} • {editingQuote.eventDate && formatDate(editingQuote.eventDate)}
                  </p>
                </div>
              </div>

              <div>
                <Label>Quote Items</Label>
                <div className="space-y-3 mt-2">
                  {editingQuote.lineItems.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <span className="font-medium">{item.catalogItemName}</span>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <div>
                          <Label htmlFor={`unit-price-${index}`}>Unit Price</Label>
                          <Input
                            id={`unit-price-${index}`}
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => {
                              const newPrice = parseFloat(e.target.value) || 0;
                              const updatedItems = [...editingQuote.lineItems];
                              updatedItems[index] = {
                                ...item,
                                unitPrice: newPrice,
                                totalPrice: newPrice * item.quantity
                              };
                              setEditingQuote({
                                ...editingQuote,
                                lineItems: updatedItems,
                                totalAmount: calculateTotal(updatedItems)
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label>Total</Label>
                          <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                        </div>
                        <div>
                          <Label htmlFor={`vendor-notes-${index}`}>Notes</Label>
                          <Input
                            id={`vendor-notes-${index}`}
                            placeholder="Add notes..."
                            value={item.vendorNotes || ''}
                            onChange={(e) => {
                              const updatedItems = [...editingQuote.lineItems];
                              updatedItems[index] = {
                                ...item,
                                vendorNotes: e.target.value
                              };
                              setEditingQuote({
                                ...editingQuote,
                                lineItems: updatedItems
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor-notes">Quote Notes</Label>
                  <Textarea
                    id="vendor-notes"
                    placeholder="Add notes for the customer..."
                    value={editingQuote.vendorNotes || ''}
                    onChange={(e) => setEditingQuote({
                      ...editingQuote,
                      vendorNotes: e.target.value
                    })}
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Quote Amount:</span>
                      <span className="text-xl font-bold">
                        {formatCurrency(editingQuote.totalAmount || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingQuote(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveQuote}>
                  Save & Send Quote
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}