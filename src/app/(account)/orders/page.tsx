"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/utils";

const demoOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-12-28",
    status: "delivered",
    total: 2499,
    items: 3,
    timeline: [
      { step: "Placed", done: true },
      { step: "Confirmed", done: true },
      { step: "Shipped", done: true },
      { step: "Delivered", done: true },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2025-01-02",
    status: "shipped",
    total: 1299,
    items: 1,
    timeline: [
      { step: "Placed", done: true },
      { step: "Confirmed", done: true },
      { step: "Shipped", done: true },
      { step: "Delivered", done: false },
    ],
  },
  {
    id: "ORD-2025-003",
    date: "2025-01-10",
    status: "confirmed",
    total: 3499,
    items: 5,
    timeline: [
      { step: "Placed", done: true },
      { step: "Confirmed", done: true },
      { step: "Shipped", done: false },
      { step: "Delivered", done: false },
    ],
  },
  {
    id: "ORD-2025-004",
    date: "2025-01-12",
    status: "cancelled",
    total: 899,
    items: 2,
    timeline: [
      { step: "Placed", done: true },
      { step: "Cancelled", done: true },
      { step: "Shipped", done: false },
      { step: "Delivered", done: false },
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  delivered: { label: "Delivered", color: "bg-green-100 text-[#16A34A]", icon: CheckCircle2 },
  shipped: { label: "Shipped", color: "bg-blue-100 text-blue-600", icon: Truck },
  confirmed: { label: "Confirmed", color: "bg-yellow-100 text-yellow-600", icon: Clock },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-600", icon: XCircle },
};

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? demoOrders : demoOrders.filter((o) => o.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-orange-50/50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {["all", "delivered", "shipped", "confirmed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                filter === f
                  ? "bg-[#16A34A] text-white shadow-lg shadow-green-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#16A34A]"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">You haven&apos;t placed any orders yet.</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#16A34A] text-white font-semibold rounded-xl shadow-lg shadow-green-200 hover:bg-green-600 transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            filtered.map((order, i) => {
              const sc = statusConfig[order.status];
              const Icon = sc.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/orders/${order.id}`}
                    className="block bg-white rounded-2xl shadow-md shadow-green-100/20 border border-gray-100 p-5 hover:shadow-lg hover:border-[#16A34A]/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <span className={cn("px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1", sc.color)}>
                        <Icon className="w-3.5 h-3.5" />
                        {sc.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {order.timeline.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              t.done ? "bg-[#16A34A]" : "bg-gray-300"
                            )}
                          />
                          <span className="text-xs text-gray-500">{t.step}</span>
                          {idx < order.timeline.length - 1 && (
                            <div className="w-4 h-px bg-gray-200" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {order.items} item{order.items > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">₨{order.total.toLocaleString()}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
