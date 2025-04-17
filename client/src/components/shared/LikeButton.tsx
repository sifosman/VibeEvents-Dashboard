import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface LikeButtonProps {
  vendorId: number;
  userId?: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onLiked?: (liked: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  vendorId,
  userId = 1, // Default user ID (temporary until auth is implemented)
  size = 'md',
  showText = false,
  className = '',
  onLiked,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Size variants
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Check if this vendor is already liked
  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/shortlists/${userId}/${vendorId}`);
        const data = await response.json();
        setIsLiked(data.isShortlisted);
      } catch (error) {
        console.error('Error checking like status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && vendorId) {
      checkIfLiked();
    }
  }, [userId, vendorId]);

  const toggleLike = async () => {
    if (!userId) {
      toast({
        title: 'Login Required',
        description: 'Please log in to like items',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (isLiked) {
        // Remove from likes
        await apiRequest('DELETE', `/api/shortlists/${userId}/${vendorId}`);
        
        toast({
          title: 'Removed from Likes',
          description: 'Item removed from your liked collection',
        });
      } else {
        // Add to likes
        await apiRequest('POST', '/api/shortlists', {
          userId,
          vendorId,
        });
        
        toast({
          title: 'Added to Likes',
          description: 'Item added to your liked collection',
        });
      }
      
      // Update state and refresh queries
      setIsLiked(!isLiked);
      queryClient.invalidateQueries(['/api/shortlists']);
      
      // Callback if provided
      if (onLiked) {
        onLiked(!isLiked);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update liked status',
        variant: 'destructive',
      });
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={isLiked ? 'default' : 'outline'}
      size={showText ? 'default' : 'icon'}
      className={`${className} ${isLiked ? 'bg-pink-500 text-white hover:bg-pink-600' : ''}`}
      onClick={toggleLike}
      disabled={isLoading}
    >
      <Heart className={`${sizeClasses[size]} ${isLiked ? 'fill-current' : ''}`} />
      {showText && <span className="ml-2">{isLiked ? 'Liked' : 'Like'}</span>}
    </Button>
  );
};

export default LikeButton;