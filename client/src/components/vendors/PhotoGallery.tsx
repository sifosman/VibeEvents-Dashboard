import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageViewer } from "../ui/image-viewer";

interface PhotoGalleryProps {
  mainImage: string;
  additionalPhotos?: string[];
  vendorName: string;
  className?: string;
}

export function PhotoGallery({ mainImage, additionalPhotos = [], vendorName, className }: PhotoGalleryProps) {
  // Combine main image with additional photos
  const allPhotos = [mainImage, ...additionalPhotos].filter(Boolean);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % allPhotos.length);
  };
  
  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };
  
  const openZoom = () => {
    setIsZoomed(true);
  };
  
  const closeZoom = () => {
    setIsZoomed(false);
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && allPhotos.length > 1) {
      nextPhoto();
    }
    if (isRightSwipe && allPhotos.length > 1) {
      prevPhoto();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed) {
        if (e.key === 'Escape') {
          closeZoom();
        } else if (e.key === 'ArrowLeft' && allPhotos.length > 1) {
          prevPhoto();
        } else if (e.key === 'ArrowRight' && allPhotos.length > 1) {
          nextPhoto();
        }
      }
    };

    if (isZoomed) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isZoomed, allPhotos.length]);

  if (allPhotos.length === 0) {
    return (
      <div className={`relative h-64 md:h-96 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`relative h-64 md:h-96 rounded-lg overflow-hidden ${className}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div onClick={openZoom} className="w-full h-full cursor-pointer">
          <ImageViewer 
            imageUrl={allPhotos[currentIndex]} 
            alt={`${vendorName} - Photo ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Navigation arrows - only show if multiple photos */}
        {allPhotos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900"
              onClick={prevPhoto}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900"
              onClick={nextPhoto}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
        
        {/* Photo counter and zoom button */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          {allPhotos.length > 1 && (
            <div className="bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
              {currentIndex + 1} / {allPhotos.length}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
            onClick={openZoom}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Thumbnail strip - only show if multiple photos */}
        {allPhotos.length > 1 && (
          <div className="absolute bottom-4 right-4 flex space-x-1" ref={scrollRef}>
            {allPhotos.slice(0, 5).map((photo, index) => (
              <div
                key={index}
                className={`w-12 h-8 rounded cursor-pointer border-2 overflow-hidden ${
                  index === currentIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <ImageViewer
                  imageUrl={photo}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {allPhotos.length > 5 && (
              <div className="w-12 h-8 bg-black bg-opacity-50 rounded flex items-center justify-center">
                <span className="text-white text-xs">+{allPhotos.length - 5}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full-screen zoom modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 z-10"
              onClick={closeZoom}
            >
              <X className="h-6 w-6" />
            </Button>
            
            {/* Navigation in zoom mode */}
            {allPhotos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 z-10"
                  onClick={prevPhoto}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 z-10"
                  onClick={nextPhoto}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
            
            {/* Photo counter in zoom */}
            {allPhotos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded z-10">
                {currentIndex + 1} / {allPhotos.length}
              </div>
            )}
            
            {/* Main zoomed image */}
            <div onClick={closeZoom} className="max-w-full max-h-full cursor-pointer flex items-center justify-center">
              <ImageViewer
                imageUrl={allPhotos[currentIndex]}
                alt={`${vendorName} - Photo ${currentIndex + 1} (Full View)`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}