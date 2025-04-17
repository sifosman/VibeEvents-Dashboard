import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function SubscriptionPlans() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-4">Service Provider Plans</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan to showcase your services to event planners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-8">
              <h3 className="text-xl font-display font-semibold mb-2">Free Listing</h3>
              <div className="text-3xl font-bold mb-6">R0 <span className="text-sm text-muted-foreground font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic business listing</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>40-word description</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>1 contact method</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>1 profile photo</span>
                </li>
              </ul>
              <Link href="/vendor-signup/free">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>

          {/* Basic Plan */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary/20 relative transform scale-105">
            <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium">
              Popular
            </div>
            <div className="p-8">
              <h3 className="text-xl font-display font-semibold mb-2">Basic</h3>
              <div className="text-3xl font-bold mb-6">R50 <span className="text-sm text-muted-foreground font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Enhanced business listing</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>80-word bio</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Full contact details</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Upload 2 photos</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>2-page digital catalogue</span>
                </li>
              </ul>
              <Link href="/vendor-signup/basic">
                <Button className="w-full bg-primary hover:bg-primary/90">Subscribe Now</Button>
              </Link>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-8">
              <h3 className="text-xl font-display font-semibold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-6">R90 <span className="text-sm text-muted-foreground font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Premium business listing</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>7-photo album gallery</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Full contact details with social links</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Google Maps directions</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>6-page digital catalogue</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority online support</span>
                </li>
              </ul>
              <Link href="/vendor-signup/pro">
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white">
                  Go Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Join over 500+ service providers who are growing their business with EventZA
          </p>
          <Link href="/vendor-plans">
            <Button variant="link" className="text-primary hover:text-primary/90">
              Learn more about our vendor plans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}