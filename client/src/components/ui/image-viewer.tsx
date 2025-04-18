import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader, 
  DialogFooter,
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn } from "lucide-react";

interface ImageViewerProps {
  src: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ImageViewer({ src, alt = "Image", className, children }: ImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className={`relative group cursor-pointer ${className}`}
        onClick={() => setIsOpen(true)}
      >
        {children || (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity flex items-center justify-center">
          <ZoomIn className="text-white opacity-0 group-hover:opacity-100 h-8 w-8" />
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-[90vw] p-1 md:p-2">
          <DialogHeader className="p-2">
            <DialogTitle className="text-lg">{alt}</DialogTitle>
            <DialogClose className="absolute right-2 top-2">
              <X className="h-5 w-5" />
            </DialogClose>
          </DialogHeader>
          
          <div className="overflow-auto max-h-[70vh] flex items-center justify-center">
            <img 
              src={src} 
              alt={alt} 
              className="max-w-full max-h-[70vh] object-contain" 
            />
          </div>
          
          <DialogFooter className="p-2">
            <DialogClose asChild>
              <Button variant="secondary" size="sm">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}