"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Grid3X3, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";
import PlaceholderImage from "@/components/ui/placeholder-image";

const demoCategories = [
  { id: "1", name: "Groceries", slug: "groceries", image: "/images/placeholder-product.jpg", product_count: 150, description: null, parent_id: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Dairy & Eggs", slug: "dairy-eggs", image: "/images/placeholder-product.jpg", product_count: 45, description: null, parent_id: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Beverages", slug: "beverages", image: "/images/placeholder-product.jpg", product_count: 80, description: null, parent_id: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Snacks", slug: "snacks", image: "/images/placeholder-product.jpg", product_count: 60, description: null, parent_id: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Personal Care", slug: "personal-care", image: "/images/placeholder-product.jpg", product_count: 35, description: null, parent_id: null, sort_order: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "6", name: "Home & Kitchen", slug: "home-kitchen", image: "/images/placeholder-product.jpg", product_count: 50, description: null, parent_id: null, sort_order: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "7", name: "Bakery", slug: "bakery", image: "/images/placeholder-product.jpg", product_count: 25, description: null, parent_id: null, sort_order: 7, is_active: true, created_at: "", updated_at: "" },
  { id: "8", name: "Frozen Food", slug: "frozen-food", image: "/images/placeholder-product.jpg", product_count: 40, description: null, parent_id: null, sort_order: 8, is_active: true, created_at: "", updated_at: "" },
  { id: "9", name: "Baby Care", slug: "baby-care", image: "/images/placeholder-product.jpg", product_count: 30, description: null, parent_id: null, sort_order: 9, is_active: true, created_at: "", updated_at: "" },
  { id: "10", name: "Pet Food", slug: "pet-food", image: "/images/placeholder-product.jpg", product_count: 20, description: null, parent_id: null, sort_order: 10, is_active: true, created_at: "", updated_at: "" },
  { id: "11", name: "Cleaning Supplies", slug: "cleaning-supplies", image: "/images/placeholder-product.jpg", product_count: 55, description: null, parent_id: null, sort_order: 11, is_active: true, created_at: "", updated_at: "" },
  { id: "12", name: "Spices & Condiments", slug: "spices-condiments", image: "/images/placeholder-product.jpg", product_count: 70, description: null, parent_id: null, sort_order: 12, is_active: true, created_at: "", updated_at: "" },
  { id: "13", name: "Cooking Essentials", slug: "cooking-essentials", image: "/images/placeholder-product.jpg", product_count: 40, description: null, parent_id: null, sort_order: 13, is_active: true, created_at: "", updated_at: "" },
  { id: "14", name: "Health & Wellness", slug: "health-wellness", image: "/images/placeholder-product.jpg", product_count: 35, description: null, parent_id: null, sort_order: 14, is_active: true, created_at: "", updated_at: "" },
  { id: "15", name: "Stationery", slug: "stationery", image: "/images/placeholder-product.jpg", product_count: 28, description: null, parent_id: null, sort_order: 15, is_active: true, created_at: "", updated_at: "" },
  { id: "16", name: "Household Items", slug: "household-items", image: "/images/placeholder-product.jpg", product_count: 65, description: null, parent_id: null, sort_order: 16, is_active: true, created_at: "", updated_at: "" },
];

export default function CategoriesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">All Categories</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Categories</h1>
            <p className="text-gray-500 text-sm mt-1">{demoCategories.length} categories available</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                viewMode === "grid" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                viewMode === "list" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {demoCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="aspect-square bg-gray-50 p-4">
                    <PlaceholderImage
                      name={cat.name}
                      className="w-full h-full rounded-xl group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {cat.product_count} products
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {demoCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 group"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                    <PlaceholderImage
                      name={cat.name}
                      className="w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {cat.product_count} products
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-600 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
