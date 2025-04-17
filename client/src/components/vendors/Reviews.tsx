import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Review, Vendor } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, MessageSquare, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReviewsProps {
  vendorId: number;
  userId?: number;
  vendor?: Vendor;
}

export default function Reviews({ vendorId, userId, vendor }: ReviewsProps) {
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check if user can leave a review (already authenticated)
  const canReview = !!userId;
  
  // Check if vendor subscription allows reviews
  const allowsComments = vendor?.subscriptionTier === 'premium' || vendor?.subscriptionTier === 'premium pro';
  
  // Fetch reviews for this vendor
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews', vendorId],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?vendorId=${vendorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return response.json();
    },
  });
  
  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error('You must be logged in to leave a review');
      }
      
      const reviewData = {
        userId,
        vendorId,
        rating,
        reviewText,
        title,
        eventDate: new Date().toISOString(), // Can be modified to allow selecting a past event date
      };
      
      return apiRequest('POST', '/api/reviews', reviewData);
    },
    onSuccess: () => {
      toast({
        title: 'Review submitted',
        description: 'Thank you for sharing your experience!',
      });
      
      // Reset form
      setRating(5);
      setReviewText('');
      setTitle('');
      
      // Refresh reviews list
      queryClient.invalidateQueries(['/api/reviews', vendorId]);
      queryClient.invalidateQueries(['/api/vendors', vendorId]);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error submitting review',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!title.trim()) {
      toast({
        title: 'Please add a title to your review',
        variant: 'destructive',
      });
      return;
    }
    
    if (reviewText.trim().length < 10) {
      toast({
        title: 'Review is too short',
        description: 'Please provide more details about your experience',
        variant: 'destructive',
      });
      return;
    }
    
    if (reviewText.trim().split(/\s+/).length > 120) {
      toast({
        title: 'Review is too long',
        description: 'Please limit your review to 120 words',
        variant: 'destructive',
      });
      return;
    }
    
    submitReviewMutation.mutate();
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  if (!allowsComments) {
    return null; // Don't render the component if vendor doesn't have premium subscription
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{reviews?.length || 0}</span>
        </div>
      </div>
      
      {/* Review submission form (only for authenticated users) */}
      {canReview && (
        <Card className="mb-8">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Share Your Experience</CardTitle>
              <CardDescription>
                Your honest feedback helps others find the right services
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Select
                  value={rating.toString()}
                  onValueChange={(value) => setRating(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">★★★★★ (Excellent)</SelectItem>
                    <SelectItem value="4">★★★★☆ (Very Good)</SelectItem>
                    <SelectItem value="3">★★★☆☆ (Good)</SelectItem>
                    <SelectItem value="2">★★☆☆☆ (Fair)</SelectItem>
                    <SelectItem value="1">★☆☆☆☆ (Poor)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Review Title</Label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Summarize your experience"
                  maxLength={60}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="review-text">Your Review</Label>
                  <span className="text-xs text-muted-foreground">
                    {reviewText.trim().split(/\s+/).length}/120 words
                  </span>
                </div>
                <Textarea
                  id="review-text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell others about your experience with this vendor"
                  className="min-h-[100px]"
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                disabled={submitReviewMutation.isPending}
              >
                {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
      
      {/* Reviews list */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading reviews...</p>
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{review.title}</CardTitle>
                    <div className="flex items-center mt-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  {review.isVerified && (
                    <div className="flex items-center text-green-600 text-sm">
                      <div className="bg-green-100 rounded-full p-1 mr-1">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      Verified Purchase
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground">By {review.user?.username || 'Anonymous User'}</p>
                <p className="mt-3">{review.reviewText}</p>
                
                {review.adminReply && (
                  <div className="mt-4 bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Response from {vendor?.name}
                    </p>
                    <p className="mt-1 text-sm">{review.adminReply}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Reviews Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            This vendor hasn't received any reviews yet. Be the first to share your experience!
          </p>
        </Card>
      )}
    </div>
  );
}