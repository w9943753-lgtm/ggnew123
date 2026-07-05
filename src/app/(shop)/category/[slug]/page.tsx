"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  Star,
  ShoppingCart,
  Heart,
  X,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn, getBrandName } from "@/utils";
import { formatPrice } from "@/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import type { Product, Category } from "@/types";
import PlaceholderImage from "@/components/ui/placeholder-image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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

  const addItem = useCartStore((s) => s.addItem);
  const addWishlistItem = useWishlistStore((s) => s.addItem);

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
                        <PlaceholderImage
                          name={product.name}
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
                    <div className="px-4 pb-4 flex gap-2">
                      <button
                        onClick={() =>
                          addItem(product)
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" /> Add
                      </button>
                      <button
                        onClick={() =>
                          addWishlistItem(product.id)
                        }
                        className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
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
