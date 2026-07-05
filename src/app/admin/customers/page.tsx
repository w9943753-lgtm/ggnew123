"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Ban, CheckCircle } from "lucide-react";
import DataTable from "@/components/admin/data-table";
import { formatPrice } from "@/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  status: string;
  joinDate: string;
}

const demoCustomers: Customer[] = [
  { id: "1", name: "Ahmed Khan", email: "ahmed@email.com", phone: "+92 300 1234567", orders: 12, totalSpent: 45000, status: "active", joinDate: "2023-06-15" },
  { id: "2", name: "Fatima Ali", email: "fatima@email.com", phone: "+92 301 2345678", orders: 8, totalSpent: 28000, status: "active", joinDate: "2023-08-20" },
  { id: "3", name: "Muhammad Hassan", email: "hassan@email.com", phone: "+92 302 3456789", orders: 15, totalSpent: 72000, status: "active", joinDate: "2023-04-10" },
  { id: "4", name: "Ayesha Bibi", email: "ayesha@email.com", phone: "+92 303 4567890", orders: 5, totalSpent: 12000, status: "active", joinDate: "2023-11-05" },
  { id: "5", name: "Usman Sheikh", email: "usman@email.com", phone: "+92 304 5678901", orders: 3, totalSpent: 8500, status: "banned", joinDate: "2024-01-01" },
  { id: "6", name: "Zainab Malik", email: "zainab@email.com", phone: "+92 305 6789012", orders: 10, totalSpent: 35000, status: "active", joinDate: "2023-09-12" },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(demoCustomers);

  const handleToggleStatus = (id: string) => {
    setCustomers(
      customers.map((c) =>
        c.id === id ? { ...c, status: c.status === "active" ? "banned" : "active" } : c
      )
    );
  };

  const columns = [
    {
      key: "name",
      label: "Customer",
      sortable: true,
      render: (item: Customer) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {item.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{item.name}</p>
            <p className="text-xs text-gray-500">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (item: Customer) => (
        <span className="text-sm text-gray-600">{item.phone}</span>
      ),
    },
    {
      key: "orders",
      label: "Orders",
      sortable: true,
      render: (item: Customer) => (
        <span className="text-sm text-gray-600">{item.orders}</span>
      ),
    },
    {
      key: "totalSpent",
      label: "Total Spent",
      sortable: true,
      render: (item: Customer) => (
        <span className="font-medium text-gray-900">{formatPrice(item.totalSpent)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: Customer) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            item.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.status === "active" ? "Active" : "Banned"}
        </span>
      ),
    },
    {
      key: "joinDate",
      label: "Joined",
      sortable: true,
      render: (item: Customer) => (
        <span className="text-sm text-gray-500">{item.joinDate}</span>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500">Manage your customer accounts</p>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        keyExtractor={(item) => item.id}
        actions={(item) => (
          <div className="flex items-center gap-1 justify-end">
            <Link
              href={`/admin/customers/${item.id}`}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={() => handleToggleStatus(item.id)}
              className={`p-2 rounded-lg transition-colors ${
                item.status === "active"
                  ? "text-gray-500 hover:text-red-600 hover:bg-red-50"
                  : "text-gray-500 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              {item.status === "active" ? (
                <Ban className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      />
    </motion.div>
  );
}
