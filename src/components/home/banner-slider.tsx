"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import { cn } from "@/utils";
import "swiper/css";
import "swiper/css/pagination";

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  gradient: string;
  emoji: string;
}

const slides: BannerSlide[] = [
  {
    id: "1",
    title: "Fresh Fruits Festival",
    subtitle: "Get up to 50% off on all fresh fruits",
    ctaText: "Shop Fruits",
    ctaLink: "/category/fruits",
    gradient: "from-orange-500 to-red-500",
    emoji: "🍊",
  },
  {
    id: "2",
    title: "Daily Fresh Vegetables",
    subtitle: "Farm fresh vegetables delivered daily",
    ctaText: "Order Now",
    ctaLink: "/category/fresh-vegetables",
    gradient: "from-green-500 to-emerald-600",
    emoji: "🥦",
  },
  {
    id: "3",
    title: "Dairy Products Sale",
    subtitle: "Fresh milk, eggs & more at best prices",
    ctaText: "View Deals",
    ctaLink: "/category/dairy-eggs",
    gradient: "from-blue-500 to-indigo-600",
    emoji: "🥛",
  },
];

export default function BannerSlider() {
  const swiperRef = useRef<any>(null);

  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="banner-slider rounded-2xl overflow-hidden"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div
                  className={cn(
                    "relative min-h-[200px] md:min-h-[280px] lg:min-h-[320px] bg-gradient-to-r p-8 md:p-12 lg:p-16 flex items-center",
                    slide.gradient
                  )}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
                  </div>

                  <div className="relative z-10 max-w-xl">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3"
                    >
                      {slide.title}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="text-white/90 text-sm md:text-base mb-6"
                    >
                      {slide.subtitle}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        href={slide.ctaLink}
                        className="inline-flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                      >
                        {slide.ctaText}
                        <span className="text-lg">→</span>
                      </Link>
                    </motion.div>
                  </div>

                  {/* Emoji */}
                  <div className="hidden md:flex absolute right-12 lg:right-24 top-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{ y: [-10, 10, -10] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-7xl lg:text-9xl"
                    >
                      {slide.emoji}
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
