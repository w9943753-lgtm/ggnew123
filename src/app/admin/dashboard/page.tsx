"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import StatsCard from "@/components/admin/stats-card";
import { formatPrice } from "@/utils";
import { createClient } from "@/lib/supabase/client";

type OrderRow = {
  id: string;
  user_id: string | null;
  guest_email: string | null;
  guest_name: string | null;
  status: string;
  total: number;
  created_at: string;
};

type LowStockProduct = { name: string; stock: number };

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded w-32" />
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>
          <div className="space-y-2 text-right">
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-3 bg-gray-200 rounded w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [productsCount, setProductsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const supabase = createClient();

    async function fetchDashboardData() {
      const [ordersRes, productsRes, customersRes, usersRes, lowStockRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("id", { count: "exact" }),
        supabase.from("users").select("id", { count: "exact" }).eq("role", "customer"),
        supabase.from("users").select("id, full_name"),
        supabase
          .from("products")
          .select("name, stock")
          .lte("stock", 10)
          .order("stock", { ascending: true }),
      ]);

      const allOrders = (ordersRes.data ?? []) as OrderRow[];
      setOrders(allOrders);
      setProductsCount(productsRes.count ?? 0);
      setCustomersCount(customersRes.count ?? 0);
      setRecentOrders(allOrders.slice(0, 5));
      setLowStockProducts((lowStockRes.data ?? []) as LowStockProduct[]);

      const revenue = allOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);
      setTotalRevenue(revenue);

      const pending = allOrders.filter((o) => o.status === "pending").length;
      setPendingOrdersCount(pending);

      if (usersRes.data) {
        const map: Record<string, string> = {};
        usersRes.data.forEach((u: { id: string; full_name: string }) => {
          map[u.id] = u.full_name;
        });
        setUserMap(map);
      }

      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  const getCustomerName = (order: OrderRow) => {
    if (order.user_id && userMap[order.user_id]) return userMap[order.user_id];
    if (order.guest_name) return order.guest_name;
    if (order.guest_email) return order.guest_email;
    return "Unknown";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : (
            <>
              <StatsCard
                title="Total Revenue"
                value={formatPrice(totalRevenue)}
                icon={<DollarSign className="w-6 h-6" />}
                color="green"
              />
              <StatsCard
                title="Total Orders"
                value={orders.length.toLocaleString()}
                icon={<ShoppingCart className="w-6 h-6" />}
                color="orange"
              />
              <StatsCard
                title="Total Products"
                value={productsCount.toLocaleString()}
                icon={<Package className="w-6 h-6" />}
                color="blue"
              />
              <StatsCard
                title="Total Customers"
                value={customersCount.toLocaleString()}
                icon={<Users className="w-6 h-6" />}
                color="purple"
              />
              <StatsCard
                title="Pending Orders"
                value={pendingOrdersCount.toLocaleString()}
                icon={<AlertTriangle className="w-6 h-6" />}
                color="orange"
              />
            </>
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500 font-medium">{formatPrice(totalRevenue)}</span>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-green-50 to-orange-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-500">Revenue Overview</p>
              <p className="text-xs text-gray-400">Total: {formatPrice(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h2>
          {loading ? (
            <SkeletonRows count={3} />
          ) : lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">All products are well stocked</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center gap-3 p-3 bg-red-50 rounded-lg"
                >
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-red-600">
                      {product.stock} left in stock
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
        {loading ? (
          <SkeletonRows />
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 text-sm font-medium text-gray-900">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {getCustomerName(order)}
                    </td>
                    <td className="py-3 text-sm font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                          statusColors[order.status] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-PK")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
