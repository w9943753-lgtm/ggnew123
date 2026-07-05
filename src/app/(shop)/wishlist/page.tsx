"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { formatPrice, getBrandName } from "@/utils";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";
import PlaceholderImage from "@/components/ui/placeholder-image";

const demoProducts: Product[] = [
  { id: "1", name: "Surf Excel Detergent Powder", slug: "surf-excel-detergent-powder", description: "Surf Excel Quick Wash Detergent Powder.", sku: "SE-001", barcode: "9780000000001", price: 650, discount_price: 549, discount_percent: 15, stock: 120, images: ["/images/placeholder-product.jpg"], rating: 4.5, reviews_count: 342, brand: "Surf Excel", category: "Groceries", weight: "1 kg", unit: "pack" },
  { id: "2", name: "Shan Masala Biryani", slug: "shan-masala-biryani", description: "Shan Special Biryani Masala Mix.", sku: "SM-002", barcode: "9780000000002", price: 185, discount_price: 155, discount_percent: 16, stock: 200, images: ["/images/placeholder-product.jpg"], rating: 4.8, reviews_count: 567, brand: "Shan", category: "Groceries", weight: "60 g", unit: "pack" },
  { id: "3", name: "Tapal Tea Danedar", slug: "tapal-tea-danedar", description: "Tapal Danedar Green Tea.", sku: "TT-003", barcode: "9780000000003", price: 380, discount_price: 320, discount_percent: 16, stock: 180, images: ["/images/placeholder-product.jpg"], rating: 4.6, reviews_count: 890, brand: "Tapal", category: "Beverages", weight: "250 g", unit: "pack" },
  { id: "4", name: "Olper's Full Cream Milk", slug: "olpers-full-cream-milk", description: "Olper's Full Cream Milk.", sku: "OM-004", barcode: "9780000000004", price: 280, discount_price: 249, discount_percent: 11, stock: 95, images: ["/images/placeholder-product.jpg"], rating: 4.3, reviews_count: 234, brand: "Olper's", category: "Dairy & Eggs", weight: "1 L", unit: "carton" },
  { id: "5", name: "Dawn Bread Classic", slug: "dawn-bread-classic", description: "Dawn Classic Bread.", sku: "DB-005", barcode: "9780000000005", price: 120, discount_price: 99, discount_percent: 18, stock: 150, images: ["/images/placeholder-product.jpg"], rating: 4.2, reviews_count: 178, brand: "Dawn", category: "Bakery", weight: "400 g", unit: "pack" },
];

export default function WishlistPage() {
  const { items: wishlistIds, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  const products = wishlistIds
    .map((id) => demoProducts.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    removeItem(product.id);
  };

  if (wishlistIds.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Save your favorite items here to buy them later or share with friends.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" /> Browse Products
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 text-sm mt-1">{wishlistIds.length} items saved</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="relative aspect-square bg-gray-50 p-4">
                      <PlaceholderImage
                        name={product.name}
                        className="w-full h-full rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeItem(product.id);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                    <div className="p-4">
                      {product.brand && (
                        <p className="text-xs text-green-600 font-medium mb-1">{getBrandName(product.brand)}</p>
                      )}
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
                        {product.name}
                      </h3>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(product.discount_price || product.price)}
                      </span>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
