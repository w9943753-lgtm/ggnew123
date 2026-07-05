"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Loader2,
  User,
} from "lucide-react";
import { formatPrice } from "@/utils";
import { createClient } from "@/lib/supabase/client";
import PlaceholderImage from "@/components/ui/placeholder-image";

const statusActions: Record<string, { label: string; nextStatus: string; color: string }[]> = {
  pending: [
    { label: "Confirm Order", nextStatus: "processing", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Cancel", nextStatus: "cancelled", color: "bg-red-600 hover:bg-red-700" },
  ],
  processing: [
    { label: "Mark as Shipped", nextStatus: "shipped", color: "bg-purple-600 hover:bg-purple-700" },
    { label: "Cancel", nextStatus: "cancelled", color: "bg-red-600 hover:bg-red-700" },
  ],
  shipped: [
    { label: "Mark as Delivered", nextStatus: "delivered", color: "bg-green-600 hover:bg-green-700" },
  ],
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    if (!orderId) return;
    const supabase = createClient();

    async function fetchOrder() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error || !data) {
        console.error("Order fetch error:", error);
        setLoading(false);
        return;
      }

      setOrder(data);

      if (data.user_id) {
        const { data: user } = await supabase
          .from("users")
          .select("full_name, email")
          .eq("id", data.user_id)
          .single();
        if (user) {
          setCustomerName(user.full_name || "");
          setCustomerEmail(user.email || "");
        }
      } else {
        setCustomerName(data.guest_name || data.guest_email || "Unknown");
        setCustomerEmail(data.guest_email || "");
      }

      setLoading(false);
    }

    fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    const supabase = createClient();
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    setOrder((prev: any) => ({ ...prev, status: newStatus }));
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <Link href="/admin/orders" className="text-green-600 hover:text-green-700 font-medium">
          Back to Orders
        </Link>
      </div>
    );
  }

  const orderItems = order.items || [];
  const shipping = order.shipping || 0;
  const total = order.total || 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString("en-PK")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
            {order.status?.charAt(0).toUpperCase() + (order.status?.slice(1) || "")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {orderItems.length === 0 ? (
                <p className="text-gray-500 text-sm">No items in this order.</p>
              ) : (
                orderItems.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <PlaceholderImage name={item.name || "Item"} className="w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatPrice(total - shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-900">{shipping > 0 ? formatPrice(shipping) : "Free"}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                <span>Total</span>
                <span className="text-green-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Info</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{customerName || "Guest"}</p>
                  <p className="text-xs text-gray-500">{customerEmail}</p>
                </div>
              </div>
              {order.shipping_address && (
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="font-medium text-gray-900 text-sm">{order.shipping_address}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Method</p>
                <p className="font-medium text-gray-900">{order.payment_method || "COD"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {order.payment_status || "Paid"}
                </span>
              </div>
            </div>
          </div>

          {statusActions[order.status] && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                {statusActions[order.status].map((action) => (
                  <button
                    key={action.nextStatus}
                    onClick={() => handleStatusUpdate(action.nextStatus)}
                    disabled={updating}
                    className={`w-full px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${action.color}`}
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
