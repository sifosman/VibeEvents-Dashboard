import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { ArrowRight } from "lucide-react";

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
    <section className="py-5 bg-neutral">
      <div className="container-custom">
        <div className="text-center mb-3">
          <h2 className="text-xl font-display font-bold mb-1">Service Categories</h2>
          <p className="text-muted-foreground text-xs max-w-xl mx-auto">Find the perfect professionals to make your event memorable</p>
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded shadow-sm p-3">
            <div className="animate-pulse">
              {[...Array(3)].map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-3 gap-2 mb-1.5">
                  {[...Array(3)].map((_, colIndex) => (
                    <div key={colIndex} className="h-5 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded shadow-sm p-3">
            {groupedCategories.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-3 gap-2 mb-1.5">
                {row.map((category) => (
                  <Link 
                    key={category.id} 
                    href={`/vendors?category=${category.slug}`}
                    className="text-xs px-2 py-1 rounded hover:bg-primary/10 hover:text-primary transition-colors text-center"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-2">
          <Link href="/vendors" className="inline-flex items-center text-primary font-medium text-xs hover:underline">
            View All Categories
            <ArrowRight className="w-2.5 h-2.5 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
