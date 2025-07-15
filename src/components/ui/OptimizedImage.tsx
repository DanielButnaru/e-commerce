import { useEffect, useRef, useState } from "react";

// Add type extension for Window
declare global {
  interface Window {
    __lcpDone?: boolean;
  }
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  className?: string;
  priority?: boolean;
}

const OptimizedImage = ({
  src,
  alt,
  width = 800,
  height = 600,
  quality = 80,
  className = "",
  priority = false,
}: OptimizedImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const isFirebaseStorage = src.includes("firebasestorage.googleapis.com");

  // Preload for critical images (LCP)
  useEffect(() => {
    if (priority && imgRef.current) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = getOptimizedUrl();
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src, width, height, quality]);

  const getOptimizedUrl = () => {
    if (isFirebaseStorage) {
      const params = new URLSearchParams({
        alt: "media",
        width: width.toString(),
        height: height.toString(),
        quality: quality.toString(),
      });
      return `${src}${src.includes("?") ? "&" : "?"}${params.toString()}`;
    }

    // Check if it's an external URL (non-Firebase)
    try {
      new URL(src);
      return `https://images.weserv.nl/?url=${encodeURIComponent(src)}&w=${width}&h=${height}&q=${quality}&output=webp`;
    } catch {
      return src; // If not a valid URL, return original
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
    if (priority) {
      window.__lcpDone = true;
      // Performance tracking
      if (window.performance?.mark) {
        window.performance.mark("lcp_image_loaded");
        // Optional: Add measure
        window.performance.measure("lcp_image", undefined, "lcp_image_loaded");
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Placeholder for aspect ratio */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            aspectRatio: `${width}/${height}`,
          }}
        />
      )}
      
      <img
        ref={imgRef}
        src={getOptimizedUrl()}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        className={`w-full  transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        onLoad={handleLoad}
        onError={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default OptimizedImage;