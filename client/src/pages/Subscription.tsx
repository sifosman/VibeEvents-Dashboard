import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreditCard, ChevronLeft, ChevronDown, UserPlus, Building } from "lucide-react";

export default function Subscription() {
  const [, setLocation] = useLocation();

  return (
    <>
      <Helmet>
        <title>My Subscription | HowzEventz</title>
        <meta name="description" content="Manage your subscription and registration options" />
      </Helmet>

      <div className="container mx-auto py-4 px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => setLocation("/account")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to My Account
          </Button>

          <div className="flex items-center gap-4">
            <CreditCard className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-display font-bold">My Subscription</h1>
            <span className="text-muted-foreground">Manage your subscription and business registration</span>
          </div>
        </div>

        {/* Current Subscription Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Free Plan</span>
                <span className="text-2xl font-bold">R0/month</span>
              </div>
              <p className="text-muted-foreground">
                You're currently on the free plan. Upgrade to access premium features and grow your business.
              </p>
              <Button className="mt-4">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Registration Options Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Vendor/Service Provider
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Register your service business to offer event planning services like catering, photography, entertainment, and more.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• List your services and pricing</li>
                <li>• Receive quote requests from customers</li>
                <li>• Manage bookings and availability</li>
                <li>• Build your business profile</li>
              </ul>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => setLocation("/vendor-registration")}
              >
                Register as Service Provider
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Venue Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                List your venue for weddings, corporate events, celebrations, and other special occasions.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Showcase your venue spaces</li>
                <li>• Set availability and pricing</li>
                <li>• Receive booking inquiries</li>
                <li>• Manage event calendar</li>
              </ul>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => setLocation("/venue-registration")}
              >
                Register Your Venue
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Why Register Your Business?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Grow Your Customer Base</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with event planners actively looking for your services
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Get paid securely through our integrated payment system
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Professional Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Showcase your work with photos, reviews, and detailed descriptions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}