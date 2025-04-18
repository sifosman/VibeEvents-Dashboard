import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { ArrowRight } from "lucide-react";

export default function ServiceCategories() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Group categories into rows of 4
  const groupedCategories = React.useMemo(() => {
    if (!categories) return [];
    const result = [];
    for (let i = 0; i < categories.length; i += 4) {
      result.push(categories.slice(i, i + 4));
    }
    return result;
  }, [categories]);

  return (
    <section className="py-8 bg-neutral">
      <div className="container-custom">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-display font-bold mb-2">Service Categories</h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">Find the perfect professionals to make your event memorable</p>
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="animate-pulse">
              {[...Array(3)].map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-4 gap-3 mb-3">
                  {[...Array(4)].map((_, colIndex) => (
                    <div key={colIndex} className="h-6 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4">
            {groupedCategories.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                {row.map((category) => (
                  <Link 
                    key={category.id} 
                    href={`/vendors?category=${category.slug}`}
                    className="text-sm px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-center"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-4">
          <Link href="/vendors" className="inline-flex items-center text-primary font-medium text-sm hover:underline">
            View All Categories
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
