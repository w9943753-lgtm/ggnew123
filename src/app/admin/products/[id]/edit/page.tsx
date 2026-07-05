"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, Loader2, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string; parent_id: string | null }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);

  const [form, setForm] = useState({
    name: "", slug: "", description: "", sku: "", barcode: "",
    category_id: "", subcategory_id: "", brand_id: "",
    weight: "", unit: "kg", price: "", discount_price: "", stock: "",
    is_featured: false, is_popular: false, is_top_seller: false,
  });

  const [mainImage, setMainImage] = useState<string>("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    (async () => {
      const [productRes, catsRes, brsRes] = await Promise.all([
        supabase.from("products").select("*").eq("id", productId).single(),
        supabase.from("categories").select("id, name, parent_id").order("sort_order"),
        supabase.from("brands").select("id, name").order("name"),
      ]);

      if (productRes.data) {
        const p = productRes.data;
        setForm({
          name: p.name || "",
          slug: p.slug || "",
          description: p.description || "",
          sku: p.sku || "",
          barcode: p.barcode || "",
          category_id: p.category_id || "",
          subcategory_id: p.subcategory_id || "",
          brand_id: p.brand_id || "",
          weight: p.weight || "",
          unit: p.unit || "kg",
          price: p.price?.toString() || "",
          discount_price: p.discount_price?.toString() || "",
          stock: p.stock?.toString() || "",
          is_featured: p.is_featured || false,
          is_popular: p.is_popular || false,
          is_top_seller: p.is_top_seller || false,
        });

        const images = p.images || [];
        if (images.length > 0) {
          setMainImage(images[0]);
          setGallery(images.slice(1));
        }
      }

      if (catsRes.data) setCategories(catsRes.data);
      if (brsRes.data) setBrands(brsRes.data);

      setFetching(false);
    })();
  }, [productId]);

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

    const { error } = await supabase.from("products").update({
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
    }).eq("id", productId);

    setLoading(false);
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Product updated!");
      router.push("/admin/products");
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-gray-500">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
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
            {loading && <Loader2 className="w-4 h-4 animate-spin" />} Update Product
          </button>
        </div>
      </form>
    </motion.div>
  );
}
