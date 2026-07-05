"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";
import { cn, getBrandName, getCategoryName, formatPrice, calculateDiscount } from "@/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import PlaceholderImage from "@/components/ui/placeholder-image";
import type { Product } from "@/types";

const sampleReviews = [
  {
    id: "1",
    user: "Ahmed K.",
    rating: 5,
    date: "2026-06-28",
    comment: "Excellent product! Works exactly as described. Will buy again.",
    avatar: "AK",
  },
  {
    id: "2",
    user: "Fatima S.",
    rating: 4,
    date: "2026-06-25",
    comment: "Good quality. Delivery was fast. Packaging could be better.",
    avatar: "FS",
  },
  {
    id: "3",
    user: "Usman R.",
    rating: 5,
    date: "2026-06-20",
    comment: "Best value for money. Highly recommended for families.",
    avatar: "UR",
  },
  {
    id: "4",
    user: "Ayesha M.",
    rating: 4,
    date: "2026-06-18",
    comment: "Satisfied with the quality. Will order again soon.",
    avatar: "AM",
  },
];

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
    // eslint-disable-next-line @next/next/no-img-element
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
      console.error("[ProductDetail] No slug provided in URL params:", params);
      setLoading(false);
      setError("No product slug provided.");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      console.log("[ProductDetail] Fetching product with slug:", slug);

      const { data, error: dbError } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (dbError) {
        console.error("[ProductDetail] Supabase query error:", dbError.message, dbError);
        setLoading(false);
        setError(`Database error: ${dbError.message}`);
        return;
      }

      if (!data) {
        console.error("[ProductDetail] No product found for slug:", slug);
        setLoading(false);
        setError("not_found");
        return;
      }

      console.log("[ProductDetail] Product found:", data.id, data.name);
      setProduct(data as unknown as Product);

      const { data: related, error: relatedError } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", data.category_id)
        .neq("id", data.id)
        .limit(4);

      if (relatedError) {
        console.error("[ProductDetail] Related products error:", relatedError.message);
      }

      setRelatedProducts((related as unknown as Product[]) || []);
      setLoading(false);
    };

    fetchProduct();
  }, [slug, params, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">
            {error && error !== "not_found" ? error : "The product you're looking for doesn't exist."}
          </p>
          <Link href="/" className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
            Back to Home
          </Link>
        </div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/categories" className="hover:text-green-600 transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/category/${categoryName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            className="hover:text-green-600 transition-colors"
          >
            {categoryName}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main Product */}
      <div className="max-w-7xl mx-auto lg:px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:shadow-sm overflow-hidden lg:sticky lg:top-24">
              <div
                className="relative aspect-[4/3] lg:aspect-square bg-gray-50 cursor-zoom-in overflow-hidden group"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
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
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10">
                    -{discountPercent}% OFF
                  </span>
                )}
                {/* Zoom indicator */}
                <div className="absolute top-4 right-14 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <ZoomIn className="w-4 h-4 text-gray-600" />
                </div>
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage((prev) => (prev - 1 + images.length) % images.length);
                        setIsZoomed(false);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage((prev) => (prev + 1) % images.length);
                        setIsZoomed(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                {/* Mobile swipe indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden z-10">
                    {images.map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          activeImage === i ? "bg-green-600 w-4" : "bg-white/60"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 p-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveImage(i); setIsZoomed(false); }}
                      className={cn(
                        "w-16 h-16 rounded-xl border-2 overflow-hidden transition-all flex-shrink-0 snap-center hover:scale-105",
                        activeImage === i ? "border-green-500 shadow-md" : "border-gray-100 hover:border-gray-300"
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Brand & Category */}
            <div className="flex items-center gap-2">
              {brandName && (
                <span className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                  {brandName}
                </span>
              )}
              {categoryName && (
                <span className="text-sm text-gray-500">
                  in {categoryName}
                </span>
              )}
            </div>

            {/* Title */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      i < Math.floor(product.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating || 0} ({product.reviews_count || 0} reviews)
              </span>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-500">
                SKU: {product.sku}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              {product.discount_price ? (
                <>
                  <span className="text-3xl md:text-4xl font-extrabold text-green-600">
                    {formatPrice(product.discount_price)}
                  </span>
                  <span className="text-lg text-gray-400 line-through mb-1">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full mb-1">
                    Save {formatPrice(product.price - product.discount_price)}
                  </span>
                </>
              ) : (
                <span className="text-3xl md:text-4xl font-extrabold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {(product.stock || 0) > 0 ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
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
            <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
              <Truck className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                <p className="text-xs text-gray-500">2-3 business days • Free delivery on orders over Rs. 2,000</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Product Details */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
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

            {/* Quantity & Order */}
            <div className="space-y-4">
              <a
                href={`https://wa.me/923044124129?text=${encodeURIComponent(`Hi, I want to order: ${product.name} (Qty: ${quantity})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-white text-lg bg-[#25D366] hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-500/25"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Order on WhatsApp
              </a>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                <Truck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Free Delivery</p>
                  <p className="text-xs text-gray-500">Orders over Rs. 2,000</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Genuine Product</p>
                  <p className="text-xs text-gray-500">100% Authentic</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                <RotateCcw className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-500">7-Day Policy</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-500">2-3 Business Days</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              {(["description", "specs", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-[2px]",
                    activeTab === tab
                      ? "text-green-600 border-green-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  )}
                >
                  {tab === "reviews" ? `${tab} (${sampleReviews.length})` : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose max-w-none"
              >
                <div className={cn("relative overflow-hidden transition-all duration-300", !isDescriptionExpanded && "max-h-24 lg:max-h-none")}>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  {!isDescriptionExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent lg:hidden" />
                  )}
                </div>
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-green-600 text-sm font-semibold mt-2 lg:hidden"
                >
                  {isDescriptionExpanded ? "Show less" : "Read more"}
                </button>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Premium quality ingredients</li>
                      <li>• Safe for all fabric types</li>
                      <li>• Long-lasting fragrance</li>
                      <li>• Removes tough stains effectively</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Usage Instructions</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Add to washing machine or bucket</li>
                      <li>• Use recommended amount</li>
                      <li>• Soak for 30 minutes for best results</li>
                      <li>• Rinse thoroughly</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "specs" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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
                          <td className="py-3 text-sm text-gray-500 w-40">{String(label)}</td>
                          <td className="py-3 text-sm font-medium text-gray-900">{String(value)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Rating Summary */}
                <div className="flex items-center gap-6 bg-gray-50 rounded-xl p-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{product.rating || 0}</div>
                    <div className="flex items-center gap-1 mt-1">
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
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-3">{star}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{
                              width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : star === 2 ? 3 : 2}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                {sampleReviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="border border-gray-100 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-semibold text-sm">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.user}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <Star
                                key={j}
                                className={cn(
                                  "w-3 h-3",
                                  j < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-200 text-gray-200"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                  >
                    <div className="aspect-square bg-gray-50 p-3">
                      <ProductImage
                        src={rp.images?.[0]}
                        alt={rp.name}
                        className="w-full h-full rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-green-600 font-medium mb-1">{getBrandName(rp.brand)}</p>
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                        {rp.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(rp.discount_price || rp.price)}
                        </span>
                        {rp.discount_price && (
                          <span className="text-sm text-gray-400 line-through">
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
    </div>
  );
}
