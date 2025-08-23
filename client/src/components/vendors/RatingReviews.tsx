import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  User, 
  ThumbsUp, 
  MessageSquare,
  CheckCircle,
  Award,
  Package,
  Users,
  Sparkles,
  Eye,
  Phone
} from "lucide-react";
import { Link } from "wouter";

interface ReviewData {
  id: number;
  userName: string;
  userInitials: string;
  eventDate: string;
  eventType: string;
  overallRating: number;
  ratings: {
    efficiency: number;
    professionalism: number;
    conditionOfGoods: number;
    competencyOfPeople: number;
    cleanliness: number;
    attentionToDetail: number;
    easeOfReaching: number;
  };
  experienceSummary: string;
  generalComments?: string;
  datePosted: string;
  verified: boolean;
  helpfulCount: number;
}

interface RatingReviewsProps {
  vendorId: number;
  vendorName: string;
}

export function RatingReviews({ vendorId, vendorName }: RatingReviewsProps) {
  // Mock data - in real app this would come from API
  const reviews: ReviewData[] = [
    {
      id: 1,
      userName: "Sarah M.",
      userInitials: "SM",
      eventDate: "June 15, 2024",
      eventType: "Wedding",
      overallRating: 4.7,
      ratings: {
        efficiency: 5,
        professionalism: 5,
        conditionOfGoods: 4,
        competencyOfPeople: 5,
        cleanliness: 5,
        attentionToDetail: 4,
        easeOfReaching: 5
      },
      experienceSummary: "Absolutely fantastic service! The team was professional, efficient, and went above and beyond for our wedding. All our guests commented on how beautiful everything looked and how smooth the event ran. The attention to detail was impressive and they were very responsive throughout the planning process.",
      generalComments: "Would definitely recommend to anyone looking for top-quality service. Worth every penny!",
      datePosted: "June 25, 2024",
      verified: true,
      helpfulCount: 12
    },
    {
      id: 2,
      userName: "Michael R.",
      userInitials: "MR",
      eventDate: "April 8, 2024",
      eventType: "Corporate Event",
      overallRating: 4.3,
      ratings: {
        efficiency: 4,
        professionalism: 5,
        conditionOfGoods: 4,
        competencyOfPeople: 4,
        cleanliness: 4,
        attentionToDetail: 4,
        easeOfReaching: 5
      },
      experienceSummary: "Great experience overall. The team was very professional and handled our corporate event beautifully. Setup was timely and everything looked exactly as we discussed. A couple of minor issues with some equipment but they resolved it quickly without affecting the event.",
      generalComments: "Good value for money and reliable service.",
      datePosted: "April 15, 2024",
      verified: true,
      helpfulCount: 8
    },
    {
      id: 3,
      userName: "Jessica L.",
      userInitials: "JL",
      eventDate: "March 22, 2024",
      eventType: "Birthday Party",
      overallRating: 5.0,
      ratings: {
        efficiency: 5,
        professionalism: 5,
        conditionOfGoods: 5,
        competencyOfPeople: 5,
        cleanliness: 5,
        attentionToDetail: 5,
        easeOfReaching: 5
      },
      experienceSummary: "Perfect in every way! From the initial consultation to the event day, everything was seamless. The team exceeded our expectations and created a magical birthday celebration for my daughter. The decorations were stunning and the service was impeccable. Highly recommended!",
      datePosted: "March 30, 2024",
      verified: true,
      helpfulCount: 15
    }
  ];

  const ratingCriteria = [
    { key: 'efficiency', label: 'Efficiency', icon: CheckCircle },
    { key: 'professionalism', label: 'Professionalism', icon: Award },
    { key: 'conditionOfGoods', label: 'Condition of Goods', icon: Package },
    { key: 'competencyOfPeople', label: 'Staff Competency', icon: Users },
    { key: 'cleanliness', label: 'Cleanliness', icon: Sparkles },
    { key: 'attentionToDetail', label: 'Attention to Detail', icon: Eye },
    { key: 'easeOfReaching', label: 'Communication', icon: Phone }
  ];

  // Calculate rating distribution
  const ratingDistribution = {
    5: reviews.filter(r => Math.round(r.overallRating) === 5).length,
    4: reviews.filter(r => Math.round(r.overallRating) === 4).length,
    3: reviews.filter(r => Math.round(r.overallRating) === 3).length,
    2: reviews.filter(r => Math.round(r.overallRating) === 2).length,
    1: reviews.filter(r => Math.round(r.overallRating) === 1).length,
  };

  // Calculate average ratings for each criteria
  const averageRatings = ratingCriteria.reduce((acc, criteria) => {
    const key = criteria.key as keyof ReviewData['ratings'];
    const average = reviews.reduce((sum, review) => sum + review.ratings[key], 0) / reviews.length;
    acc[key] = average;
    return acc;
  }, {} as Record<string, number>);

  const overallAverage = reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length;
  const totalReviews = reviews.length;

  return (
    <div className="space-y-6">
      {/* Overall Rating Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Overall Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold mb-2">{overallAverage.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= Math.round(overallAverage)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-muted-foreground">Based on {totalReviews} reviews</div>
            </div>
            
            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <Progress 
                    value={(ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100} 
                    className="flex-1 h-2"
                  />
                  <span className="text-sm text-muted-foreground w-8">
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Breakdown</CardTitle>
            <CardDescription>Average ratings by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ratingCriteria.map((criteria) => {
                const IconComponent = criteria.icon;
                const average = averageRatings[criteria.key];
                return (
                  <div key={criteria.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{criteria.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= Math.round(average)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium w-8">{average.toFixed(1)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Write Review Button */}
      <div className="flex justify-center">
        <Link href={`/vendors/${vendorId}/review`}>
          <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
            <Star className="mr-2 h-4 w-4" />
            Write a Review
          </Button>
        </Link>
      </div>

      <Separator />

      {/* Individual Reviews */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Customer Reviews</h3>
        
        {reviews.map((review) => (
          <Card key={review.id} className="border-l-4 border-l-primary/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                    {review.userInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {review.eventType} • {review.eventDate}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(review.overallRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-1 font-medium">{review.overallRating}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{review.datePosted}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {review.experienceSummary}
                </p>
                
                {review.generalComments && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground italic">
                      "{review.generalComments}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpfulCount})
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <Button variant="outline">
          Load More Reviews
        </Button>
      </div>
    </div>
  );
}