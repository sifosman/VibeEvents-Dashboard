import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Vendor } from "@shared/schema";
import { ArrowLeft, ArrowRight, ExternalLink, Globe, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShortlistButton } from "../vendors/ShortlistButton";
import StarRating from "../ui/star-rating";
import { MessageSquare } from "lucide-react";
import { VendorCard } from "../vendors/VendorCard";

export default function FeaturedVendors() {
  const { data: vendors, isLoading } = useQuery<Vendor[]>({
    queryKey: ['/api/vendors/featured'],
  });

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-display font-bold">Featured Vendors</h2>
          <div className="flex space-x-2">
            <Button
              id="prev-vendor"
              variant="outline"
              size="icon"
              className="rounded-full border border-gray-300 text-foreground hover:bg-accent transition"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              id="next-vendor"
              variant="outline"
              size="icon"
              className="rounded-full border border-gray-300 text-foreground hover:bg-accent transition"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="flex flex-row">
                  {/* Left side - Image placeholder */}
                  <div className="w-1/3 bg-gray-200 h-40"></div>
                  
                  {/* Right side - Content placeholder */}
                  <div className="p-3 w-2/3">
                    <div className="flex justify-between">
                      <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
                      <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-100 rounded w-full my-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                    <div className="flex gap-1 mt-2">
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
                
                {/* Footer placeholder */}
                <div className="p-3 pt-1">
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors?.map((vendor) => (
              <div key={vendor.id}>
                <VendorCard vendor={{...vendor, featured: true}} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
