"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Package,
} from "lucide-react";
import Link from "next/link";
import { cn, getBrandName, getCategoryName } from "@/utils";
import { formatPrice } from "@/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import type { Product } from "@/types";
import PlaceholderImage from "@/components/ui/placeholder-image";

const allProducts: Product[] = [
  { id: "1", name: "Surf Excel Detergent Powder", slug: "surf-excel-detergent-powder", description: "Surf Excel Quick Wash Detergent Powder with superior stain removal technology.", sku: "SE-001", barcode: "9780000000001", price: 650, discount_price: 549, discount_percent: 15, stock: 120, images: ["/images/placeholder-product.jpg"], rating: 4.5, reviews_count: 342, brand: "Surf Excel", category: "Groceries", weight: "1 kg", unit: "pack", is_featured: true, is_popular: true, is_top_seller: true, is_new_arrival: false, is_flash_sale: true },
  { id: "2", name: "Shan Masala Biryani", slug: "shan-masala-biryani", description: "Shan Special Biryani Masala Mix for the perfect Hyderabadi biryani.", sku: "SM-002", barcode: "9780000000002", price: 185, discount_price: 155, discount_percent: 16, stock: 200, images: ["/images/placeholder-product.jpg"], rating: 4.8, reviews_count: 567, brand: "Shan", category: "Groceries", weight: "60 g", unit: "pack", is_featured: true, is_popular: true, is_top_seller: true, is_new_arrival: false, is_flash_sale: true },
  { id: "3", name: "Tapal Tea Danedar", slug: "tapal-tea-danedar", description: "Tapal Danedar Green Tea with a rich, refreshing taste.", sku: "TT-003", barcode: "9780000000003", price: 380, discount_price: 320, discount_percent: 16, stock: 180, images: ["/images/placeholder-product.jpg"], rating: 4.6, reviews_count: 890, brand: "Tapal", category: "Beverages", weight: "250 g", unit: "pack", is_featured: true, is_popular: true, is_top_seller: true, is_new_arrival: false, is_flash_sale: false },
  { id: "4", name: "Olper's Full Cream Milk", slug: "olpers-full-cream-milk", description: "Olper's Full Cream Milk, rich in calcium and vitamin D.", sku: "OM-004", barcode: "9780000000004", price: 280, discount_price: 249, discount_percent: 11, stock: 95, images: ["/images/placeholder-product.jpg"], rating: 4.3, reviews_count: 234, brand: "Olper's", category: "Dairy & Eggs", weight: "1 L", unit: "carton", is_featured: true, is_popular: false, is_top_seller: true, is_new_arrival: false, is_flash_sale: false },
  { id: "5", name: "Dawn Bread Classic", slug: "dawn-bread-classic", description: "Dawn Classic Bread, soft and fresh.", sku: "DB-005", barcode: "9780000000005", price: 120, discount_price: 99, discount_percent: 18, stock: 150, images: ["/images/placeholder-product.jpg"], rating: 4.2, reviews_count: 178, brand: "Dawn", category: "Bakery", weight: "400 g", unit: "pack", is_featured: false, is_popular: true, is_top_seller: true, is_new_arrival: false, is_flash_sale: true },
  { id: "6", name: "Coca Cola 1.5L", slug: "coca-cola-1-5l", description: "Coca Cola Original Taste 1.5 Liter bottle.", sku: "CC-006", barcode: "9780000000006", price: 160, discount_price: 140, discount_percent: 13, stock: 200, images: ["/images/placeholder-product.jpg"], rating: 4.4, reviews_count: 445, brand: "Coca Cola", category: "Beverages", weight: "1.5 L", unit: "bottle", is_featured: true, is_popular: true, is_top_seller: true, is_new_arrival: false, is_flash_sale: false },
  { id: "7", name: "National Ketchup", slug: "national-ketchup", description: "National Tomato Ketchup made from fresh, ripe tomatoes.", sku: "NK-007", barcode: "9780000000007", price: 210, discount_price: 185, discount_percent: 12, stock: 130, images: ["/images/placeholder-product.jpg"], rating: 4.1, reviews_count: 156, brand: "National", category: "Groceries", weight: "500 g", unit: "bottle", is_featured: false, is_popular: false, is_top_seller: false, is_new_arrival: false, is_flash_sale: true },
  { id: "8", name: "Lays Classic Salted Chips", slug: "lays-classic-salted-chips", description: "Lay's Classic Salted Potato Chips.", sku: "LC-008", barcode: "9780000000008", price: 90, discount_price: null, discount_percent: 0, stock: 250, images: ["/images/placeholder-product.jpg"], rating: 4.3, reviews_count: 312, brand: "Lay's", category: "Snacks", weight: "52 g", unit: "pack", is_featured: false, is_popular: true, is_top_seller: true, is_new_arrival: false, is_flash_sale: false },
  { id: "9", name: "Nestle Milkpak", slug: "nestle-milkpak", description: "Nestle Milkpak UHT Milk.", sku: "NM-009", barcode: "9780000000009", price: 265, discount_price: 235, discount_percent: 11, stock: 110, images: ["/images/placeholder-product.jpg"], rating: 4.4, reviews_count: 289, brand: "Nestle", category: "Dairy & Eggs", weight: "1 L", unit: "carton", is_featured: true, is_popular: false, is_top_seller: false, is_new_arrival: false, is_flash_sale: false },
  { id: "10", name: "Colgate MaxFresh Toothpaste", slug: "colgate-maxfresh-toothpaste", description: "Colgate MaxFresh Toothpaste with cooling crystals.", sku: "CM-010", barcode: "9780000000010", price: 245, discount_price: 210, discount_percent: 14, stock: 80, images: ["/images/placeholder-product.jpg"], rating: 4.5, reviews_count: 198, brand: "Colgate", category: "Personal Care", weight: "150 g", unit: "tube", is_featured: false, is_popular: false, is_top_seller: false, is_new_arrival: false, is_flash_sale: true },
  { id: "11", name: "Knorr Chicken Cube", slug: "knorr-chicken-cube", description: "Knorr Chicken Cubes for rich, flavorful soups.", sku: "KC-011", barcode: "9780000000011", price: 135, discount_price: 115, discount_percent: 15, stock: 175, images: ["/images/placeholder-product.jpg"], rating: 4.6, reviews_count: 421, brand: "Knorr", category: "Groceries", weight: "72 g", unit: "pack", is_featured: true, is_popular: true, is_top_seller: true, is_new_arrival: false, is_flash_sale: false },
  { id: "12", name: "Pepsi 1 Liter", slug: "pepsi-1-liter", description: "Pepsi Original Taste 1 Liter bottle.", sku: "P-012", barcode: "9780000000012", price: 110, discount_price: null, discount_percent: 0, stock: 300, images: ["/images/placeholder-product.jpg"], rating: 4.3, reviews_count: 567, brand: "Pepsi", category: "Beverages", weight: "1 L", unit: "bottle", is_featured: false, is_popular: true, is_top_seller: true, is_new_arrival: false, is_flash_sale: false },
  { id: "13", name: "Dalda Cooking Oil", slug: "dalda-cooking-oil", description: "Dalda Banaspati Cooking Oil.", sku: "DCO-013", barcode: "9780000000013", price: 480, discount_price: 420, discount_percent: 13, stock: 65, images: ["/images/placeholder-product.jpg"], rating: 4.4, reviews_count: 234, brand: "Dalda", category: "Groceries", weight: "1 L", unit: "bottle", is_featured: true, is_popular: false, is_top_seller: false, is_new_arrival: false, is_flash_sale: false },
  { id: "14", name: "Quetta Bakery Biscuits", slug: "quetta-bakery-biscuits", description: "Quetta Bakery Premium Biscuits.", sku: "QB-014", barcode: "9780000000014", price: 150, discount_price: 130, discount_percent: 13, stock: 90, images: ["/images/placeholder-product.jpg"], rating: 4.2, reviews_count: 145, brand: "Quetta Bakery", category: "Snacks", weight: "300 g", unit: "pack", is_featured: false, is_popular: false, is_top_seller: false, is_new_arrival: true, is_flash_sale: false },
  { id: "15", name: "Lux Soap Beauty Bar", slug: "lux-soap-beauty-bar", description: "Lux Soft Touch Soap.", sku: "LS-015", barcode: "9780000000015", price: 145, discount_price: 125, discount_percent: 14, stock: 200, images: ["/images/placeholder-product.jpg"], rating: 4.3, reviews_count: 312, brand: "Lux", category: "Personal Care", weight: "120 g", unit: "bar", is_featured: false, is_popular: true, is_top_seller: false, is_new_arrival: false, is_flash_sale: true },
  { id: "16", name: "Mitchell's Fruit Jam", slug: "mitchells-fruit-jam", description: "Mitchell's Mixed Fruit Jam.", sku: "MFJ-016", barcode: "9780000000016", price: 295, discount_price: 260, discount_percent: 12, stock: 70, images: ["/images/placeholder-product.jpg"], rating: 4.5, reviews_count: 189, brand: "Mitchell's", category: "Groceries", weight: "450 g", unit: "jar", is_featured: false, is_popular: false, is_top_seller: false, is_new_arrival: true, is_flash_sale: false },
  { id: "17", name: "Gourmet Noodles", slug: "gourmet-noodles", description: "Gourmet Instant Noodles.", sku: "GN-017", barcode: "9780000000017", price: 65, discount_price: null, discount_percent: 0, stock: 350, images: ["/images/placeholder-product.jpg"], rating: 4.1, reviews_count: 423, brand: "Gourmet", category: "Snacks", weight: "70 g", unit: "pack", is_featured: false, is_popular: true, is_top_seller: true, is_new_arrival: false, is_flash_sale: false },
  { id: "18", name: "Sufi Cooking Oil", slug: "sufi-cooking-oil", description: "Sufi Cooking Oil for healthy meals.", sku: "SCO-018", barcode: "9780000000018", price: 520, discount_price: 455, discount_percent: 13, stock: 55, images: ["/images/placeholder-product.jpg"], rating: 4.3, reviews_count: 167, brand: "Sufi", category: "Groceries", weight: "1.5 L", unit: "bottle", is_featured: false, is_popular: false, is_top_seller: false, is_new_arrival: false, is_flash_sale: false },
  { id: "19", name: "Nescafe Classic Coffee", slug: "nescafe-classic-coffee", description: "Nescafe Classic Instant Coffee.", sku: "NC-019", barcode: "9780000000019", price: 680, discount_price: 599, discount_percent: 12, stock: 85, images: ["/images/placeholder-product.jpg"], rating: 4.7, reviews_count: 678, brand: "Nescafe", category: "Beverages", weight: "100 g", unit: "jar", is_featured: true, is_popular: true, is_top_seller: false, is_new_arrival: false, is_flash_sale: false },
  { id: "20", name: "Hand Sanitizer antibacterial", slug: "hand-sanitizer-antibacterial", description: "Dettol Hand Sanitizer.", sku: "HS-020", barcode: "9780000000020", price: 220, discount_price: 185, discount_percent: 16, stock: 120, images: ["/images/placeholder-product.jpg"], rating: 4.4, reviews_count: 234, brand: "Dettol", category: "Personal Care", weight: "200 ml", unit: "bottle", is_featured: false, is_popular: false, is_top_seller: false, is_new_arrival: true, is_flash_sale: true },
  { id: "21", name: "Maggi Ketchup", slug: "maggi-ketchup", description: "Maggi Rich Tomato Ketchup.", sku: "MK-021", barcode: "9780000000021", price: 195, discount_price: 170, discount_percent: 13, stock: 140, images: ["/images/placeholder-product.jpg"], rating: 4.2, reviews_count: 256, brand: "Maggi", category: "Groceries", weight: "500 g", unit: "bottle", is_featured: false, is_popular: false, is_top_seller: false, is_new_arrival: true, is_flash_sale: false },
  { id: "22", name: "Olpers Dairy Cream", slug: "olpers-dairy-cream", description: "Olpers Dairy Cream.", sku: "ODC-022", barcode: "9780000000022", price: 185, discount_price: 160, discount_percent: 14, stock: 60, images: ["/images/placeholder-product.jpg"], rating: 4.3, reviews_count: 134, brand: "Olper's", category: "Dairy & Eggs", weight: "200 ml", unit: "pack", is_featured: false, is_popular: false, is_top_seller: false, is_new_arrival: true, is_flash_sale: false },
  { id: "23", name: "Chips Oman", slug: "chips-oman", description: "Chips Oman Spicy Chili flavored potato chips.", sku: "CO-023", barcode: "9780000000023", price: 80, discount_price: null, discount_percent: 0, stock: 280, images: ["/images/placeholder-product.jpg"], rating: 4.5, reviews_count: 345, brand: "Chips Oman", category: "Snacks", weight: "40 g", unit: "pack", is_featured: false, is_popular: true, is_top_seller: false, is_new_arrival: false, is_flash_sale: false },
  { id: "24", name: "Water's Edge Bottled Water", slug: "waters-edge-bottled-water", description: "Water's Edge Purified Drinking Water.", sku: "WE-024", barcode: "9780000000024", price: 40, discount_price: null, discount_percent: 0, stock: 500, images: ["/images/placeholder-product.jpg"], rating: 4.1, reviews_count: 123, brand: "Water's Edge", category: "Beverages", weight: "1.5 L", unit: "bottle", is_featured: false, is_popular: false, is_top_seller: false, is_new_arrival: false, is_flash_sale: false },
];

const popularSearches = ["Shan Masala", "Milk", "Tea", "Chips", "Bread", "Coca Cola", "Noodles", "Oil"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [...new Set(allProducts.map((p) => getCategoryName(p.category)))].filter(Boolean);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    let filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        getBrandName(p.brand).toLowerCase().includes(query.toLowerCase()) ||
        getCategoryName(p.category).toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
    if (selectedCategory) {
      filtered = filtered.filter((p) => getCategoryName(p.category) === selectedCategory);
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
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
    }
    return filtered;
  }, [query, sortBy, selectedCategory, priceRange]);

  const addItem = useCartStore((s) => s.addItem);
  const addWishlistItem = useWishlistStore((s) => s.addItem);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for groceries, beverages, snacks..."
                className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Popular Searches */}
          {!query && (
            <div className="max-w-2xl mx-auto mt-4 text-center">
              <p className="text-sm text-gray-500 mb-3">Popular Searches:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {query && (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className={cn("md:w-56 flex-shrink-0", showFilters ? "block" : "hidden md:block")}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5 sticky top-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setPriceRange([0, 1000]);
                    }}
                    className="text-xs text-green-600 font-medium"
                  >
                    Clear
                  </button>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={cn(
                        "w-full text-left text-sm px-3 py-2 rounded-lg transition-colors",
                        !selectedCategory ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "w-full text-left text-sm px-3 py-2 rounded-lg transition-colors",
                          selectedCategory === cat ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Price</h4>
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
              </div>
            </div>

            {/* Results */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center gap-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                  </button>
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {results.map((product, i) => (
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
                            {product.discount_percent > 0 && (
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
                                {product.rating} ({product.reviews_count})
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
                            onClick={() => addItem(product, 1)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" /> Add
                          </button>
                          <button
                            onClick={() => addWishlistItem(product.id)}
                            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors"
                          >
                            <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 mb-2">No products found for &quot;{query}&quot;</p>
                  <p className="text-sm text-gray-400">Try different keywords or browse categories</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
