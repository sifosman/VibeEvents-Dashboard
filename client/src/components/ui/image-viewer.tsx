import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface ImageViewerProps {
  imageUrl: string;
  alt: string;
  className?: string;
  fullClassName?: string;
  fallbackUrl?: string;
}

export function ImageViewer({
  imageUrl,
  alt,
  className,
  fullClassName = "max-w-full max-h-[80vh] object-contain",
  fallbackUrl = "https://placehold.co/600x400?text=Image+Not+Available"
}: ImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle image load error
  const handleError = () => {
    setHasError(true);
  };

  return (
    <>
      <img
        src={hasError ? fallbackUrl : imageUrl}
        alt={alt}
        className={cn("cursor-zoom-in", className)}
        onClick={() => setIsOpen(true)}
        onError={handleError}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-[80vw] md:max-w-[1200px] p-0 bg-black/90 border-none">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center justify-center w-full h-full p-4">
            <img
              src={hasError ? fallbackUrl : imageUrl}
              alt={alt}
              className={cn(fullClassName)}
              onError={handleError}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}