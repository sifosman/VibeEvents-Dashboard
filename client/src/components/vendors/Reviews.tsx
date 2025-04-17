import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Review, 
  InsertReview,
  Vendor,
  User
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import StarRating from "../ui/star-rating";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";

interface ReviewsProps {
  vendorId: number;
  userId?: number;
  vendor?: Vendor;
}

// Create a zod schema for review form validation
const reviewFormSchema = z.object({
  rating: z.number().min(1, "Please provide a rating").max(5),
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  reviewText: z.string()
    .min(10, "Review must be at least 10 characters")
    .refine(
      (text) => text.split(/\s+/).length <= 120,
      "Review must be 120 words or less"
    ),
  eventDate: z.date().nullable().optional(),
  serviceUsed: z.string().nullable().optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export default function Reviews({ vendorId, userId, vendor }: ReviewsProps) {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch reviews for this vendor
  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: [`/api/reviews`, { vendorId }],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?vendorId=${vendorId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      return response.json();
    },
  });

  // Form setup for submitting reviews
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      title: "",
      reviewText: "",
      eventDate: null,
      serviceUsed: "",
    },
  });

  // Mutation for submitting a new review
  const submitReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormValues) => {
      return apiRequest("POST", "/api/reviews", {
        ...data,
        vendorId,
        userId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback! Your review has been submitted.",
        variant: "default",
      });
      
      // Invalidate and refetch reviews
      queryClient.invalidateQueries([`/api/reviews`, { vendorId }]);
      queryClient.invalidateQueries([`/api/vendors/${vendorId}`]);
      
      // Reset form and close dialog
      form.reset();
      setIsSubmitDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting review",
        description: error.message || "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormValues) => {
    submitReviewMutation.mutate(data);
  };

  if (reviewsLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-100 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-semibold">
          Reviews & Ratings 
          {reviews && reviews.length > 0 && (
            <span className="ml-2 text-muted-foreground text-lg">
              ({reviews.length})
            </span>
          )}
        </h2>
        
        {userId && (
          <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>
                  Share your experience with {vendor?.name}. Your review helps others make informed decisions.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <StarRating
                              rating={field.value}
                              size="lg"
                              isEditable
                              onChange={(newRating) => field.onChange(newRating)}
                            />
                            <span className="ml-2 text-sm text-muted-foreground">
                              {field.value > 0 ? `${field.value} stars` : "Select a rating"}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Summarize your experience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reviewText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Review</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share details of your experience..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                          <span>Maximum 120 words</span>
                          <span>
                            {field.value ? field.value.split(/\s+/).length : 0} / 120 words
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Date (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="date" 
                                onChange={(e) => {
                                  const date = e.target.value ? new Date(e.target.value) : null;
                                  field.onChange(date);
                                }}
                                value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                              />
                              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="serviceUsed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Used (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Catering, Decor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsSubmitDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={submitReviewMutation.isPending}
                    >
                      {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{review.title}</CardTitle>
                    <div className="flex items-center mt-1">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-xs text-muted-foreground ml-2">
                        {format(new Date(review.createdAt || ''), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  {review.isVerified && (
                    <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </div>
                  )}
                </div>
                {(review.serviceUsed || review.eventDate) && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {review.serviceUsed && <span>{review.serviceUsed}</span>}
                    {review.serviceUsed && review.eventDate && <span> • </span>}
                    {review.eventDate && <span>Event date: {format(new Date(review.eventDate), 'MMM d, yyyy')}</span>}
                  </div>
                )}
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm">{review.reviewText}</p>
              </CardContent>
              
              {review.adminReply && (
                <div className="bg-muted px-6 py-4 border-t">
                  <div className="text-sm font-medium">Response from {vendor?.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 mb-2">
                    {review.adminReplyDate && format(new Date(review.adminReplyDate), 'MMM d, yyyy')}
                  </div>
                  <p className="text-sm">{review.adminReply}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg bg-muted/50">
          <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
          <p className="text-muted-foreground mb-4">Be the first to share your experience with {vendor?.name}</p>
          {userId && (
            <Button 
              variant="outline" 
              onClick={() => setIsSubmitDialogOpen(true)}
            >
              Write a Review
            </Button>
          )}
        </div>
      )}
    </div>
  );
}