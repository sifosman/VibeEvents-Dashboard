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
        <title>My Subscription | Vibeventz</title>
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

        {/* Subscription Plans */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Basic/Free Plan */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Basic</CardTitle>
                    <p className="text-sm text-muted-foreground">Free</p>
                  </div>
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">Current</span>
                </div>
                <div className="text-3xl font-bold">R0<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-6">
                  <li>• Basic business listing</li>
                  <li>• Up to 5 photos</li>
                  <li>• Contact information display</li>
                  <li>• Customer reviews</li>
                  <li>• Basic search visibility</li>
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              </CardContent>
            </Card>

            {/* Standard Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Standard</CardTitle>
                <p className="text-sm text-muted-foreground">Most Popular</p>
                <div className="text-3xl font-bold">R299<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-6">
                  <li>• Everything in Basic</li>
                  <li>• Up to 20 photos</li>
                  <li>• Video portfolio (3 videos)</li>
                  <li>• Quote request management</li>
                  <li>• Priority search listing</li>
                  <li>• Social media integration</li>
                  <li>• Basic analytics</li>
                </ul>
                <Button className="w-full">
                  Upgrade to Standard
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <p className="text-sm text-muted-foreground">For Professionals</p>
                <div className="text-3xl font-bold">R599<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-6">
                  <li>• Everything in Standard</li>
                  <li>• Unlimited photos</li>
                  <li>• Unlimited videos</li>
                  <li>• Featured business badge</li>
                  <li>• Top search placement</li>
                  <li>• Advanced analytics</li>
                  <li>• Custom branding</li>
                  <li>• Priority customer support</li>
                </ul>
                <Button className="w-full">
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

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
                Register as Vendor/Service Provider
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