"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  Star,
  X,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn, getBrandName } from "@/utils";
import { formatPrice } from "@/utils";
import type { Product, Category } from "@/types";
import PlaceholderImage from "@/components/ui/placeholder-image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function ProductImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [imgError, setImgError] = useState(false);
  if (!src || imgError) {
    return <PlaceholderImage name={alt} className={className} />;
  }
  return <img src={src} alt={alt} className={className} onError={() => setImgError(true)} />;
}

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="bg-gradient-to-r from-green-200 to-green-300 rounded-2xl p-6 md:p-8 mb-8 animate-pulse h-28" />
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 animate-pulse">
              <div className="h-5 w-20 bg-gray-200 rounded" />
              <div className="space-y-3">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-16 bg-gray-200 rounded" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-5 w-32 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-6 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryProductsPage() {
  const { slug } = useParams<{ slug: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();

      const { data: cat } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (cat) {
        setCategory(cat);

        const [productsRes, subRes] = await Promise.all([
          supabase.from("products").select("*").eq("category_id", cat.id),
          supabase.from("categories").select("*").eq("parent_id", cat.id),
        ]);

        setProducts(productsRes.data || []);
        setSubcategories(subRes.data || []);
      }

      setLoading(false);
    }

    fetchData();
  }, [slug]);

  const allBrands = useMemo(() => {
    return [...new Set(products.map((p) => {
      if (typeof p.brand === "string") return p.brand;
      if (p.brand && typeof p.brand === "object") return p.brand.name || "";
      return "";
    }).filter(Boolean))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => {
        const brandName = typeof p.brand === "string" ? p.brand : p.brand?.name || "";
        return selectedBrands.includes(brandName);
      });
    }
    filtered = filtered.filter((p) => {
      const price = p.discount_price || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "newest":
        filtered.sort((a, b) => (b.is_new_arrival ? 1 : 0) - (a.is_new_arrival ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
    }
    return filtered;
  }, [products, sortBy, selectedBrands, priceRange]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <LoadingSkeleton />;

  const fallbackCategory: Category = {
    id: "0",
    name: slug,
    slug,
    image: null,
    product_count: 0,
  };
  const displayCategory = category || fallbackCategory;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/categories" className="hover:text-green-600 transition-colors">Categories</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">{displayCategory.name}</span>
        </nav>

        {/* Category Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 md:p-8 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{displayCategory.name}</h1>
          <p className="text-green-100 text-sm">{filteredProducts.length} products found</p>
        </div>

        {/* Subcategories Navigation */}
        {subcategories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${slug}?sub=${sub.slug}`}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:border-green-300 hover:text-green-600 transition-colors"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          {/* Filters Sidebar */}
          <div className={cn("md:w-64 flex-shrink-0", showFilters ? "block" : "hidden md:block")}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setPriceRange([0, 1000]);
                  }}
                  className="text-xs text-green-600 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Brands</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBrands([...selectedBrands, brand]);
                          } else {
                            setSelectedBrands(selectedBrands.filter((b) => b !== brand));
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                    <Link href={`/product/${product.slug}`} className="block">
                      <div className="relative aspect-square bg-gray-50 p-4">
                        <ProductImage
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-full h-full rounded-xl group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.discount_percent && product.discount_percent > 0 && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            -{product.discount_percent}%
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-green-600 font-medium mb-1">{getBrandName(product.brand)}</p>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600 font-medium">
                            {product.rating ?? 0} ({product.reviews_count ?? 0})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {product.discount_price ? (
                            <>
                              <span className="text-lg font-bold text-green-600">
                                {formatPrice(product.discount_price)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="px-4 pb-4">
                      <a
                        href={`https://wa.me/923044124129?text=${encodeURIComponent(`Hi, I want to order: ${product.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Order on WhatsApp
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {paginatedProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500">No products found matching your filters.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-10 h-10 rounded-xl text-sm font-semibold transition-colors",
                      currentPage === page
                        ? "bg-green-600 text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
