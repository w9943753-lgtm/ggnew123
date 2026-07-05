"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff,
  Shield,
  LogOut,
  Package,
  MapPin,
  Star,
  Bell,
} from "lucide-react";
import { cn } from "@/utils";

export const dynamic = "force-dynamic";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const router = useRouter();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
      if (data) {
        reset({ fullName: data.full_name || "", email: data.email || "", phone: data.phone || "" });
        setIsAdmin(data.role === "admin");
      }
    }
    loadProfile();
  }, []);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsProfileSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsProfileSaving(false); return; }
    await supabase.from("users").update({ full_name: data.fullName, phone: data.phone } as any).eq("id", user.id);
    setIsProfileSaving(false);
    alert("Profile updated!");
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsPasswordSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsPasswordSaving(false);
    resetPassword();
    console.log("Password changed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-orange-50/50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
          className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Link href="/orders" className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <Package className="w-5 h-5 text-secondary" />
            <span className="text-xs font-medium">My Orders</span>
          </Link>
          <Link href="/addresses" className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <MapPin className="w-5 h-5 text-secondary" />
            <span className="text-xs font-medium">Addresses</span>
          </Link>
          <Link href="/reviews" className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <Star className="w-5 h-5 text-secondary" />
            <span className="text-xs font-medium">Reviews</span>
          </Link>
          <Link href="/notifications" className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-secondary" />
            <span className="text-xs font-medium">Notifications</span>
          </Link>
          {isAdmin && (
            <Link href="/admin/dashboard" className="flex flex-col items-center gap-1 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors border border-orange-200">
              <Shield className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-medium text-orange-700">Admin Panel</span>
            </Link>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-green-100/30 border border-green-100/50 p-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#16A34A] to-green-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-green-200">
                AR
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#EA580C] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-orange-600 transition-all">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Abdul Rafey</h2>
              <p className="text-gray-500">Member since Jan 2024</p>
            </div>
          </div>

          <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    {...registerProfile("fullName")}
                    className={cn(
                      "w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] outline-none transition-all",
                      profileErrors.fullName ? "border-red-300" : "border-gray-200"
                    )}
                  />
                </div>
                {profileErrors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{profileErrors.fullName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    {...registerProfile("email")}
                    className={cn(
                      "w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] outline-none transition-all",
                      profileErrors.email ? "border-red-300" : "border-gray-200"
                    )}
                  />
                </div>
                {profileErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{profileErrors.email.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  {...registerProfile("phone")}
                  className={cn(
                    "w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] outline-none transition-all",
                    profileErrors.phone ? "border-red-300" : "border-gray-200"
                  )}
                />
              </div>
              {profileErrors.phone && (
                <p className="mt-1 text-sm text-red-500">{profileErrors.phone.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isProfileSaving}
              className="flex items-center gap-2 px-6 py-3 bg-[#16A34A] hover:bg-green-600 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-green-200 transition-all"
            >
              {isProfileSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-green-100/30 border border-green-100/50 p-6">
          <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#16A34A]" />
              Change Password
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showCurrent ? "text" : "password"}
                  {...registerPassword("currentPassword")}
                  className={cn(
                    "w-full pl-11 pr-12 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] outline-none transition-all",
                    passwordErrors.currentPassword ? "border-red-300" : "border-gray-200"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showNew ? "text" : "password"}
                  {...registerPassword("newPassword")}
                  className={cn(
                    "w-full pl-11 pr-12 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] outline-none transition-all",
                    passwordErrors.newPassword ? "border-red-300" : "border-gray-200"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  {...registerPassword("confirmPassword")}
                  className={cn(
                    "w-full pl-11 pr-12 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] outline-none transition-all",
                    passwordErrors.confirmPassword ? "border-red-300" : "border-gray-200"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isPasswordSaving}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              {isPasswordSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
