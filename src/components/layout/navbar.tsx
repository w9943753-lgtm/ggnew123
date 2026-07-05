"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, Heart, User, Menu, X, MapPin,
  ChevronDown, Phone, LogOut, Package, Settings, ArrowLeft, Bell
} from "lucide-react";
import { cn, formatPrice } from "@/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useUIStore } from "@/store/ui";
import { useNotifications } from "@/hooks/useNotifications";
import { CATEGORIES, PAKISTAN_CITIES, SITE_NAME } from "@/constants";
import CartDrawer from "./cart-drawer";
import { createClient } from "@/lib/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCities, setShowCities] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [user, setUser] = useState<SupaUser | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [logo, setLogo] = useState<string>("");

  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { unreadCount } = useNotifications(user?.id ?? null);
  const { toggleMobileMenu, isMobileMenuOpen, toggleCartDrawer, isCartDrawerOpen, selectedCity, setCity } = useUIStore();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.from("settings").select("value").eq("key", "logo").single().then(({ data }) => {
      if (data?.value) setLogo(JSON.parse(data.value as string));
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="bg-secondary text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              helpline@hafizstore.pk
            </span>
            <span>Free delivery above Rs. 3000</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/track-order" className="hover:underline">Track Order</Link>
            <Link href="/help" className="hover:underline">Help</Link>
            <Link href="/admin" className="hover:underline">Admin</Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white shadow-sm"
      )}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            {/* Mobile menu button */}
            <button onClick={toggleMobileMenu} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile categories button */}
            <button
              onClick={() => setShowMobileCategories(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Package className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-2">
                {logo ? (
                  <img src={logo} alt="Hafiz Store" className="h-10 w-auto object-contain" />
                ) : (
                  <h1 className="text-2xl font-bold text-secondary">{SITE_NAME}</h1>
                )}
              </div>
            </Link>

            {/* City selector - Desktop */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setShowCities(!showCities)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-secondary transition-colors px-3 py-2 rounded-xl hover:bg-gray-50"
              >
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="font-medium">{selectedCity}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {showCities && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[200px] z-50"
                  >
                    {PAKISTAN_CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => { setCity(city); setShowCities(false); }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-secondary/5 transition-colors",
                          selectedCity === city && "text-secondary font-medium bg-secondary/5"
                        )}
                      >
                        {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for groceries, brands, and more..."
                  className="w-full h-11 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                />
                <Link
                  href={`/search?q=${searchQuery}`}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-secondary text-white rounded-lg flex items-center hover:bg-secondary-dark transition-colors"
                >
                  <Search className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-1 ml-auto lg:ml-0">
              {/* Mobile search */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              {user && (
                <Link href="/notifications" className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#16A34A] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </Link>
              )}

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCartDrawer}
                className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center badge-pulse">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="hidden sm:flex p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[180px] z-50"
                        >
                          <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                            <User className="w-4 h-4" /> My Profile
                          </Link>
                          <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                            <Package className="w-4 h-4" /> My Orders
                          </Link>
                          <hr className="my-1 border-gray-100" />
                          <button
                            onClick={async () => {
                              const supabase = createClient();
                              await supabase.auth.signOut();
                              setUser(null);
                              setShowUserMenu(false);
                              window.location.href = "/";
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:flex p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Categories bar - Desktop */}
          <div className="hidden lg:block border-t border-gray-100">
            <div className="flex items-center gap-1 h-11 overflow-x-auto no-scrollbar">
              <div className="relative">
                <button
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                  className="flex items-center gap-1 px-4 py-1.5 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-dark transition-colors"
                >
                  <Menu className="w-4 h-4" />
                  All Categories
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      onMouseEnter={() => setShowCategories(true)}
                      onMouseLeave={() => setShowCategories(false)}
                      className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[240px] z-50"
                    >
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat}
                          href={`/category/${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-secondary/5 hover:text-secondary transition-colors"
                        >
                          {cat}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {["Flash Sale", "New Arrivals", "Top Selling", "Brands", "Deals"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-secondary transition-colors whitespace-nowrap font-medium"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden border-t border-gray-100 px-4 py-2 overflow-hidden"
            >
              <div className="relative">
                <button
                  onClick={() => setShowMobileSearch(false)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <input
                  type="text"
                  autoFocus
                  placeholder="Search products..."
                  className="w-full h-10 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartDrawerOpen} onClose={toggleCartDrawer} />

      {/* Mobile Categories Bottom Sheet */}
      <AnimatePresence>
        {showMobileCategories && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setShowMobileCategories(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden max-h-[70vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Categories</h3>
                <button
                  onClick={() => setShowMobileCategories(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[60vh] p-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-secondary/5 hover:text-secondary transition-colors rounded-xl"
                    onClick={() => setShowMobileCategories(false)}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
