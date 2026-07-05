"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, ShoppingCart, ArrowRight } from "lucide-react";
import { cn } from "@/utils";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-green-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Fresh Groceries Store</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Fresh Groceries{" "}
              <span className="text-orange-400">Delivered</span>
              <br />
              To Your Door
            </h1>

            <p className="text-lg text-green-100 max-w-lg">
              Get the freshest fruits, vegetables, and daily essentials delivered
              right to your doorstep. Quality guaranteed with every order.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative max-w-xl"
            >
              <div className="flex bg-white rounded-xl shadow-xl overflow-hidden p-1">
                <div className="flex items-center px-4 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search for groceries, fruits, vegetables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-2 py-3 text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Shop Now Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Shop Now
              </a>
              <a
                href="/categories"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                View Categories
              </a>
            </motion.div>

            {/* Location Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 text-white/80 text-sm"
            >
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>Delivering to all areas in the city</span>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image/Graphic */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🥬</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Fresh Veggies</p>
                    <p className="text-sm text-green-600">Up to 40% OFF</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🍎</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Organic Fruits</p>
                    <p className="text-sm text-orange-600">Farm Fresh</p>
                  </div>
                </div>
              </motion.div>

              {/* Main Graphic */}
              <div className="w-80 h-80 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-64 h-64 bg-gradient-to-br from-orange-400/30 to-green-400/30 rounded-full flex items-center justify-center">
                  <span className="text-9xl">🛒</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" className="w-full">
          <path
            d="M0 50L48 45C96 40 192 30 288 25C384 20 480 20 576 25C672 30 768 40 864 45C960 50 1056 50 1152 45C1248 40 1344 30 1392 25L1440 20V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
