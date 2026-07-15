"use client";

import { useState } from "react";

interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
}

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-gradient-to-br from-nude via-blush to-rose/20 flex items-center justify-center">
        <span className="heading-serif text-[100px] text-foreground/5">
          {productName.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="aspect-[3/4] bg-nude mb-4 relative overflow-hidden">
        <img
          src={images[selectedIndex].image_url}
          alt={images[selectedIndex].alt_text || productName}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={`aspect-square overflow-hidden rounded cursor-pointer transition-all duration-200 ${
                selectedIndex === idx
                  ? "ring-2 ring-rose ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.image_url}
                alt={img.alt_text || `${productName} ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
