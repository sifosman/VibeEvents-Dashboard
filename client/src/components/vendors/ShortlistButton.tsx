import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface ShortlistButtonProps {
  vendorId: number;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

// Simple version of ShortlistButton that doesn't depend on auth context
function SimpleShortlistButton({ 
  vendorId, 
  className,
  variant = "default",
  size = "icon"
}: ShortlistButtonProps) {
  const { toast } = useToast();
  
  const defaultClassName = "w-10 h-10 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full flex items-center justify-center transition";
  
  const handleClick = () => {
    toast({
      title: "Please log in",
      description: "You need to be logged in to shortlist vendors.",
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
      aria-label="Add to shortlist"
    >
      <Heart className="text-primary" />
    </Button>
  );
}

export function ShortlistButton(props: ShortlistButtonProps) {
  try {
    // Try to use auth context
    const { useAuth } = require("@/context/AuthContext");
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { vendorId, className, variant = "default", size = "icon" } = props;

    // Check if vendor is already shortlisted
    const { data, isLoading } = useQuery({
      queryKey: [isAuthenticated ? `/api/shortlists/${user?.id}/${vendorId}` : null],
      enabled: isAuthenticated && !!user?.id,
    });

    const isShortlisted = data?.isShortlisted;

    // Add to shortlist mutation
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
          title: "Added to shortlist",
          description: "Vendor has been added to your shortlist.",
        });
      },
    });

    // Remove from shortlist mutation
    const removeMutation = useMutation({
      mutationFn: async () => {
        return apiRequest('DELETE', `/api/shortlists/${user?.id}/${vendorId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/shortlists/${user?.id}/${vendorId}`] });
        queryClient.invalidateQueries({ queryKey: ['/api/shortlists'] });
        toast({
          title: "Removed from shortlist",
          description: "Vendor has been removed from your shortlist.",
        });
      },
    });

    const handleToggleFavorite = () => {
      if (!isAuthenticated) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to shortlist vendors.",
          variant: "destructive",
        });
        return;
      }

      if (isShortlisted) {
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
          className
        )}
        onClick={handleToggleFavorite}
        disabled={isLoading || addMutation.isPending || removeMutation.isPending}
        aria-label={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
      >
        {isShortlisted ? (
          <Heart className="text-primary fill-primary" />
        ) : (
          <Heart className="text-primary" />
        )}
      </Button>
    );
  } catch (error) {
    // Fall back to the simple version if auth context is not available
    return <SimpleShortlistButton {...props} />;
  }
}
