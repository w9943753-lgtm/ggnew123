"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Tag,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  X,
  Gift,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";
import { formatPrice } from "@/utils";
import { useCartStore } from "@/store/cart";
import PlaceholderImage from "@/components/ui/placeholder-image";

export default function CartPage() {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const { items, updateQuantity, removeItem, clearCart } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.discount_price || item.product.price) * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 1000 ? 0 : 150;
  const tax = Math.round(subtotal * 0.015);
  const total = subtotal + deliveryFee + tax - couponDiscount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    const code = couponCode.toUpperCase();
    if (code === "HAFIZ10") {
      setAppliedCoupon(code);
      setCouponDiscount(Math.round(subtotal * 0.1));
      setCouponError("");
    } else if (code === "WELCOME50") {
      setAppliedCoupon(code);
      setCouponDiscount(50);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
      setCouponDiscount(0);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <ShoppingBag className="w-14 h-14 text-gray-300" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" /> Start Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">Cart ({items.length} items)</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>

            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5"
                >
                  <div className="flex gap-4">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0"
                    >
                      <PlaceholderImage
                        name={item.product.name}
                        className="w-full h-full"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="font-semibold text-gray-900 text-sm md:text-base hover:text-green-600 transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-gray-400 mt-1">SKU: {item.product.sku}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, Math.min(item.product.stock ?? 999, item.quantity + 1))
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice((item.product.discount_price || item.product.price) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm transition-colors mt-4"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Coupon Input */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError("");
                      }}
                      placeholder="Enter code"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-500 mt-1">{couponError}</p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center gap-2 mt-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                    <Gift className="w-3.5 h-3.5" />
                    <span>{appliedCoupon} applied! -{formatPrice(couponDiscount)}</span>
                    <button
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponDiscount(0);
                        setCouponCode("");
                      }}
                      className="ml-auto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Try: HAFIZ10 or WELCOME50
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className={cn("font-medium", deliveryFee === 0 ? "text-green-600" : "text-gray-900")}>
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (1.5%)</span>
                  <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Coupon Discount</span>
                    <span className="font-medium text-green-600">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-green-600">{formatPrice(total)}</span>
                </div>
              </div>

              {deliveryFee === 0 && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-2 rounded-lg mb-4">
                  <Truck className="w-4 h-4" />
                  <span>You qualify for free delivery!</span>
                </div>
              )}

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-green-600/25"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <Truck className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Free Delivery</p>
                </div>
                <div className="text-center">
                  <Shield className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Secure Payment</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Easy Returns</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
