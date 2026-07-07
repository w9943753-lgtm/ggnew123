"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Check,
  Package,
  Clock,
  Share2,
  ZoomIn,
  Heart,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { cn, getBrandName, getCategoryName, formatPrice, calculateDiscount } from "@/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import PlaceholderImage from "@/components/ui/placeholder-image";
import type { Product } from "@/types";

function ProductImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return <PlaceholderImage name={alt} className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImgError(true)}
    />
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : undefined;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("No product slug provided.");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (dbError) {
        setLoading(false);
        setError(`Database error: ${dbError.message}`);
        return;
      }

      if (!data) {
        setLoading(false);
        setError("not_found");
        return;
      }

      setProduct(data as unknown as Product);

      const { data: related } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", data.category_id)
        .neq("id", data.id)
        .limit(4);

      setRelatedProducts((related as unknown as Product[]) || []);
      setLoading(false);
    };

    fetchProduct();
  }, [slug, params, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading product...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">
            {error && error !== "not_found" ? error : "The product you're looking for doesn't exist."}
          </p>
          <Link href="/" className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[activeImage] || undefined;

  const discountPercent = product.discount_price
    ? calculateDiscount(product.price, product.discount_price)
    : 0;
  const categoryName = getCategoryName(product.category);
  const brandName = getBrandName(product.brand);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto scrollbar-hide">
          <Link href="/" className="hover:text-green-600 transition-colors whitespace-nowrap">Home</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href="/categories" className="hover:text-green-600 transition-colors whitespace-nowrap">Shop</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link
            href={`/category/${categoryName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            className="hover:text-green-600 transition-colors whitespace-nowrap"
          >
            {categoryName}
          </Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main Product */}
      <div className="max-w-7xl mx-auto lg:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:shadow-sm overflow-hidden lg:sticky lg:top-24">
              <div
                className="relative aspect-square bg-gray-50 cursor-zoom-in overflow-hidden group touch-pan-y"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full"
                  >
                    <ProductImage
                      src={currentImage}
                      alt={product.name}
                      className={cn(
                        "w-full h-full object-cover transition-transform duration-500",
                        isZoomed ? "scale-[2.5] cursor-zoom-out" : "scale-100 cursor-zoom-in"
                      )}
                    />
                  </motion.div>
                </AnimatePresence>
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
                    -{discountPercent}%
                  </span>
                )}
                {/* Desktop nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage((prev) => (prev - 1 + images.length) % images.length);
                        setIsZoomed(false);
                      }}
                      className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage((prev) => (prev + 1) % images.length);
                        setIsZoomed(false);
                      }}
                      className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                {/* Mobile swipe indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden z-10">
                    {images.map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ width: activeImage === i ? 16 : 8 }}
                        className="h-2 rounded-full bg-white/60"
                        style={{ backgroundColor: activeImage === i ? "#16a34a" : "rgba(255,255,255,0.6)" }}
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveImage(i); setIsZoomed(false); }}
                      className={cn(
                        "w-14 h-14 lg:w-16 lg:h-16 rounded-xl border-2 overflow-hidden transition-all flex-shrink-0 snap-center",
                        activeImage === i ? "border-green-500 shadow-md scale-105" : "border-gray-100 hover:border-gray-300 opacity-70"
                      )}
                    >
                      <ProductImage src={img} alt={product.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 lg:space-y-6 px-4 lg:px-0"
          >
            {/* Brand & Category */}
            <div className="flex items-center gap-2 flex-wrap">
              {brandName && (
                <span className="text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full">
                  {brandName}
                </span>
              )}
              {categoryName && (
                <span className="text-xs text-gray-500">
                  in {categoryName}
                </span>
              )}
            </div>

            {/* Title */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-lg lg:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: product.name, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied!");
                  }
                }}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Rating */}
            {(product.rating || 0) > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(product.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews_count || 0})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-orange-50 rounded-2xl p-4 border border-green-100/50">
              <div className="flex items-end gap-3 flex-wrap">
                {product.discount_price ? (
                  <>
                    <span className="text-2xl lg:text-4xl font-extrabold text-green-600">
                      {formatPrice(product.discount_price)}
                    </span>
                    <span className="text-base lg:text-lg text-gray-400 line-through mb-0.5">
                      {formatPrice(product.price)}
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full mb-0.5">
                      Save {formatPrice(product.price - product.discount_price)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl lg:text-4xl font-extrabold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {(product.stock || 0) > 0 ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Estimated Delivery */}
            <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3 border border-green-100">
              <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                <p className="text-xs text-gray-500">2-3 business days • Free delivery over Rs. 2,000</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Product Details */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-3 lg:p-4 space-y-2 border border-gray-100">
              {brandName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Brand</span>
                  <span className="font-medium text-gray-900">{brandName}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Weight</span>
                  <span className="font-medium text-gray-900">{product.weight}</span>
                </div>
              )}
              {product.barcode && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Barcode</span>
                  <span className="font-medium text-gray-900">{product.barcode}</span>
                </div>
              )}
            </div>

            {/* Quantity & Order - Desktop */}
            <div className="hidden lg:block space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center font-semibold text-gray-900 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Total: <span className="font-bold text-green-600">{formatPrice((product.discount_price || product.price) * quantity)}</span>
                </span>
              </div>
              <a
                href={`https://wa.me/923044124129?text=${encodeURIComponent(`Hi, I want to order:\n${product.name}\nQty: ${quantity}\nPrice: ${formatPrice(product.discount_price || product.price)} x ${quantity} = ${formatPrice((product.discount_price || product.price) * quantity)}\n\nPlease confirm availability. Thank you!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] transition-all shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 active:scale-[0.98]"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Order on WhatsApp
              </a>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-br from-green-50 to-white rounded-xl p-2.5 lg:p-3 border border-green-100">
                <Truck className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Free Delivery</p>
                  <p className="text-[10px] lg:text-xs text-gray-500">Over Rs. 2,000</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-white rounded-xl p-2.5 lg:p-3 border border-blue-100">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Genuine</p>
                  <p className="text-[10px] lg:text-xs text-gray-500">100% Authentic</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-br from-orange-50 to-white rounded-xl p-2.5 lg:p-3 border border-orange-100">
                <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Easy Returns</p>
                  <p className="text-[10px] lg:text-xs text-gray-500">7-Day Policy</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-br from-purple-50 to-white rounded-xl p-2.5 lg:p-3 border border-purple-100">
                <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Fast Delivery</p>
                  <p className="text-[10px] lg:text-xs text-gray-500">2-3 Days</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-8 lg:mt-12 px-4 lg:px-0">
          <div className="border-b border-gray-200">
            <div className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-hide">
              {(["description", "specs", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-[2px] whitespace-nowrap flex-shrink-0",
                    activeTab === tab
                      ? "text-green-600 border-green-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  )}
                >
                  {tab === "reviews" ? `Reviews (${product.reviews_count || 0})` : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="py-4 lg:py-6">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div
                  key="desc"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="prose max-w-none"
                >
                  <div className={cn("relative overflow-hidden transition-all duration-300", !isDescriptionExpanded && "max-h-20 lg:max-h-none")}>
                    <p className="text-sm lg:text-base text-gray-600 leading-relaxed">{product.description}</p>
                    {!isDescriptionExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50 to-transparent lg:hidden" />
                    )}
                  </div>
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-green-600 text-sm font-semibold mt-2 lg:hidden"
                  >
                    {isDescriptionExpanded ? "Show less" : "Read more"}
                  </button>
                  <div className="mt-4 lg:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                    {(product as any).features && (product as any).features.length > 0 && (
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-3 lg:p-4 border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Key Features</h4>
                        <ul className="space-y-1 text-xs lg:text-sm text-gray-600">
                          {(product as any).features.map((f: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {((product as any).usage || (product as any).usage_instructions) && ((product as any).usage?.length > 0 || (product as any).usage_instructions?.length > 0) && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-3 lg:p-4 border border-blue-100">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Usage Instructions</h4>
                        <ul className="space-y-1 text-xs lg:text-sm text-gray-600">
                          {((product as any).usage || (product as any).usage_instructions || []).map((u: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                              {u}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "specs" && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-100">
                      {[
                        brandName && ["Brand", brandName],
                        categoryName && ["Category", categoryName],
                        product.weight && ["Weight", product.weight],
                        product.sku && ["SKU", product.sku],
                        product.barcode && ["Barcode", product.barcode],
                        product.unit && ["Unit", product.unit],
                        ["Stock", `${product.stock || 0} units`],
                      ]
                        .filter(Boolean)
                        .map(([label, value]) => (
                          <tr key={String(label)}>
                            <td className="py-2.5 lg:py-3 text-xs lg:text-sm text-gray-500 w-32 lg:w-40">{String(label)}</td>
                            <td className="py-2.5 lg:py-3 text-xs lg:text-sm font-medium text-gray-900">{String(value)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-6 bg-gray-50 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-3xl lg:text-4xl font-bold text-gray-900">{product.rating || 0}</div>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-4 h-4",
                              i < Math.floor(product.rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{product.reviews_count || 0} reviews</p>
                    </div>
                  </div>

                  {(!product.reviews_count || product.reviews_count === 0) ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl">
                      <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium text-sm">No reviews yet</p>
                      <p className="text-xs text-gray-400 mt-1">Be the first to review this product</p>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 lg:mt-12 px-4 lg:px-0">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4">
              {relatedProducts.map((rp, i) => (
                <motion.div
                  key={rp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/product/${rp.slug}`}
                    className="block bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                  >
                    <div className="aspect-square bg-gray-50 p-2 lg:p-3">
                      <ProductImage
                        src={rp.images?.[0]}
                        alt={rp.name}
                        className="w-full h-full rounded-lg lg:rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2.5 lg:p-4">
                      <p className="text-[10px] lg:text-xs text-green-600 font-medium mb-0.5">{getBrandName(rp.brand)}</p>
                      <h3 className="font-medium lg:font-semibold text-gray-900 text-xs lg:text-sm line-clamp-2 mb-1 lg:mb-2">
                        {rp.name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm lg:text-lg font-bold text-green-600">
                          {formatPrice(rp.discount_price || rp.price)}
                        </span>
                        {rp.discount_price && (
                          <span className="text-xs lg:text-sm text-gray-400 line-through">
                            {formatPrice(rp.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky WhatsApp Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">Qty:</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center active:bg-gray-50 transition-colors"
              >
                <Minus className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                className="w-8 h-8 flex items-center justify-center active:bg-gray-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
            <span className="text-sm font-bold text-green-600 ml-auto">
              {formatPrice((product.discount_price || product.price) * quantity)}
            </span>
          </div>
          <a
            href={`https://wa.me/923044124129?text=${encodeURIComponent(`Hi, I want to order:\n${product.name}\nQty: ${quantity}\nPrice: ${formatPrice(product.discount_price || product.price)} x ${quantity} = ${formatPrice((product.discount_price || product.price) * quantity)}\n\nPlease confirm availability. Thank you!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-[#25D366] to-[#128C7E] active:scale-[0.98] transition-transform"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
