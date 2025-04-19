import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";

export default function ServiceCategories() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Group categories into rows of 3
  const groupedCategories = React.useMemo(() => {
    if (!categories) return [];
    const result = [];
    for (let i = 0; i < categories.length; i += 3) {
      result.push(categories.slice(i, i + 3));
    }
    return result;
  }, [categories]);

  return (
    <>
      <Helmet>
        <title>Service Categories | HowzEvent</title>
        <meta name="description" content="Browse our comprehensive list of service categories for your event planning needs." />
      </Helmet>

      <div className="container-custom py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-4">Service Categories</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Find the perfect professionals to make your event memorable</p>
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded shadow-sm p-8">
            <div className="animate-pulse">
              {[...Array(6)].map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {[...Array(3)].map((_, colIndex) => (
                    <div key={colIndex} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((category) => (
              <Link 
                key={category.id} 
                href={`/vendors?category=${category.slug}`}
              >
                <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 text-center cursor-pointer">
                  <h3 className="font-bold text-lg mb-3">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <Button variant="outline" className="mt-2 text-primary">
                    Browse {category.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}