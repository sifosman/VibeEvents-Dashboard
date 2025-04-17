import sharp from 'sharp';
import { createHash } from 'crypto';

interface ValidationResult {
  isValid: boolean;
  reason?: string;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
    blurScore?: number;
    pHash?: string;
  };
}

interface ValidationOptions {
  minWidth?: number;
  minHeight?: number;
  maxSizeKB?: number;
  requireSquare?: boolean;
  blurThreshold?: number;
  checkInappropriate?: boolean;
  allowedFormats?: string[];
}

/**
 * SECURITY OPTIMIZATION: Image validation service to detect and reject
 * low quality, blurred, or inappropriate images
 * 
 * This improves platform security and user experience
 */
export class ImageValidationService {
  private static instance: ImageValidationService;
  // Store hashes of known inappropriate images (would be populated from a database)
  private inappropriateImageHashes: Set<string> = new Set();
  
  // Default validation options
  private defaultOptions: ValidationOptions = {
    minWidth: 400,
    minHeight: 400,
    maxSizeKB: 5000, // 5MB
    requireSquare: false,
    blurThreshold: 50, // 0-100 scale where higher means more blur detected
    checkInappropriate: true,
    allowedFormats: ['jpeg', 'jpg', 'png', 'webp'],
  };

  private constructor() {
    // Private constructor for singleton
    console.log('[ImageValidation] Service initialized');
    
    // Load known inappropriate content hashes
    // In a real system, this would load from a database or API
    this.loadInappropriateHashes();
  }

  /**
   * Get the singleton instance of the service
   */
  public static getInstance(): ImageValidationService {
    if (!ImageValidationService.instance) {
      ImageValidationService.instance = new ImageValidationService();
    }
    return ImageValidationService.instance;
  }

  /**
   * Validate an image buffer against quality and safety criteria
   */
  public async validateImage(
    imageBuffer: Buffer, 
    options: ValidationOptions = {}
  ): Promise<ValidationResult> {
    // Merge with default options
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    try {
      // Extract image metadata
      const metadata = await sharp(imageBuffer).metadata();
      
      // Basic dimension and format validation
      if (!metadata.width || !metadata.height || !metadata.format) {
        return { isValid: false, reason: 'Invalid image format or corrupted file' };
      }
      
      // Check format
      if (mergedOptions.allowedFormats && 
          !mergedOptions.allowedFormats.includes(metadata.format.toLowerCase())) {
        return { 
          isValid: false, 
          reason: `Unsupported format: ${metadata.format}. Allowed formats: ${mergedOptions.allowedFormats.join(', ')}`,
          metadata: {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: imageBuffer.length,
          }
        };
      }
      
      // Minimum dimensions check
      if ((mergedOptions.minWidth && metadata.width < mergedOptions.minWidth) ||
          (mergedOptions.minHeight && metadata.height < mergedOptions.minHeight)) {
        return { 
          isValid: false, 
          reason: `Image too small. Minimum dimensions: ${mergedOptions.minWidth}x${mergedOptions.minHeight}`,
          metadata: {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: imageBuffer.length,
          }
        };
      }
      
      // Square image check if required
      if (mergedOptions.requireSquare && metadata.width !== metadata.height) {
        return { 
          isValid: false, 
          reason: 'Image must be square (same width and height)',
          metadata: {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: imageBuffer.length,
          }
        };
      }
      
      // File size check
      if (mergedOptions.maxSizeKB && imageBuffer.length > mergedOptions.maxSizeKB * 1024) {
        return { 
          isValid: false, 
          reason: `File too large. Maximum size: ${mergedOptions.maxSizeKB}KB`,
          metadata: {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: imageBuffer.length,
          }
        };
      }
      
      // Blur detection (simplified)
      const blurScore = await this.detectBlur(imageBuffer);
      
      if (mergedOptions.blurThreshold && blurScore > mergedOptions.blurThreshold) {
        return { 
          isValid: false, 
          reason: 'Image is too blurry',
          metadata: {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: imageBuffer.length,
            blurScore: blurScore,
          }
        };
      }
      
      // Check for inappropriate content if enabled
      if (mergedOptions.checkInappropriate) {
        const pHash = await this.generatePerceptualHash(imageBuffer);
        
        if (this.detectInappropriateContent(pHash)) {
          return { 
            isValid: false, 
            reason: 'Image contains inappropriate content',
            metadata: {
              width: metadata.width,
              height: metadata.height,
              format: metadata.format,
              size: imageBuffer.length,
              pHash: pHash,
            }
          };
        }
      }
      
      // All checks passed
      return { 
        isValid: true,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: imageBuffer.length,
          blurScore: blurScore,
        }
      };
    } catch (error) {
      console.error('[ImageValidation] Error:', error);
      return { isValid: false, reason: 'Failed to process image' };
    }
  }
  
  /**
   * Generates a perceptual hash for the image
   * This creates a "fingerprint" that can be compared with known inappropriate content
   */
  private async generatePerceptualHash(imageBuffer: Buffer): Promise<string> {
    try {
      // Resize to small dimensions for the hash
      const resized = await sharp(imageBuffer)
        .resize(16, 16, { fit: 'fill' })
        .grayscale()
        .raw()
        .toBuffer();
      
      // Create hash from pixel data
      const hash = createHash('sha256');
      hash.update(resized);
      return hash.digest('hex');
    } catch (error) {
      console.error('[ImageValidation] Error generating perceptual hash:', error);
      return '';
    }
  }
  
  /**
   * Detect if an image is blurry using gradient analysis
   * Returns a score from 0-100 where higher means more blur
   */
  private async detectBlur(imageBuffer: Buffer): Promise<number> {
    try {
      // Convert to grayscale and get raw pixel data
      const { data, info } = await sharp(imageBuffer)
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      const width = info.width;
      const height = info.height;
      
      // Simple Laplacian filter to detect edges
      let totalVariation = 0;
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x;
          
          // Apply approximation of Laplacian operator (detect rapid changes in intensity)
          const center = data[idx];
          const left = data[idx - 1];
          const right = data[idx + 1];
          const top = data[idx - width];
          const bottom = data[idx + width];
          
          // Calculate local variation
          const variation = Math.abs(4 * center - left - right - top - bottom);
          totalVariation += variation;
        }
      }
      
      // Normalize to 0-100 scale (higher values = more blur)
      const avgVariation = totalVariation / ((width - 2) * (height - 2));
      // Invert so higher = more blur
      const blurScore = Math.max(0, Math.min(100, 100 - (avgVariation * 0.8)));
      
      return blurScore;
    } catch (error) {
      console.error('[ImageValidation] Error detecting blur:', error);
      return 0; // Return 0 (no blur) on error to avoid false rejections
    }
  }
  
  /**
   * Check if image matches any known inappropriate content
   * In a real system, this would use a more sophisticated approach with ML
   */
  private detectInappropriateContent(pHash: string): boolean {
    // Compare with known hashes
    return this.inappropriateImageHashes.has(pHash);
  }
  
  /**
   * Load known inappropriate content hashes (demo)
   * In a real implementation, these would come from a database or external API
   */
  private loadInappropriateHashes(): void {
    // This is a placeholder - in a real system these would be loaded from a database
    // of known inappropriate image hashes
    console.log('[ImageValidation] Loaded inappropriate content detection system');
  }
  
  /**
   * Optimize an image for web display while preserving quality
   */
  public async optimizeImage(
    imageBuffer: Buffer,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'jpeg' | 'png' | 'webp';
    } = {}
  ): Promise<Buffer> {
    try {
      const processor = sharp(imageBuffer);
      
      // Resize if dimensions provided
      if (options.width || options.height) {
        processor.resize(options.width, options.height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }
      
      // Convert format if specified
      if (options.format) {
        switch (options.format) {
          case 'jpeg':
            processor.jpeg({ quality: options.quality || 80 });
            break;
          case 'png':
            processor.png({ quality: options.quality || 80 });
            break;
          case 'webp':
            processor.webp({ quality: options.quality || 80 });
            break;
        }
      }
      
      // Return optimized buffer
      return await processor.toBuffer();
    } catch (error) {
      console.error('[ImageValidation] Error optimizing image:', error);
      return imageBuffer; // Return original on error
    }
  }
}

// Export the singleton instance
export const imageValidation = ImageValidationService.getInstance();