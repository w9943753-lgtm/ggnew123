export const SITE_NAME = "Hafiz Store";
export const SITE_DESCRIPTION = "Quality Groceries at Best Prices";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const COLORS = {
  primary: "#FFFFFF",
  secondary: "#16A34A",
  accent: "#EA580C",
  secondaryLight: "#DCFCE7",
  accentLight: "#FED7AA",
} as const;

export const CATEGORIES = [
  "Grocery",
  "Fresh Vegetables",
  "Fresh Fruits",
  "Meat & Fish",
  "Dairy & Eggs",
  "Bakery",
  "Frozen Foods",
  "Snacks",
  "Beverages",
  "Cooking Essentials",
  "Cleaning",
  "Personal Care",
  "Baby Care",
  "Health",
  "Beauty",
  "Pet Food",
  "Stationery",
  "Electronics",
  "Kitchen",
] as const;

export const PAYMENT_METHODS = [
  { id: "cod", name: "Cash on Delivery", icon: "Banknote" },
  { id: "jazzcash", name: "JazzCash", icon: "Smartphone" },
  { id: "easypaisa", name: "EasyPaisa", icon: "Smartphone" },
  { id: "bank_transfer", name: "Bank Transfer", icon: "Building2" },
  { id: "card", name: "Credit/Debit Card", icon: "CreditCard" },
] as const;

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
] as const;

export const FREE_DELIVERY_THRESHOLD = 3000;
export const DELIVERY_CHARGE = 200;
export const TAX_RATE = 0;

export const ITEMS_PER_PAGE = 24;

export const PRODUCT_SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "best_selling", label: "Best Selling" },
] as const;
