"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Truck, Star, Sparkles, Calendar, Gift } from "lucide-react";
import { cn } from "@/utils";

interface PromoItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const promoItems: PromoItem[] = [
  {
    id: "1",
    title: "Flash Sale",
    description: "Up to 70% OFF",
    icon: <Zap className="w-6 h-6" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: "2",
    title: "Free Delivery",
    description: "Orders above Rs. 1000",
    icon: <Truck className="w-6 h-6" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "3",
    title: "Top Rated",
    description: "Best quality products",
    icon: <Star className="w-6 h-6" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    id: "4",
    title: "New Arrivals",
    description: "Fresh stock weekly",
    icon: <Sparkles className="w-6 h-6" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "5",
    title: "Weekend Sale",
    description: "Special weekend deals",
    icon: <Calendar className="w-6 h-6" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "6",
    title: "Buy 2 Get 1",
    description: "On selected items",
    icon: <Gift className="w-6 h-6" />,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
];

export default function PromoWidgets() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const speed = 1;

    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += speed;
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="py-6 lg:py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Duplicate items for seamless scroll */}
          {[...promoItems, ...promoItems].map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "flex-shrink-0 flex items-center gap-4 px-6 py-4 rounded-xl border cursor-pointer transition-all hover:shadow-md",
                item.bgColor,
                "border-transparent hover:border-gray-200"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm",
                  item.color
                )}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
