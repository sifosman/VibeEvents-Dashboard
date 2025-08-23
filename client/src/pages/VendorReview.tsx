import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Vendor } from "@shared/schema";
import { 
  ArrowLeft, 
  Star, 
  Send, 
  CheckCircle,
  Users,
  Award,
  Package,
  Sparkles,
  Phone,
  Eye
} from "lucide-react";

interface StarRatingProps {
  label: string;
  icon: React.ReactNode;
  rating: number;
  onRatingChange: (rating: number) => void;
}

function StarRating({ label, icon, rating, onRatingChange }: StarRatingProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <Label className="font-medium">{label}</Label>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="transition-colors duration-200"
          >
            <Star 
              className={`h-6 w-6 ${
                star <= rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating > 0 ? `${rating}/5` : 'No rating'}
        </span>
      </div>
    </div>
  );
}

export default function VendorReview() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const vendorId = params.id ? parseInt(params.id) : 0;

  const [ratings, setRatings] = useState({
    efficiency: 0,
    professionalism: 0,
    conditionOfGoods: 0,
    competencyOfPeople: 0,
    cleanliness: 0,
    attentionToDetail: 0,
    easeOfReaching: 0
  });

  const [experienceSummary, setExperienceSummary] = useState("");
  const [generalComments, setGeneralComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch vendor details
  const { data: vendor, isLoading } = useQuery<Vendor>({
    queryKey: ['/api/vendors', String(vendorId)],
    enabled: vendorId > 0,
  });

  const ratingCriteria = [
    {
      key: 'efficiency' as keyof typeof ratings,
      label: 'Efficiency',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      key: 'professionalism' as keyof typeof ratings,
      label: 'Professionalism',
      icon: <Award className="h-5 w-5 text-blue-600" />
    },
    {
      key: 'conditionOfGoods' as keyof typeof ratings,
      label: 'Condition of Goods',
      icon: <Package className="h-5 w-5 text-purple-600" />
    },
    {
      key: 'competencyOfPeople' as keyof typeof ratings,
      label: 'Competency of People Dealt With',
      icon: <Users className="h-5 w-5 text-orange-600" />
    },
    {
      key: 'cleanliness' as keyof typeof ratings,
      label: 'Cleanliness',
      icon: <Sparkles className="h-5 w-5 text-pink-600" />
    },
    {
      key: 'attentionToDetail' as keyof typeof ratings,
      label: 'Attention to Detail',
      icon: <Eye className="h-5 w-5 text-indigo-600" />
    },
    {
      key: 'easeOfReaching' as keyof typeof ratings,
      label: 'Ease with Which You Could Reach Them',
      icon: <Phone className="h-5 w-5 text-teal-600" />
    }
  ];

  const handleRatingChange = (criteria: keyof typeof ratings, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [criteria]: rating
    }));
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      const reviewData = {
        vendorId,
        ratings,
        experienceSummary,
        generalComments,
        timestamp: new Date().toISOString()
      };
      
      console.log("Submitting review:", reviewData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      
      // Redirect after successful submission
      setTimeout(() => {
        setLocation(`/vendors/${vendorId}`);
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const hasAllRatings = Object.values(ratings).every(rating => rating > 0);
    const hasExperienceSummary = experienceSummary.trim().length > 10;
    return hasAllRatings && hasExperienceSummary;
  };

  const calculateAverageRating = () => {
    const validRatings = Object.values(ratings).filter(rating => rating > 0);
    if (validRatings.length === 0) return 0;
    return validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
  };

  if (isLoading) {
    return (
      <div className="bg-neutral min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 w-48 bg-gray-100 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="bg-neutral min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
          <Button onClick={() => setLocation("/vendors")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vendors
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Review Submitted - HowzEventz</title>
        </Helmet>
        
        <div className="bg-neutral min-h-[calc(100vh-64px)] flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Review Submitted!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for your feedback about {vendor.name}. Your review helps other users make informed decisions.
              </p>
              <Button onClick={() => setLocation(`/vendors/${vendorId}`)}>
                Back to Vendor
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Review ${vendor.name} - HowzEventz`}</title>
        <meta name="description" content={`Share your experience and rate ${vendor.name}`} />
      </Helmet>

      <div className="bg-neutral min-h-[calc(100vh-64px)]">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setLocation(`/vendors/${vendorId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold">Review {vendor.name}</h1>
              <p className="text-muted-foreground">Share your experience to help other users</p>
            </div>
          </div>

          <div className="grid gap-6 max-w-4xl">
            {/* Vendor Info Summary */}
            <Card>
              <CardHeader>
                <CardTitle>About {vendor.name}</CardTitle>
                <CardDescription>{vendor.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Location: {vendor.location}</span>
                  <span>•</span>
                  <span>Price Range: {vendor.priceRange}</span>
                </div>
              </CardContent>
            </Card>

            {/* Star Ratings */}
            <Card>
              <CardHeader>
                <CardTitle>Rate Your Experience</CardTitle>
                <CardDescription>
                  Please rate the following aspects of your experience with {vendor.name} (1-5 stars)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {ratingCriteria.map((criteria) => (
                  <StarRating
                    key={criteria.key}
                    label={criteria.label}
                    icon={criteria.icon}
                    rating={ratings[criteria.key]}
                    onRatingChange={(rating) => handleRatingChange(criteria.key, rating)}
                  />
                ))}
                
                {calculateAverageRating() > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        Overall Rating: {calculateAverageRating().toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experience Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Experience Summary</CardTitle>
                <CardDescription>
                  Summarise your experience and any feedback from your guests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={experienceSummary}
                  onChange={(e) => setExperienceSummary(e.target.value)}
                  placeholder="Please describe your overall experience with this vendor, including any feedback you received from your guests. What went well? Were there any issues? Would you recommend them to others?"
                  className="min-h-32"
                  maxLength={1000}
                />
                <div className="text-right text-sm text-muted-foreground mt-2">
                  {experienceSummary.length}/1000 characters
                </div>
              </CardContent>
            </Card>

            {/* General Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Comments & Suggestions</CardTitle>
                <CardDescription>
                  Optional: Any additional feedback or suggestions for improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generalComments}
                  onChange={(e) => setGeneralComments(e.target.value)}
                  placeholder="Share any additional thoughts, suggestions for improvement, or other details that might be helpful for future customers..."
                  className="min-h-24"
                  maxLength={500}
                />
                <div className="text-right text-sm text-muted-foreground mt-2">
                  {generalComments.length}/500 characters
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleSubmitReview}
                disabled={!isFormValid() || isSubmitting}
                size="lg"
                className="min-w-48"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>

            {!isFormValid() && (
              <div className="text-center text-sm text-muted-foreground">
                Please complete all star ratings and provide an experience summary to submit your review.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}