"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Clock,
  Zap,
  TrendingUp,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  Flame,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { cn, getBrandName } from "@/utils";
import { formatPrice, calculateDiscount } from "@/utils";
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

function HeroSection({ logo, settings }: { logo?: string; settings?: any }) {
  const bgColor = settings?.heroBgColor || "#16A34A";
  const textColor = settings?.heroTextColor || "#FFFFFF";
  const bgImage = settings?.heroBgImage || "";

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: bgImage ? `url(${bgImage}) center/cover` : bgColor,
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center md:text-left"
        >
          {logo && (
            <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl p-3 mb-4 shadow-lg">
              <img src={logo} alt="Hafiz Store" className="h-14 w-auto object-contain" />
            </div>
          )}
          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Mega Sale
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-orange-400" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
            Fresh Groceries{" "}
            Delivered to your door step
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-xl text-orange-200" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
            Quality daily essentials delivered fresh to your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              href="/categories"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/categories"
              className="border-2 border-white/60 hover:border-white text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              View Deals
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Shop by Category
        </h2>
        <Link
          href="/categories"
          className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 text-sm"
        >
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex-shrink-0 snap-start"
          >
            <Link
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-50 overflow-hidden border-2 border-gray-100 group-hover:border-green-400 group-hover:shadow-lg transition-all">
                {(cat as any).image ? (
                  <img src={(cat as any).image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <PlaceholderImage name={cat.name} className="w-full h-full object-cover rounded-full" />
                )}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors text-center max-w-[80px] truncate">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FlashSaleTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              minutes = 59;
              seconds = 59;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      <div className="bg-gray-900 text-white rounded-lg px-2 py-1 text-sm font-mono font-bold min-w-[2rem] text-center">
        {pad(timeLeft.hours)}
      </div>
      <span className="text-gray-900 font-bold">:</span>
      <div className="bg-gray-900 text-white rounded-lg px-2 py-1 text-sm font-mono font-bold min-w-[2rem] text-center">
        {pad(timeLeft.minutes)}
      </div>
      <span className="text-gray-900 font-bold">:</span>
      <div className="bg-gray-900 text-white rounded-lg px-2 py-1 text-sm font-mono font-bold min-w-[2rem] text-center">
        {pad(timeLeft.seconds)}
      </div>
    </div>
  );
}

function ProductSlider({
  products,
  title,
  viewAllHref,
}: {
  products: Product[];
  title: string;
  viewAllHref: string;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        <Link
          href={viewAllHref}
          className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 text-sm"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="min-w-[220px] max-w-[260px] snap-start flex-shrink-0"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
              <Link href={`/product/${product.slug}`} className="block">
                <div className="relative aspect-square bg-gray-50 p-4">
                  <ProductImage src={product.images?.[0]} alt={product.name} className="w-full h-full rounded-xl" />
                  {product.discount_percent > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      -{product.discount_percent}%
                    </span>
                  )}
                  {product.is_flash_sale && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Flash
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
                      {product.rating > 0 ? product.rating : ""} {product.reviews_count > 0 ? `(${product.reviews_count})` : ""}
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
    </section>
  );
}

function PromoWidgets() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white"
        >
          <Zap className="w-8 h-8 mb-3 text-orange-300" />
          <h3 className="text-lg font-bold mb-2">Free Delivery</h3>
          <p className="text-sm text-green-100">On orders above Rs. 2,000. Fast and reliable delivery.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white"
        >
          <TrendingUp className="w-8 h-8 mb-3 text-orange-200" />
          <h3 className="text-lg font-bold mb-2">Daily Deals</h3>
          <p className="text-sm text-orange-100">New discounts every day on top brands. Don&apos;t miss out!</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white"
        >
          <Shield className="w-8 h-8 mb-3 text-green-200" />
          <h3 className="text-lg font-bold mb-2">100% Genuine</h3>
          <p className="text-sm text-green-100">All products are verified and sourced from authorized distributors.</p>
        </motion.div>
      </div>
    </section>
  );
}

function TrustBadges() {
  const badges = [
    { icon: Truck, label: "Free Delivery", sub: "Orders over Rs. 2,000" },
    { icon: Shield, label: "Secure Payment", sub: "100% Protected" },
    { icon: RotateCcw, label: "Easy Returns", sub: "7-Day Return Policy" },
    { icon: Headphones, label: "24/7 Support", sub: "Dedicated Help Center" },
  ];

  return (
    <section className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-3">
                <badge.icon className="w-7 h-7 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{badge.label}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{badge.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 h-[400px] animate-pulse" />

      {/* Category skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Flash sale skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 h-64 animate-pulse" />
      </div>

      {/* Product slider skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-8 w-56 bg-gray-200 rounded mb-8 animate-pulse" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="min-w-[220px] max-w-[260px] bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-t-2xl" />
              <div className="p-4">
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BannerSlider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
          {banners.map((banner) => (
            <Link key={banner.id} href={banner.link || "#"} className="min-w-full relative">
              <div className="relative aspect-[12/5] bg-gray-200">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <PlaceholderImage name={banner.title} className="w-full h-full" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                  <div className="p-6 md:p-10">
                    <h2 className="text-xl md:text-3xl font-bold text-white mb-2">{banner.title}</h2>
                    {banner.subtitle && <p className="text-white/80 text-sm md:text-base">{banner.subtitle}</p>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {banners.length > 1 && (
          <>
            <button onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg hidden md:block">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrent((prev) => (prev + 1) % banners.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg hidden md:block">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_: any, i: number) => (
                <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/40"}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [logo, setLogo] = useState<string>("");
  const [heroSettings, setHeroSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createSupabaseBrowserClient();
      const [categoriesRes, productsRes, bannersRes, logoRes, settingsRes] = await Promise.all([
        supabase.from("categories").select("*").is("parent_id", null).order("sort_order"),
        supabase.from("products").select("*").order("created_at", { ascending: false }).limit(10),
        supabase.from("banners").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("settings").select("value").eq("key", "logo").single(),
        supabase.from("settings").select("key, value"),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (productsRes.data) setProducts(productsRes.data);
      if (bannersRes.data) setBanners(bannersRes.data);
      if (logoRes.data?.value) setLogo(JSON.parse(logoRes.data.value as string));
      if (settingsRes.data) {
        const map: Record<string, string> = {};
        settingsRes.data.forEach((s: any) => { map[s.key] = s.value; });
        setHeroSettings({
          heroBgColor: map.heroBgColor || "#16A34A",
          heroTextColor: map.heroTextColor || "#FFFFFF",
          heroBgImage: map.heroBgImage || "",
        });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;

  const featuredProducts = products.filter((p) => p.is_featured);
  const flashSaleProducts = products.filter((p) => p.is_flash_sale);
  const topSellers = products.filter((p) => p.is_top_seller);
  const newArrivals = products.filter((p) => p.is_new_arrival);
  const popularProducts = products.filter((p) => p.is_popular);
  const discountedProducts = products.filter((p) => p.discount_price);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection logo={logo} settings={heroSettings} />
      <CategoryGrid categories={categories} />

      {/* Banner Slider */}
      {banners.length > 0 && (
        <BannerSlider banners={banners} />
      )}

      {/* Flash Sale Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-xl p-2">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Flash Sale</h2>
                <p className="text-white/80 text-sm">Limited time deals on top products</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-white/80" />
              <FlashSaleTimer />
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {flashSaleProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="min-w-[200px] max-w-[240px] snap-start flex-shrink-0"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-square bg-gray-50 p-3">
                    <ProductImage src={product.images?.[0]} alt={product.name} className="w-full h-full rounded-xl" />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      -{product.discount_percent}%
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-orange-600">
                        {formatPrice(product.discount_price || product.price)}
                      </span>
                      {product.discount_price && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <ProductSlider
        products={featuredProducts}
        title="Featured Products"
        viewAllHref="/categories"
      />

      {/* Mega Sale Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 py-4"
      >
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase">
              Limited Time
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              Fresh Groceries <span className="text-orange-400">& More</span>
            </h2>
            <p className="text-green-100">Quality products delivered fresh to your doorstep. Shop now!</p>
          </div>
          <Link
            href="/categories"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg whitespace-nowrap"
          >
            Shop Now
          </Link>
        </div>
      </motion.section>

      <ProductSlider
        products={popularProducts}
        title="Popular Products"
        viewAllHref="/categories"
      />

      <ProductSlider
        products={topSellers}
        title="Top Selling"
        viewAllHref="/categories"
      />

      <ProductSlider
        products={newArrivals}
        title="New Arrivals"
        viewAllHref="/categories"
      />

      <PromoWidgets />

      {/* Today's Deals */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Today&apos;s Deals
            </h2>
            <p className="text-gray-500 text-sm mt-1">Don&apos;t miss these discounted products!</p>
          </div>
          <Link
            href="/categories"
            className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 text-sm"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {discountedProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                href={`/product/${product.slug}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="relative aspect-square bg-gray-50 p-3">
                  <ProductImage src={product.images?.[0]} alt={product.name} className="w-full h-full rounded-xl" />
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    -{product.discount_percent}%
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs text-green-600 font-medium mb-1">{getBrandName(product.brand)}</p>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(product.discount_price || product.price)}
                    </span>
                    {product.discount_price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <TrustBadges />
    </div>
  );
}
