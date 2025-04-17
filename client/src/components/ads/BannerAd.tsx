import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';

interface BannerAdProps {
  position: string;
  className?: string;
  onImpression?: () => void;
  onAdClick?: () => void;
}

interface AdData {
  id: number;
  campaignId: number;
  assetUrl: string;
  title: string;
  description?: string;
  vendorName: string;
  vendorId: number;
  callToAction: string;
  targetUrl: string;
}

export default function BannerAd({ 
  position, 
  className = "", 
  onImpression, 
  onAdClick 
}: BannerAdProps) {
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  // Fetch an ad for the specified position
  const { data: ad, isLoading } = useQuery<AdData>({
    queryKey: [`/api/ads/${position}`],
  });

  // Track impression once the ad loads
  useEffect(() => {
    if (ad && !hasTrackedImpression) {
      // Record impression in the backend
      apiRequest("POST", `/api/ads/${ad.id}/impression`, {})
        .then(() => {
          setHasTrackedImpression(true);
          if (onImpression) onImpression();
        })
        .catch(error => console.error("Failed to track impression:", error));
    }
  }, [ad, hasTrackedImpression, onImpression]);

  // Handle click on the ad
  const handleAdClick = () => {
    if (!ad) return;
    
    // Record click in the backend
    apiRequest("POST", `/api/ads/${ad.id}/click`, {})
      .catch(error => console.error("Failed to track click:", error));
    
    // Call the onAdClick callback if provided
    if (onAdClick) onAdClick();
    
    // Open the target URL in a new tab
    window.open(ad.targetUrl, '_blank');
  };

  if (isLoading) {
    // Show a subtle loading placeholder
    return (
      <Card className={`overflow-hidden h-[120px] relative bg-accent/20 animate-pulse ${className}`}>
        <CardContent className="p-0 h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Loading Ad...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!ad) {
    // Don't show anything if no ad is available for this position
    return null;
  }

  return (
    <Card className={`overflow-hidden relative shadow-md hover:shadow-lg transition-shadow ${className}`}>
      <CardContent className="p-0 cursor-pointer" onClick={handleAdClick}>
        <div className="relative">
          {/* Background Image */}
          <img 
            src={ad.assetUrl} 
            alt={ad.title} 
            className="w-full h-[120px] object-cover"
          />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="p-4 text-white">
              <h3 className="font-bold text-lg mb-1">{ad.title}</h3>
              {ad.description && (
                <p className="text-sm mb-2 line-clamp-1">{ad.description}</p>
              )}
              <Button 
                size="sm" 
                className="bg-primary text-white hover:bg-primary/90 mt-1 flex items-center gap-1"
              >
                {ad.callToAction} <ExternalLink size={14} />
              </Button>
            </div>
          </div>
          
          {/* Promoted Tag */}
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            Promoted
          </div>
        </div>
      </CardContent>
    </Card>
  );
}