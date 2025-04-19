import React from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, ChevronLeft, Plus, Download } from "lucide-react";

export default function QuotesPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container-custom py-10 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Quotes | HowzEventz</title>
        <meta name="description" content="Track and compare vendor quotes for your event" />
      </Helmet>

      <div className="container-custom py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => setLocation("/planner")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to My Planning
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-display font-bold flex items-center">
                <FileText className="h-7 w-7 mr-3 text-primary" />
                Quotes
              </h1>
              <p className="text-muted-foreground mt-1">Track and compare vendor quotes for your event</p>
            </div>
            <Button className="bg-primary text-white">
              <Plus className="h-4 w-4 mr-2" /> Request Quote
            </Button>
          </div>
        </div>

        {/* Quotes list placeholder */}
        <div className="border rounded-lg p-8 bg-background">
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">Your Vendor Quotes</h2>
            <p className="text-muted-foreground mb-6">Request and compare quotes from your favorite vendors</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Request Your First Quote
            </Button>
          </div>
        </div>

        {/* Quote comparison section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quote Comparison</h2>
          <div className="border rounded-lg p-6 bg-background">
            <p className="text-center text-muted-foreground py-8">
              Once you have received quotes from multiple vendors, you'll be able to compare them here.
            </p>
          </div>
        </div>

        {/* Quote templates section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quote Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-5 bg-background">
              <h3 className="font-medium mb-2">Venue Quote Request</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A comprehensive template for requesting quotes from venues
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
            <div className="border rounded-lg p-5 bg-background">
              <h3 className="font-medium mb-2">Catering Quote Request</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed template for food and beverage service quotes
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
            <div className="border rounded-lg p-5 bg-background">
              <h3 className="font-medium mb-2">Entertainment Quote Request</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Template for DJs, bands and other entertainment services
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </div>
        </div>

        {/* Tips for quotes */}
        <div className="mt-8 bg-accent/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Quote Comparison Tips</h2>
          <p className="text-muted-foreground mb-4">Get the most value from your vendor quotes</p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Request quotes from at least 3 vendors in each category</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Make sure quotes include all fees, taxes, and potential extras</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Don't just compare prices - consider quality, reviews, and included services</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">•</span>
              <span>Ask about payment schedules and cancellation policies</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}