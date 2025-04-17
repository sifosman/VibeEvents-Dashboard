import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  vendorId: number;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

// Simple version of LikeButton that doesn't depend on auth context
function SimpleLikeButton({ 
  vendorId, 
  className,
  variant = "default",
  size = "icon",
  showText = false
}: LikeButtonProps) {
  const { toast } = useToast();
  
  const defaultClassName = "w-10 h-10 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full flex items-center justify-center transition";
  
  const handleClick = () => {
    toast({
      title: "Please log in",
      description: "You need to be logged in to like vendors.",
      variant: "destructive",
    });
  };
  
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(
        variant === "default" ? defaultClassName : "",
        className
      )}
      onClick={handleClick}
      aria-label="Like vendor"
    >
      <Heart className="text-primary" />
      {showText && <span className="ml-2">Like</span>}
    </Button>
  );
}

export function LikeButton(props: LikeButtonProps) {
  try {
    // Try to use auth context
    const { useAuth } = require("@/context/AuthContext");
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { vendorId, className, variant = "default", size = "icon", showText = false } = props;

    // Check if vendor is already liked (shortlisted)
    const { data, isLoading } = useQuery({
      queryKey: [isAuthenticated ? `/api/shortlists/${user?.id}/${vendorId}` : null],
      enabled: isAuthenticated && !!user?.id,
    });

    const isLiked = data?.isShortlisted;

    // Add to likes mutation
    const addMutation = useMutation({
      mutationFn: async () => {
        return apiRequest('POST', '/api/shortlists', {
          userId: user?.id,
          vendorId: vendorId,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/shortlists/${user?.id}/${vendorId}`] });
        queryClient.invalidateQueries({ queryKey: ['/api/shortlists'] });
        toast({
          title: "Added to Likes",
          description: "Vendor has been added to your liked items.",
        });
      },
    });

    // Remove from likes mutation
    const removeMutation = useMutation({
      mutationFn: async () => {
        return apiRequest('DELETE', `/api/shortlists/${user?.id}/${vendorId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/shortlists/${user?.id}/${vendorId}`] });
        queryClient.invalidateQueries({ queryKey: ['/api/shortlists'] });
        toast({
          title: "Removed from Likes",
          description: "Vendor has been removed from your liked items.",
        });
      },
    });

    const handleToggleLike = () => {
      if (!isAuthenticated) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to like vendors.",
          variant: "destructive",
        });
        return;
      }

      if (isLiked) {
        removeMutation.mutate();
      } else {
        addMutation.mutate();
      }
    };

    // Default stylings for different states
    const defaultClassName = "w-10 h-10 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full flex items-center justify-center transition";
    
    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn(
          variant === "default" ? defaultClassName : "",
          isLiked ? "text-pink-500 hover:text-pink-600" : "text-primary",
          className
        )}
        onClick={handleToggleLike}
        disabled={isLoading || addMutation.isPending || removeMutation.isPending}
        aria-label={isLiked ? "Unlike vendor" : "Like vendor"}
      >
        {isLiked ? (
          <Heart className="text-pink-500 fill-pink-500" />
        ) : (
          <Heart className="text-primary" />
        )}
        {showText && (
          <span className="ml-2">{isLiked ? 'Liked' : 'Like'}</span>
        )}
      </Button>
    );
  } catch (error) {
    // Fall back to the simple version if auth context is not available
    return <SimpleLikeButton {...props} />;
  }
}

// Keep the old name for backward compatibility
export const ShortlistButton = LikeButton;
