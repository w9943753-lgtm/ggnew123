"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  CreditCard,
  FileText,
  Check,
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
  Building,
  Home,
  ShoppingBag,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/utils";
import { formatPrice } from "@/utils";
import { useCartStore } from "@/store/cart";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import PlaceholderImage from "@/components/ui/placeholder-image";

type Step = "info" | "address" | "payment" | "review" | "success";

const paymentMethods = [
  { id: "cod", name: "Cash on Delivery", description: "Pay when you receive your order", icon: "💵" },
  { id: "jazzcash", name: "JazzCash", description: "Mobile account payment", icon: "📱" },
  { id: "easypaisa", name: "EasyPaisa", description: "Mobile account payment", icon: "📱" },
  { id: "bank", name: "Bank Transfer", description: "Direct bank transfer", icon: "🏦" },
  { id: "card", name: "Credit/Debit Card", description: "Visa, MasterCard, etc.", icon: "💳" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("info");
  const [isGuest, setIsGuest] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    paymentMethod: "cod",
    orderNotes: "",
  });

  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.discount_price || item.product.price) * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 1000 ? 0 : 150;
  const tax = Math.round(subtotal * 0.015);
  const total = subtotal + deliveryFee + tax;

  const steps: { id: Step; label: string; icon: typeof User }[] = [
    { id: "info", label: "Info", icon: User },
    { id: "address", label: "Address", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: FileText },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const handleNext = async () => {
    if (step === "info") {
      setStep("address");
    } else if (step === "address") {
      setStep("payment");
    } else if (step === "payment") {
      setStep("review");
    } else if (step === "review") {
      setIsProcessing(true);
      setError(null);

      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();

        const shippingAddress = {
          full_name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          email: formData.email,
          address_line1: formData.address,
          city: formData.city,
          province: formData.province,
          postal_code: formData.postalCode,
        };

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: user?.id ?? null,
            guest_email: user ? null : formData.email,
            guest_name: user ? null : `${formData.firstName} ${formData.lastName}`,
            guest_phone: user ? null : formData.phone,
            status: "pending",
            subtotal,
            delivery_charge: deliveryFee,
            tax,
            discount: 0,
            total,
            payment_method: formData.paymentMethod,
            payment_status: formData.paymentMethod === "cod" ? "pending" : "awaiting",
            shipping_address: shippingAddress,
            billing_address: null,
            notes: formData.orderNotes || null,
            coupon_code: null,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.discount_price || item.product.price,
          total: (item.product.discount_price || item.product.price) * item.quantity,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;

        clearCart();
        setOrderNumber(order.id);
        setStep("success");
      } catch (err: any) {
        setError(err?.message || "Failed to place order. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleBack = () => {
    setError(null);
    if (step === "address") setStep("info");
    else if (step === "payment") setStep("address");
    else if (step === "review") setStep("payment");
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed!</h1>
            <p className="text-gray-500 mb-4">
              Thank you for your order. We&apos;ll send you a confirmation email shortly.
            </p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 text-left">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Number</span>
                  <span className="font-mono font-bold text-gray-900">
                    #{orderNumber?.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estimated Delivery</span>
                  <span className="font-medium text-gray-900">2-3 Business Days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {paymentMethods.find((m) => m.id === formData.paymentMethod)?.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Link
                href="/"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/cart" className="hover:text-green-600 transition-colors">Cart</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-0">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                      currentStepIndex >= i
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {currentStepIndex > i ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium mt-2 hidden sm:block",
                      currentStepIndex >= i ? "text-green-600" : "text-gray-400"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-16 sm:w-24 h-0.5 mx-2 mt-0 sm:-mt-6",
                      currentStepIndex > i ? "bg-green-600" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Info */}
              {step === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h2>
                  <div className="mb-4">
                    <button
                      onClick={() => setIsGuest(!isGuest)}
                      className={cn(
                        "w-full p-3 rounded-xl border-2 text-left transition-all text-sm",
                        isGuest ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <span className="font-semibold text-gray-900">Guest Checkout</span>
                      <p className="text-gray-500 text-xs mt-0.5">No account required</p>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">First Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => updateField("firstName", e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Ahmed"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Last Name *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Khan"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="ahmed@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="+92 300 1234567"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Address */}
              {step === "address" && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Street Address *</label>
                      <div className="relative">
                        <Home className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                          value={formData.address}
                          onChange={(e) => updateField("address", e.target.value)}
                          rows={2}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                          placeholder="House #123, Street 45, Sector F-8"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">City *</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => updateField("city", e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Islamabad"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Province *</label>
                        <select
                          value={formData.province}
                          onChange={(e) => updateField("province", e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                        >
                          <option value="">Select Province</option>
                          <option value="punjab">Punjab</option>
                          <option value="sindh">Sindh</option>
                          <option value="kpk">Khyber Pakhtunkhwa</option>
                          <option value="balochistan">Balochistan</option>
                          <option value="islamabad">Islamabad Capital</option>
                          <option value="gb">Gilgit-Baltistan</option>
                          <option value="ajk">Azad Jammu & Kashmir</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Postal Code</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => updateField("postalCode", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="44000"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Method</h2>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => updateField("paymentMethod", method.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                          formData.paymentMethod === method.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <span className="text-2xl">{method.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{method.name}</p>
                          <p className="text-xs text-gray-500">{method.description}</p>
                        </div>
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            formData.paymentMethod === method.id
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300"
                          )}
                        >
                          {formData.paymentMethod === method.id && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6">
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      value={formData.orderNotes}
                      onChange={(e) => updateField("orderNotes", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Any special instructions for delivery..."
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review */}
              {step === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Order Review</h2>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-3">
                          <PlaceholderImage
                            name={item.product.name}
                            className="w-12 h-12 rounded-lg bg-gray-50"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatPrice((item.product.discount_price || item.product.price) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Shipping To</h3>
                    <p className="text-sm text-gray-600">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.province} {formData.postalCode}<br />
                      {formData.phone}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                    <p className="text-sm text-gray-600">
                      {paymentMethods.find((m) => m.id === formData.paymentMethod)?.icon}{" "}
                      {paymentMethods.find((m) => m.id === formData.paymentMethod)?.name}
                    </p>
                  </div>

                  {formData.orderNotes && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Order Notes</h3>
                      <p className="text-sm text-gray-600">{formData.orderNotes}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step !== "info" && (
                <button
                  onClick={handleBack}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-green-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : step === "review" ? (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Place Order
                  </>
                ) : (
                  <>
                    Continue <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="relative">
                      <PlaceholderImage
                        name={item.product.name}
                        className="w-12 h-12 rounded-lg bg-gray-50"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice((item.product.discount_price || item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className={cn("font-medium", deliveryFee === 0 && "text-green-600")}>
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (1.5%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-green-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
