"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, Loader2, ImageIcon, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string; parent_id: string | null }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);

  const [form, setForm] = useState({
    name: "", slug: "", description: "", sku: "", barcode: "",
    category_id: "", subcategory_id: "", brand_id: "",
    weight: "", unit: "kg", price: "", discount_price: "", stock: "",
    is_featured: false, is_popular: false, is_top_seller: false,
    features: "", usage: "",
  });

  const [mainImage, setMainImage] = useState<string>("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase.from("categories").select("id, name, parent_id").order("sort_order");
      const { data: brs } = await supabase.from("brands").select("id, name").order("name");
      if (cats) setCategories(cats);
      if (brs) setBrands(brs);
    })();
  }, []);

  const parentCategories = categories.filter((c) => !c.parent_id);
  const subCategories = categories.filter((c) => c.parent_id === form.category_id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      ...(name === "name" && !form.slug ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") } : {}),
    }));
  };

  const handleGenerateAI = async () => {
    if (!form.name) {
      alert("Please enter a product name first");
      return;
    }
    setGenerating(true);
    try {
      const catName = parentCategories.find((c) => c.id === form.category_id)?.name || "";
      const res = await fetch("/api/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, category: catName, weight: form.weight }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setForm((prev) => ({
        ...prev,
        description: data.description || prev.description,
        features: data.features?.join("\n") || prev.features,
        usage: data.usage?.join("\n") || prev.usage,
      }));
    } catch (err) {
      alert("Failed to generate: " + (err instanceof Error ? err.message : "Unknown error"));
    }
    setGenerating(false);
  };

  const handleFileUpload = async (files: FileList | null, isGallery = false) => {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("products").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("products").getPublicUrl(path);
        if (isGallery) {
          setGallery((prev) => [...prev, data.publicUrl]);
        } else {
          setMainImage(data.publicUrl);
        }
      }
    }
    setUploading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock || !form.category_id) {
      alert("Please fill required fields");
      return;
    }
    setLoading(true);

    const images = mainImage ? [mainImage, ...gallery] : gallery;
    const discount_percent = form.discount_price && Number(form.discount_price) < Number(form.price)
      ? Math.round(((Number(form.price) - Number(form.discount_price)) / Number(form.price)) * 100)
      : 0;

    const insertData: any = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: form.description,
      sku: form.sku,
      barcode: form.barcode,
      category_id: form.category_id,
      subcategory_id: form.subcategory_id || null,
      brand_id: form.brand_id || null,
      weight: form.weight,
      unit: form.unit,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      discount_percent,
      stock: Number(form.stock),
      images: images.length ? images : ["/images/placeholder.jpg"],
      is_featured: form.is_featured,
      is_popular: form.is_popular,
      is_top_seller: form.is_top_seller,
      rating: 0,
      reviews_count: 0,
    };

    const featuresArr = form.features ? form.features.split("\n").filter(Boolean) : [];
    const usageArr = form.usage ? form.usage.split("\n").filter(Boolean) : [];

    const { data: inserted, error } = await supabase.from("products").insert(insertData).select("id").single();

    setLoading(false);
    if (error) {
      alert("Error: " + error.message);
    } else {
      // Try to update features/usage (works only if columns exist)
      if (inserted?.id && (featuresArr.length || usageArr.length)) {
        const updateData: any = {};
        if (featuresArr.length) updateData.features = featuresArr;
        if (usageArr.length) {
          // Try usage_instructions first (safer column name), fallback to usage
          const { error: e1 } = await supabase.from("products").update({ usage_instructions: usageArr }).eq("id", inserted.id);
          if (e1) await supabase.from("products").update({ usage: usageArr }).eq("id", inserted.id);
        }
        if (featuresArr.length) {
          await supabase.from("products").update({ features: featuresArr }).eq("id", inserted.id);
        }
      }
      alert("Product created!");
      alert("Product created!");
      router.push("/admin/products");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-gray-500">Create a new product listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={generating || !form.name}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-sm font-medium transition-all"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generating ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input type="text" name="slug" value={form.slug} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Features (one per line)</label>
              <textarea name="features" value={form.features} onChange={handleChange} rows={3} placeholder="Premium quality&#10;Long lasting&#10;Family pack"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Usage Instructions (one per line)</label>
              <textarea name="usage" value={form.usage} onChange={handleChange} rows={3} placeholder="Use as directed&#10;Store in cool place&#10;Check expiry date"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Organization</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                <option value="">Select</option>
                {parentCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subcategory</label>
              <select name="subcategory_id" value={form.subcategory_id} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                <option value="">Select</option>
                {subCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <select name="brand_id" value={form.brand_id} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                <option value="">Select</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Weight</label>
              <input type="text" name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 1 kg"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select name="unit" value={form.unit} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                <option value="kg">kg</option><option value="g">g</option><option value="L">L</option>
                <option value="ml">ml</option><option value="pcs">pcs</option><option value="dozen">dozen</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (PKR) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Price</label>
              <input type="number" name="discount_price" value={form.discount_price} onChange={handleChange} step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock *</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input type="text" name="sku" value={form.sku} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Product Image</h2>
          {mainImage ? (
            <div className="relative w-48 h-48 rounded-xl overflow-hidden border">
              <img src={mainImage} alt="Product" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setMainImage("")} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragOver ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-400"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? <Loader2 className="w-12 h-12 text-gray-400 mx-auto animate-spin" /> : <><Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" /><p className="text-gray-600">Click or drag to upload</p></>}
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Gallery Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setGallery((prev) => prev.filter((_, j) => j !== i))} className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full"><X className="w-3 h-3" /></button>
              </div>
            ))}
            <div className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-green-400" onClick={() => galleryInputRef.current?.click()}>
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files, true)} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Options</h2>
          <div className="grid grid-cols-3 gap-4">
            {([["is_featured", "Featured"], ["is_popular", "Popular"], ["is_top_seller", "Top Seller"]] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" name={key} checked={form[key]} onChange={handleChange} className="w-4 h-4 rounded text-green-600" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Link href="/admin/products" className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</Link>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />} Create Product
          </button>
        </div>
      </form>
    </motion.div>
  );
}
