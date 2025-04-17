import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Helmet } from "react-helmet";
import { Vendor, Category } from "@shared/schema";
import { VendorDetail as VendorDetailComponent } from "@/components/vendors/VendorDetail";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function VendorDetail() {
  // Get the vendor ID from the URL
  const params = useParams<{ id: string }>();
  const vendorId = parseInt(params.id);

  // Fetch the vendor details
  const { data: vendor, isLoading, error } = useQuery<Vendor>({
    queryKey: [`/api/vendors/${vendorId}`],
  });

  // Fetch the category details if vendor is loaded
  const { data: category } = useQuery<Category>({
    queryKey: [vendor ? `/api/categories/${vendor.categoryId}` : null],
    enabled: !!vendor,
  });

  if (isLoading) {
    return (
      <div className="bg-neutral py-10">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="mt-8">
              <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vendorId) {
    return (
      <div className="bg-neutral py-10">
        <div className="container-custom">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <h1 className="text-2xl font-display font-bold mb-4">Vendor Not Found</h1>
              <p className="text-muted-foreground mb-6">
                We couldn't find the vendor you're looking for.
              </p>
              <Button asChild className="bg-primary text-white hover:bg-primary/90">
                <a href="/vendors">Browse All Vendors</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{vendor?.name || "Vendor Details"} - WeddingPro</title>
        <meta 
          name="description" 
          content={vendor?.description || "View details about this wedding service provider."}
        />
      </Helmet>
      
      <div className="bg-neutral py-10">
        <div className="container-custom">
          <div className="flex items-center mb-8">
            <Button variant="ghost" asChild className="p-0 mr-3 hover:bg-transparent">
              <a href="javascript:history.back()">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to {category?.name || "Vendors"}
              </a>
            </Button>
          </div>
          
          <VendorDetailComponent vendorId={vendorId} />
        </div>
      </div>
    </>
  );
}
