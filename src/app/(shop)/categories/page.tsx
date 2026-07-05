"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Grid3X3, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";
import PlaceholderImage from "@/components/ui/placeholder-image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from("categories")
        .select("*")
        .is("parent_id", null)
        .eq("is_active", true)
        .order("sort_order");
      if (data) setCategories(data as Category[]);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">All Categories</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Categories</h1>
            <p className="text-gray-500 text-sm mt-1">{loading ? "Loading..." : `${categories.length} categories available`}</p>
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

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-2/3 mx-auto" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
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
                  <div className="aspect-square bg-gray-50 p-4 flex items-center justify-center">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <PlaceholderImage
                        name={cat.name}
                        className="w-full h-full rounded-xl group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat, i) => (
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
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <PlaceholderImage name={cat.name} className="w-full h-full group-hover:scale-110 transition-transform duration-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {cat.name}
                    </h3>
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
