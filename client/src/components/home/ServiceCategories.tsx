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
    <section className="py-16 bg-neutral">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-4">Browse Service Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Find the perfect professionals to make your event memorable</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 text-center">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <Link key={category.id} href={`/vendors?category=${category.slug}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg group">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url('${category.imageUrl}')` }}
                  ></div>
                  <div className="p-4 text-center">
                    <h3 className="font-display font-medium text-lg mb-1 group-hover:text-primary">{category.name}</h3>
                    <p className="text-subtitle text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link href="/vendors" className="inline-flex items-center text-primary font-medium hover:underline">
            View All Categories
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
