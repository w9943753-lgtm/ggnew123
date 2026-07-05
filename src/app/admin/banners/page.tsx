"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PlaceholderImage from "@/components/ui/placeholder-image";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  position: string;
  sort_order: number;
  is_active: boolean;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-full sm:w-48 h-24 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BannersPage() {
  const supabase = createClient();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    const { data } = await supabase.from("banners").select("*").order("sort_order");
    if (data) setBanners(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (!error) setBanners(banners.filter((b) => b.id !== id));
  };

  const handleToggleActive = async (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (!banner) return;
    const { error } = await supabase
      .from("banners")
      .update({ is_active: !banner.is_active })
      .eq("id", id);
    if (!error) {
      setBanners(banners.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b)));
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-500">Manage homepage banners</p>
        </div>
        <Link
          href="/admin/banners/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Banner
        </Link>
      </div>

      <div className="space-y-4">
        {banners.map((banner) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-full sm:w-48 h-24 rounded-lg overflow-hidden flex-shrink-0">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <PlaceholderImage name={banner.title || "Banner"} className="w-full h-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{banner.title}</h3>
                    <p className="text-sm text-gray-500">{banner.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 capitalize">
                      {banner.position}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      #{banner.sort_order}
                    </span>
                    <button
                      onClick={() => handleToggleActive(banner.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        banner.is_active
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Link
                    href={`/admin/banners/${banner.id}/edit`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No banners yet. Create one to get started.
          </div>
        )}
      </div>
    </motion.div>
  );
}
