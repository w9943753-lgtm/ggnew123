"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function EditBannerPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    position: "home",
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("banners").select("*").eq("id", id).single();
      if (data) {
        setForm({
          title: data.title || "",
          subtitle: data.subtitle || "",
          image: data.image || "",
          link: data.link || "",
          position: data.position || "home",
          is_active: data.is_active ?? true,
          sort_order: data.sort_order || 0,
        });
      }
      setLoading(false);
    })();
  }, [id]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `banners/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("banners").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("banners").getPublicUrl(path);
      setForm((prev) => ({ ...prev, image: data.publicUrl }));
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("banners").update({
      title: form.title,
      subtitle: form.subtitle,
      image: form.image,
      link: form.link,
      position: form.position,
      is_active: form.is_active,
      sort_order: form.sort_order,
    } as any).eq("id", id);
    setSaving(false);
    if (error) {
      alert("Error: " + error.message);
    } else {
      router.push("/admin/banners");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/banners" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Banner</h1>
          <p className="text-gray-500">Update banner details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Banner Details</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Link URL</label>
            <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/categories" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                <option value="home">Home</option>
                <option value="category">Category</option>
                <option value="product">Product</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded text-green-600" />
            <span className="text-sm font-medium">Active</span>
          </label>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Banner Image</h2>
          {form.image ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border">
              <img src={form.image} alt="Banner" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setForm({ ...form, image: "" })} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-green-400" onClick={() => fileInputRef.current?.click()}>
              {uploading ? <Loader2 className="w-12 h-12 text-gray-400 mx-auto animate-spin" /> : <><Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" /><p className="text-gray-600">Click to upload banner image</p></>}
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
        </div>

        <div className="flex gap-4 justify-end">
          <Link href="/admin/banners" className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</Link>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
}
