"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Leaf,
  Apple,
  Beef,
  Egg,
  Cookie,
  Coffee,
  Snowflake,
  CakeSlice,
  SprayCan,
  Sparkles,
  Baby,
  CookingPot,
} from "lucide-react";
import { cn } from "@/utils";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  bgColor: string;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Fresh Vegetables",
    icon: <Leaf className="w-8 h-8" />,
    href: "/category/fresh-vegetables",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "2",
    name: "Fruits",
    icon: <Apple className="w-8 h-8" />,
    href: "/category/fruits",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: "3",
    name: "Meat & Fish",
    icon: <Beef className="w-8 h-8" />,
    href: "/category/meat-fish",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  {
    id: "4",
    name: "Dairy & Eggs",
    icon: <Egg className="w-8 h-8" />,
    href: "/category/dairy-eggs",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    id: "5",
    name: "Snacks",
    icon: <Cookie className="w-8 h-8" />,
    href: "/category/snacks",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    id: "6",
    name: "Beverages",
    icon: <Coffee className="w-8 h-8" />,
    href: "/category/beverages",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    id: "7",
    name: "Frozen Foods",
    icon: <Snowflake className="w-8 h-8" />,
    href: "/category/frozen-foods",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "8",
    name: "Bakery",
    icon: <CakeSlice className="w-8 h-8" />,
    href: "/category/bakery",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
  },
  {
    id: "9",
    name: "Cleaning",
    icon: <SprayCan className="w-8 h-8" />,
    href: "/category/cleaning",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
  },
  {
    id: "10",
    name: "Personal Care",
    icon: <Sparkles className="w-8 h-8" />,
    href: "/category/personal-care",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    id: "11",
    name: "Baby Care",
    icon: <Baby className="w-8 h-8" />,
    href: "/category/baby-care",
    color: "text-sky-500",
    bgColor: "bg-sky-50",
  },
  {
    id: "12",
    name: "Cooking Essentials",
    icon: <CookingPot className="w-8 h-8" />,
    href: "/category/cooking-essentials",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function CategoryGrid() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Shop by Category
            </h2>
            <p className="text-gray-500 mt-1">
              Browse our wide selection of products
            </p>
          </div>
          <Link
            href="/categories"
            className="text-green-600 hover:text-green-700 font-semibold text-sm hidden sm:inline-flex items-center gap-1"
          >
            View All
            <span className="text-lg">→</span>
          </Link>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="flex-shrink-0 w-28 group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "w-28 h-28 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all",
                    category.bgColor,
                    "border border-transparent hover:border-gray-200 hover:shadow-lg"
                  )}
                >
                  <div className={cn("transition-colors", category.color)}>
                    {category.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center px-1 leading-tight">
                    {category.name}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link href={category.href}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer",
                    category.bgColor,
                    "border border-transparent hover:border-gray-200 hover:shadow-xl"
                  )}
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-sm transition-shadow group-hover:shadow-md",
                      category.color
                    )}
                  >
                    {category.icon}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 text-center">
                    {category.name}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/categories"
            className="text-green-600 hover:text-green-700 font-semibold text-sm inline-flex items-center gap-1"
          >
            View All Categories
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
