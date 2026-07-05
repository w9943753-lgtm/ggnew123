"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/utils";

interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

const demoAddresses: Address[] = [
  {
    id: "1",
    label: "Home",
    name: "Abdul Rafey",
    street: "123 Main Street, DHA Phase 5",
    city: "Lahore",
    province: "Punjab",
    postalCode: "54000",
    phone: "+92 300 1234567",
    isDefault: true,
  },
  {
    id: "2",
    label: "Office",
    name: "Abdul Rafey",
    street: "456 Business Avenue, Gulberg III",
    city: "Lahore",
    province: "Punjab",
    postalCode: "54662",
    phone: "+92 300 7654321",
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(demoAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "",
    name: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
  });

  const resetForm = () => {
    setForm({ label: "", name: "", street: "", city: "", province: "", postalCode: "", phone: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (addr: Address) => {
    setForm({
      label: addr.label,
      name: addr.name,
      street: addr.street,
      city: addr.city,
      province: addr.province,
      postalCode: addr.postalCode,
      phone: addr.phone,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...form } : a))
      );
    } else {
      setAddresses((prev) => [
        ...prev,
        { ...form, id: Date.now().toString(), isDefault: false },
      ]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-orange-50/50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#16A34A] text-white text-sm font-semibold rounded-xl shadow-lg shadow-green-200 hover:bg-green-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white rounded-2xl shadow-lg shadow-green-100/30 border border-green-100/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {editingId ? "Edit Address" : "Add New Address"}
                  </h3>
                  <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(
                    [
                      { key: "label", placeholder: "Label (Home, Office)" },
                      { key: "name", placeholder: "Full Name" },
                      { key: "street", placeholder: "Street Address", wide: true },
                      { key: "city", placeholder: "City" },
                      { key: "province", placeholder: "Province" },
                      { key: "postalCode", placeholder: "Postal Code" },
                      { key: "phone", placeholder: "Phone" },
                    ] as { key: keyof typeof form; placeholder: string; wide?: boolean }[]
                  ).map((field) => (
                    <div key={field.key} className={cn(field.wide && "sm:col-span-2")}>
                      <input
                        type="text"
                        value={form[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] outline-none transition-all text-sm"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSave}
                  className="mt-4 w-full py-3 bg-[#16A34A] hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {editingId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {addresses.map((addr, i) => (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "bg-white rounded-2xl shadow-md border p-5 transition-all",
                addr.isDefault
                  ? "border-[#16A34A]/50 shadow-green-100/30"
                  : "border-gray-100"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#16A34A]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{addr.label}</p>
                    {addr.isDefault && (
                      <span className="text-xs text-[#16A34A] font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleDefault(addr.id)}
                      className="p-2 text-gray-400 hover:text-[#16A34A] hover:bg-green-50 rounded-lg transition-all"
                      title="Set as default"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(addr)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{addr.name}</p>
              <p className="text-sm text-gray-600">{addr.street}</p>
              <p className="text-sm text-gray-600">
                {addr.city}, {addr.province} {addr.postalCode}
              </p>
              <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
