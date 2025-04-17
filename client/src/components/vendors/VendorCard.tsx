import React from "react";
import { Link } from "wouter";
import { Vendor, Category } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Instagram, MessageSquare } from "lucide-react";
import StarRating from "../ui/star-rating";
import { LikeButton } from "./ShortlistButton";

interface VendorCardProps {
  vendor: Vendor;
  category?: Category;
}

export function VendorCard({ vendor, category }: VendorCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition h-full">
      <div 
        className="relative h-48 bg-cover bg-center" 
        style={{ backgroundImage: `url('${vendor.imageUrl}')` }}
      >
        <LikeButton vendorId={vendor.id} className="absolute top-4 right-4" size="sm" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-display font-medium text-lg mb-1 group-hover:text-primary transition">
          {vendor.name}
        </h3>
        <div className="flex justify-between items-center mb-2">
          <StarRating rating={vendor.rating} reviewCount={vendor.reviewCount} size="sm" />
          <span className="category-badge">
            {category?.name || "Vendor"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{vendor.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            {vendor.instagramUrl && (
              <a 
                href={vendor.instagramUrl} 
                className="text-foreground hover:text-primary transition" 
                title="Visit Instagram" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Instagram size={16} />
              </a>
            )}
            {vendor.websiteUrl && (
              <a 
                href={vendor.websiteUrl} 
                className="text-foreground hover:text-primary transition" 
                title="Visit Website" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Globe size={16} />
              </a>
            )}
            {vendor.whatsappNumber && (
              <a 
                href={`https://wa.me/${vendor.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                className="text-foreground hover:text-primary transition" 
                title="Contact via WhatsApp" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <MessageSquare size={16} />
              </a>
            )}
          </div>
          <Link href={`/vendors/${vendor.id}`} className="text-primary text-sm font-medium hover:underline">
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
