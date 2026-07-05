import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Brand, Category } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBrandName(brand: Brand | string | null | undefined): string {
  if (!brand) return "";
  if (typeof brand === "string") return brand;
  return brand.name || "";
}

export function getCategoryName(category: Category | string | null | undefined): string {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category.name || "";
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(price: number, discountPrice: number): number {
  if (!price || !discountPrice || price <= discountPrice) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function generateSKU(category: string, id: number): string {
  const prefix = category.slice(0, 3).toUpperCase();
  return `${prefix}-${String(id).padStart(5, "0")}`;
}

export function generateBarcode(): string {
  return Math.floor(Math.random() * 9000000000000 + 1000000000000).toString();
}

export function getTimeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString("en-PK");
}
