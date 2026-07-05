"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Upload, Loader2, CheckCircle2, Palette, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroBgInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logo, setLogo] = useState("");
  const [heroBgImage, setHeroBgImage] = useState("");
  const [heroBgUploading, setHeroBgUploading] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "",
    storePhone: "",
    storeEmail: "",
    storeAddress: "",
    currency: "PKR",
    deliveryCharge: "",
    freeDeliveryThreshold: "",
    heroBgColor: "#16A34A",
    heroTextColor: "#FFFFFF",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from("settings").select("*");
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((row: any) => {
        map[row.key] = row.value;
      });
      setLogo(map.logo ? JSON.parse(map.logo) : "");
      setHeroBgImage(map.heroBgImage || "");
      setSettings({
        storeName: map.storeName || "",
        storePhone: map.storePhone || "",
        storeEmail: map.storeEmail || "",
        storeAddress: map.storeAddress || "",
        currency: map.currency || "PKR",
        deliveryCharge: map.deliveryCharge || "",
        freeDeliveryThreshold: map.freeDeliveryThreshold || "",
        heroBgColor: map.heroBgColor || "#16A34A",
        heroTextColor: map.heroTextColor || "#FFFFFF",
      });
    }
    setLoading(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `logo-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("brands")
      .upload(fileName, file);

    if (error) {
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("brands").getPublicUrl(fileName);
    const url = data.publicUrl;

    setLogo(url);
    await supabase
      .from("settings")
      .upsert({ key: "logo", value: JSON.stringify(url) });
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const entries = Object.entries(settings);
    for (const [key, value] of entries) {
      await supabase
        .from("settings")
        .upsert({ key, value: value || "" });
    }
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroBgUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `hero-bg-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("banners").upload(fileName, file);
    if (error) {
      alert("Upload failed: " + error.message);
      setHeroBgUploading(false);
      return;
    }
    const { data } = supabase.storage.from("banners").getPublicUrl(fileName);
    setHeroBgImage(data.publicUrl);
    await supabase.from("settings").update({ value: data.publicUrl }).eq("key", "heroBgImage");
    setHeroBgUploading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Configure your store settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : success ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : success ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Logo Upload */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Logo</h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            {logo ? (
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <span className="text-gray-400 text-sm">No Logo</span>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? "Uploading..." : "Upload Logo"}
            </button>
            <p className="text-xs text-gray-400 mt-1">Recommended: 200x200px</p>
          </div>
        </div>
      </div>

      {/* Store Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Store Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) =>
                setSettings({ ...settings, storeName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={settings.storePhone}
              onChange={(e) =>
                setSettings({ ...settings, storePhone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={settings.storeEmail}
              onChange={(e) =>
                setSettings({ ...settings, storeEmail: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) =>
                setSettings({ ...settings, currency: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="PKR">Pakistani Rupee (PKR)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={settings.storeAddress}
              onChange={(e) =>
                setSettings({ ...settings, storeAddress: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Delivery Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Charge (Rs.)
            </label>
            <input
              type="number"
              value={settings.deliveryCharge}
              onChange={(e) =>
                setSettings({ ...settings, deliveryCharge: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Free Delivery Threshold (Rs.)
            </label>
            <input
              type="number"
              value={settings.freeDeliveryThreshold}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  freeDeliveryThreshold: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Orders above this amount get free delivery
            </p>
          </div>
        </div>
      </div>

      {/* Homepage Background Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Homepage Hero Background</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.heroBgColor}
                onChange={(e) => setSettings({ ...settings, heroBgColor: e.target.value })}
                className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={settings.heroBgColor}
                onChange={(e) => setSettings({ ...settings, heroBgColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Click the color box to pick a color</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.heroTextColor}
                onChange={(e) => setSettings({ ...settings, heroTextColor: e.target.value })}
                className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={settings.heroTextColor}
                onChange={(e) => setSettings({ ...settings, heroTextColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image (optional, overrides color)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-40 h-24 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                {heroBgImage ? (
                  <img src={heroBgImage} alt="Hero BG" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div>
                <input
                  ref={heroBgInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeroBgUpload}
                  className="hidden"
                />
                <button
                  onClick={() => heroBgInputRef.current?.click()}
                  disabled={heroBgUploading}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {heroBgUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {heroBgUploading ? "Uploading..." : "Upload Image"}
                </button>
                {heroBgImage && (
                  <button
                    onClick={async () => {
                      setHeroBgImage("");
                      await supabase.from("settings").update({ value: "" }).eq("key", "heroBgImage");
                    }}
                    className="ml-2 text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
                <p className="text-xs text-gray-400 mt-1">Recommended: 1920x600px</p>
              </div>
            </div>
          </div>
          {/* Preview */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div
              className="rounded-xl p-6 text-center"
              style={{
                backgroundColor: settings.heroBgColor,
                color: settings.heroTextColor,
                backgroundImage: heroBgImage ? `url(${heroBgImage})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="text-xl font-bold">Hafiz Store</h3>
              <p className="text-sm opacity-80">Fresh Groceries Delivered</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
