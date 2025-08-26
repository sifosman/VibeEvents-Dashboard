import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ChevronLeft, Plus, Download, Clock, Edit, CheckCircle, AlertCircle, DollarSign } from "lucide-react";

interface Quote {
  id: number;
  vendor: string;
  service: string;
  amount: number;
  status: 'requested' | 'pending' | 'amended' | 'finalised';
  dateRequested: string;
  description: string;
  category: string;
}

export default function QuotesPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('all');

  const quotes: Quote[] = [
    {
      id: 1,
      vendor: "Sunset Gardens Venue",
      service: "Wedding Reception Venue",
      amount: 4500,
      status: 'finalised',
      dateRequested: '2024-01-15',
      description: "Reception venue for 120 guests with catering included",
      category: "Venue"
    },
    {
      id: 2,
      vendor: "Elite Catering Co.",
      service: "Buffet Catering Service",
      amount: 2800,
      status: 'amended',
      dateRequested: '2024-01-20',
      description: "3-course buffet for 120 guests, vegetarian options included",
      category: "Catering"
    },
    {
      id: 3,
      vendor: "Perfect Moments Photography",
      service: "Wedding Photography Package",
      amount: 1200,
      status: 'pending',
      dateRequested: '2024-02-01',
      description: "8-hour wedding photography with 500+ edited photos",
      category: "Photography"
    },
    {
      id: 4,
      vendor: "Blooming Beautiful Florists",
      service: "Bridal Bouquet & Centerpieces",
      amount: 650,
      status: 'requested',
      dateRequested: '2024-02-05',
      description: "Bridal bouquet, bridesmaids bouquets, and 12 centerpieces",
      category: "Flowers"
    },
    {
      id: 5,
      vendor: "Sound & Vision DJ Services",
      service: "Wedding DJ & Sound System",
      amount: 800,
      status: 'pending',
      dateRequested: '2024-01-25',
      description: "6-hour DJ service with sound system and lighting",
      category: "Entertainment"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'amended': return 'bg-orange-100 text-orange-800';
      case 'finalised': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'requested': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'amended': return <Edit className="h-4 w-4" />;
      case 'finalised': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const filterQuotes = (status: string) => {
    if (status === 'all') return quotes;
    return quotes.filter(quote => quote.status === status);
  };

  const renderQuoteCard = (quote: Quote) => (
    <Card key={quote.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{quote.vendor}</CardTitle>
            <p className="text-muted-foreground text-sm">{quote.service}</p>
          </div>
          <Badge className={`${getStatusColor(quote.status)} flex items-center gap-1`}>
            {getStatusIcon(quote.status)}
            {quote.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm">{quote.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Category: {quote.category}</span>
              <span className="text-sm text-muted-foreground">Requested: {quote.dateRequested}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-lg font-semibold">${quote.amount.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-3 w-3 mr-1" />
              View Details
            </Button>
            {quote.status === 'pending' && (
              <Button variant="outline" size="sm">
                <Edit className="h-3 w-3 mr-1" />
                Amend
              </Button>
            )}
            {quote.status === 'amended' && (
              <Button size="sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                Approve
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>My Quotes | Vibeventz</title>
        <meta name="description" content="Manage your vendor quotes by status" />
      </Helmet>

      <div className="container mx-auto py-4 px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => setLocation("/planner")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to My Planner
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-display font-bold flex items-center">
                <FileText className="h-6 w-6 mr-2 text-primary" />
                My Quotes
              </h1>
              <p className="text-muted-foreground mt-1">Track your vendor quotes by status</p>
            </div>
            <Button className="bg-primary text-white">
              <Plus className="h-4 w-4 mr-2" /> Request Quote
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({quotes.length})</TabsTrigger>
            <TabsTrigger value="requested">
              Requested ({quotes.filter(q => q.status === 'requested').length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({quotes.filter(q => q.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="amended">
              Amended ({quotes.filter(q => q.status === 'amended').length})
            </TabsTrigger>
            <TabsTrigger value="finalised">
              Finalised ({quotes.filter(q => q.status === 'finalised').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {filterQuotes('all').map(quote => renderQuoteCard(quote))}
            </div>
          </TabsContent>

          <TabsContent value="requested">
            <div className="space-y-4">
              {filterQuotes('requested').length > 0 ? (
                filterQuotes('requested').map(quote => renderQuoteCard(quote))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No requested quotes
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="space-y-4">
              {filterQuotes('pending').length > 0 ? (
                filterQuotes('pending').map(quote => renderQuoteCard(quote))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No pending quotes
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="amended">
            <div className="space-y-4">
              {filterQuotes('amended').length > 0 ? (
                filterQuotes('amended').map(quote => renderQuoteCard(quote))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No amended quotes
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="finalised">
            <div className="space-y-4">
              {filterQuotes('finalised').length > 0 ? (
                filterQuotes('finalised').map(quote => renderQuoteCard(quote))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No finalised quotes
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Quote Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-xl font-semibold">
                  ${quotes.reduce((sum, quote) => sum + quote.amount, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Finalised</p>
                <p className="text-xl font-semibold text-green-600">
                  ${quotes.filter(q => q.status === 'finalised').reduce((sum, quote) => sum + quote.amount, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-semibold text-blue-600">
                  ${quotes.filter(q => q.status === 'pending').reduce((sum, quote) => sum + quote.amount, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-xl font-semibold text-orange-600">
                  ${quotes.filter(q => q.status === 'requested' || q.status === 'amended').reduce((sum, quote) => sum + quote.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}