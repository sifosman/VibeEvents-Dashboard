import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { ArrowRight } from "lucide-react";

export default function ServiceCategories() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  return (
    <section className="py-12 bg-neutral">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-bold mb-2">Browse Service Categories</h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">Find the perfect professionals to make your event memorable</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-20 bg-gray-200"></div>
                <div className="p-2 text-center">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-1"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories?.map((category) => (
              <Link key={category.id} href={`/vendors?category=${category.slug}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg group">
                  <div
                    className="h-20 bg-cover bg-center"
                    style={{ backgroundImage: `url('${category.imageUrl}')` }}
                  ></div>
                  <div className="p-2 text-center">
                    <h3 className="font-display font-medium text-sm mb-0.5 group-hover:text-primary">{category.name}</h3>
                    <p className="text-subtitle text-muted-foreground text-xs line-clamp-1">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="text-center mt-6">
          <Link href="/vendors" className="inline-flex items-center text-primary font-medium text-sm hover:underline">
            View All Categories
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
