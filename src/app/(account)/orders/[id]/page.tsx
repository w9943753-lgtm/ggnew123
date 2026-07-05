"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Download,
  Copy,
} from "lucide-react";
import { cn } from "@/utils";
import PlaceholderImage from "@/components/ui/placeholder-image";

const demoOrder = {
  id: "ORD-2024-002",
  date: "2025-01-02",
  status: "shipped",
  estimatedDelivery: "2025-01-15",
  timeline: [
    { step: "Order Placed", date: "Jan 2, 10:30 AM", done: true, icon: Package },
    { step: "Confirmed", date: "Jan 2, 11:15 AM", done: true, icon: CheckCircle2 },
    { step: "Shipped", date: "Jan 3, 09:00 AM", done: true, icon: Truck },
    { step: "Delivered", date: "", done: false, icon: Clock },
  ],
  items: [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 1299,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
    },
  ],
  shipping: {
    name: "Abdul Rafey",
    address: "123 Main Street, Lahore, Punjab 54000, Pakistan",
    phone: "+92 300 1234567",
    method: "Standard Delivery",
  },
  payment: {
    method: "Credit Card",
    last4: "4242",
    subtotal: 1299,
    shipping: 0,
    tax: 0,
    total: 1299,
  },
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const lastStep = demoOrder.timeline.filter((t) => t.done).length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-orange-50/50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{id}</h1>
            <p className="text-gray-500">Placed on {demoOrder.date}</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            Shipped
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-green-100/30 border border-green-100/50 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
          <div className="space-y-0">
            {demoOrder.timeline.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        step.done
                          ? "bg-[#16A34A] text-white"
                          : i === lastStep + 1
                            ? "bg-[#EA580C] text-white"
                            : "bg-gray-100 text-gray-400"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {i < demoOrder.timeline.length - 1 && (
                      <div
                        className={cn(
                          "w-0.5 h-8 my-1",
                          step.done ? "bg-[#16A34A]" : "bg-gray-200"
                        )}
                      />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={cn("font-medium", step.done ? "text-gray-900" : "text-gray-400")}>
                      {step.step}
                    </p>
                    {step.date && <p className="text-sm text-gray-500">{step.date}</p>}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Estimated delivery: {demoOrder.estimatedDelivery}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-green-100/30 border border-green-100/50 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
          <div className="space-y-4">
            {demoOrder.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  <PlaceholderImage
                    name={item.name}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">₨{item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg shadow-green-100/30 border border-green-100/50 p-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-[#16A34A]" />
              Shipping Address
            </h3>
            <p className="text-sm text-gray-600">{demoOrder.shipping.name}</p>
            <p className="text-sm text-gray-600">{demoOrder.shipping.address}</p>
            <p className="text-sm text-gray-600">{demoOrder.shipping.phone}</p>
            <p className="text-sm text-[#16A34A] font-medium mt-2">{demoOrder.shipping.method}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-green-100/30 border border-green-100/50 p-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-[#16A34A]" />
              Payment Info
            </h3>
            <p className="text-sm text-gray-600">{demoOrder.payment.method} •••• {demoOrder.payment.last4}</p>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₨{demoOrder.payment.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{demoOrder.payment.shipping === 0 ? "Free" : `₨${demoOrder.payment.shipping}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>₨{demoOrder.payment.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 py-3 bg-[#16A34A] hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Download Invoice
          </button>
          <button className="px-4 py-3 bg-white border border-gray-200 hover:border-[#16A34A] text-gray-700 font-semibold rounded-xl transition-all flex items-center gap-2">
            <Copy className="w-5 h-5" />
            Copy Order ID
          </button>
        </div>
      </motion.div>
    </div>
  );
}
