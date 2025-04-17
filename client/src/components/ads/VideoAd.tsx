import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { Play, Pause, ExternalLink, Volume2, VolumeX } from 'lucide-react';

interface VideoAdProps {
  position: string;
  className?: string;
  autoplay?: boolean;
  muted?: boolean;
  onImpression?: () => void;
  onAdClick?: () => void;
  onVideoComplete?: () => void;
}

interface VideoAdData {
  id: number;
  campaignId: number;
  assetUrl: string;
  title: string;
  description?: string;
  vendorName: string;
  vendorId: number;
  callToAction: string;
  targetUrl: string;
  duration: number;
}

export default function VideoAd({ 
  position, 
  className = "",
  autoplay = false,
  muted = true, 
  onImpression, 
  onAdClick,
  onVideoComplete
}: VideoAdProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasTrackedQuartiles, setHasTrackedQuartiles] = useState({
    start: false,
    firstQuartile: false,
    midpoint: false,
    thirdQuartile: false,
    complete: false
  });

  // Fetch a video ad for the specified position
  const { data: ad, isLoading } = useQuery<VideoAdData>({
    queryKey: [`/api/ads/video/${position}`],
  });

  // Initialize video playback
  useEffect(() => {
    if (ad && videoRef.current) {
      const video = videoRef.current;
      video.load();
      
      if (autoplay) {
        video.play().catch(err => {
          console.error("Autoplay prevented:", err);
          setIsPlaying(false);
        });
      }
      
      video.muted = muted;
    }
  }, [ad, autoplay, muted]);

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

  // Handle video progress tracking
  const handleTimeUpdate = () => {
    if (!videoRef.current || !ad) return;
    
    const video = videoRef.current;
    const currentProgress = (video.currentTime / video.duration) * 100;
    setProgress(currentProgress);
    
    // Track video quartiles for analytics
    const quartiles = hasTrackedQuartiles;
    
    if (!quartiles.start && currentProgress >= 0) {
      quartiles.start = true;
      apiRequest("POST", `/api/ads/${ad.id}/video-progress`, { progress: "start" })
        .catch(error => console.error("Failed to track video start:", error));
    }
    
    if (!quartiles.firstQuartile && currentProgress >= 25) {
      quartiles.firstQuartile = true;
      apiRequest("POST", `/api/ads/${ad.id}/video-progress`, { progress: "firstQuartile" })
        .catch(error => console.error("Failed to track first quartile:", error));
    }
    
    if (!quartiles.midpoint && currentProgress >= 50) {
      quartiles.midpoint = true;
      apiRequest("POST", `/api/ads/${ad.id}/video-progress`, { progress: "midpoint" })
        .catch(error => console.error("Failed to track midpoint:", error));
    }
    
    if (!quartiles.thirdQuartile && currentProgress >= 75) {
      quartiles.thirdQuartile = true;
      apiRequest("POST", `/api/ads/${ad.id}/video-progress`, { progress: "thirdQuartile" })
        .catch(error => console.error("Failed to track third quartile:", error));
    }
    
    setHasTrackedQuartiles(quartiles);
  };

  // Handle video end
  const handleVideoEnd = () => {
    if (!ad || hasTrackedQuartiles.complete) return;
    
    setIsPlaying(false);
    
    // Track completion
    apiRequest("POST", `/api/ads/${ad.id}/video-progress`, { progress: "complete" })
      .catch(error => console.error("Failed to track video completion:", error));
    
    setHasTrackedQuartiles({
      ...hasTrackedQuartiles,
      complete: true
    });
    
    if (onVideoComplete) onVideoComplete();
  };

  // Toggle play/pause
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  // Toggle mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

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
      <Card className={`overflow-hidden h-[225px] relative bg-accent/20 animate-pulse ${className}`}>
        <CardContent className="p-0 h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Loading Video Ad...</span>
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
    <Card className={`overflow-hidden relative shadow-md ${className}`}>
      <CardContent className="p-0 cursor-pointer" onClick={handleAdClick}>
        <div className="relative">
          {/* Video */}
          <video
            ref={videoRef}
            className="w-full h-auto"
            poster={`${ad.assetUrl.replace('.mp4', '')}-poster.jpg`}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
          >
            <source src={ad.assetUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Controls Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 to-transparent hover:from-black/70 transition-colors">
            {/* Top Bar */}
            <div className="p-3 flex justify-between items-center">
              <div className="text-white text-sm font-medium">
                {ad.vendorName}
              </div>
              <div className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                Ad • {Math.ceil(ad.duration)}s
              </div>
            </div>
            
            {/* Center Play/Pause Button */}
            <div className="flex-grow flex items-center justify-center" onClick={togglePlay}>
              {!isPlaying && (
                <div className="bg-primary/80 rounded-full p-3 hover:bg-primary transition-colors">
                  <Play className="h-8 w-8 text-white" fill="white" />
                </div>
              )}
            </div>
            
            {/* Bottom Controls */}
            <div className="p-3 pt-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={togglePlay}
                    className="text-white hover:text-primary transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </button>
                  
                  <button 
                    onClick={toggleMute}
                    className="text-white hover:text-primary transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <Button 
                  size="sm" 
                  className="bg-primary text-white hover:bg-primary/90 flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdClick();
                  }}
                >
                  {ad.callToAction} <ExternalLink size={14} />
                </Button>
              </div>
              
              <h3 className="text-white font-bold text-lg mt-2">{ad.title}</h3>
              {ad.description && (
                <p className="text-white/80 text-sm line-clamp-1 mt-1">{ad.description}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}