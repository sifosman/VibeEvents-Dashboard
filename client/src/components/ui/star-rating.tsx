import React from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating?: number;
  totalStars?: number;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  totalStars = 5,
  size = "md",
  showText = false,
  reviewCount,
  className,
}: StarRatingProps) {
  // Calculate full stars, half stars, and empty stars
  const actualRating = rating || 0;
  const fullStars = Math.floor(actualRating);
  const hasHalfStar = actualRating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  // Set icon size based on the size prop
  const starSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex text-yellow-400">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <i key={`full-${i}`} className={`fas fa-star ${starSize[size]}`}></i>
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <i className={`fas fa-star-half-alt ${starSize[size]}`}></i>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <i key={`empty-${i}`} className={`far fa-star ${starSize[size]}`}></i>
        ))}
      </div>

      {/* Optional review count display */}
      {reviewCount !== undefined && (
        <span className="text-muted-foreground text-subtitle ml-2">
          ({reviewCount})
        </span>
      )}

      {/* Optional text display */}
      {showText && (
        <span className="text-muted-foreground text-subtitle ml-2">
          {actualRating.toFixed(1)} out of {totalStars}
        </span>
      )}
    </div>
  );
}

export default StarRating;
