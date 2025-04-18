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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-neutral rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-full my-4"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                      <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                      <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors?.map((vendor) => (
              <div key={vendor.id} className="bg-neutral rounded-lg shadow-md overflow-hidden">
                <div 
                  className="relative h-64 bg-cover bg-center" 
                  style={{ backgroundImage: `url('${vendor.imageUrl}')` }}
                >
                  <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 rounded-tr">
                    <span className="text-sm font-medium">{vendor.categoryId}</span>
                  </div>
                  <ShortlistButton vendorId={vendor.id} className="absolute top-4 right-4" />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-display font-bold text-xl mb-1">{vendor.name}</h3>
                      <StarRating rating={vendor.rating} reviewCount={vendor.reviewCount} />
                    </div>
                    <div className="price-badge">
                      <span>{vendor.priceRange}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{vendor.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      {vendor.instagramUrl && (
                        <a href={vendor.instagramUrl} className="text-foreground hover:text-primary transition" title="Visit Instagram" target="_blank" rel="noopener noreferrer">
                          <Instagram size={16} />
                        </a>
                      )}
                      {vendor.websiteUrl && (
                        <a href={vendor.websiteUrl} className="text-foreground hover:text-primary transition" title="Visit Website" target="_blank" rel="noopener noreferrer">
                          <Globe size={16} />
                        </a>
                      )}
                      {vendor.whatsappNumber && (
                        <a href={`https://wa.me/${vendor.whatsappNumber.replace(/[^0-9]/g, '')}`} className="text-foreground hover:text-primary transition" title="Contact via WhatsApp" target="_blank" rel="noopener noreferrer">
                          <MessageSquare size={16} />
                        </a>
                      )}
                    </div>
                    <Link href={`/vendors/${vendor.id}`} className="text-primary font-medium hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
