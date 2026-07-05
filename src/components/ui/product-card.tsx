"use client";

import { useState } from "react";
import { cn, getBrandName } from "@/utils";
import Image from "next/image";
import type { Brand } from "@/types";
import PlaceholderImage from "./placeholder-image";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discount_price: number | null;
    discount_percent: number;
    images: string[];
    rating: number;
    reviews_count: number;
    stock: number;
    is_flash_sale?: boolean;
    brand?: Brand | string | null;
  };
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
  isInWishlist?: boolean;
  compact?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  compact = false,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const currentPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price && product.discount_price < product.price;

  return (
    <div className={cn(
      "group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      compact ? "flex gap-3 p-3" : ""
    )}>
      <div className={cn("relative overflow-hidden", compact ? "w-24 h-24 flex-shrink-0" : "aspect-square")}>
        {imgError || !product.images[0] ? (
          <PlaceholderImage name={product.name} className="w-full h-full" />
        ) : (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
          />
        )}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{product.discount_percent}%
          </div>
        )}
        {product.is_flash_sale && (
          <div className="absolute top-2 right-2 bg-danger text-white text-xs font-bold px-2 py-1 rounded-lg">
            Flash
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleWishlist?.(product.id);
          }}
          className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          <svg
            className={cn("w-4 h-4", isInWishlist ? "fill-danger text-danger" : "text-gray-400")}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className={cn("p-3", compact && "flex-1 flex flex-col justify-between p-0")}>
        {product.brand && (
          <p className="text-xs text-secondary font-medium mb-1">{getBrandName(product.brand)}</p>
        )}
        <h3 className="font-medium text-gray-800 text-sm line-clamp-2 group-hover:text-secondary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className={cn("w-3 h-3", star <= product.rating ? "fill-warning text-warning" : "text-gray-200 fill-gray-200")} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-muted">({product.reviews_count})</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-secondary">
            Rs. {currentPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted line-through">
              Rs. {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {!compact && (
          <button
            onClick={() => product.stock > 0 && onAddToCart?.(product.id)}
            disabled={product.stock <= 0}
            className="w-full mt-3 py-2 bg-secondary/10 text-secondary font-semibold rounded-xl text-sm hover:bg-secondary hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}
