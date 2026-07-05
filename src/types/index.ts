export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parent_id?: string | null;
  sort_order?: number;
  is_active?: boolean;
  product_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug?: string;
  logo?: string | null;
  description?: string | null;
  is_active?: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sku?: string;
  barcode?: string;
  brand_id?: string | null;
  brand?: Brand | string | null;
  category_id?: string;
  category?: Category | string | null;
  subcategory_id?: string | null;
  subcategory?: Category | null;
  weight?: string;
  unit?: string;
  price: number;
  discount_price?: number | null;
  discount_percent?: number;
  stock?: number;
  images: string[];
  gallery_images?: string[];
  is_featured?: boolean;
  is_popular?: boolean;
  is_top_seller?: boolean;
  is_new_arrival?: boolean;
  is_flash_sale?: boolean;
  rating?: number;
  reviews_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  area: string;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  guest_email: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  status: string;
  subtotal: number;
  delivery_charge: number;
  tax: number;
  discount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  shipping_address: Address;
  billing_address: Address | null;
  notes: string | null;
  coupon_code: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product: Product | null;
  quantity: number;
  price: number;
  total: number;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  images: string[];
  is_verified: boolean;
  created_at: string;
  user?: { full_name: string; avatar: string | null };
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order: number;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  position: string;
  is_active: boolean;
  sort_order: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar: string | null;
  role: "customer" | "admin";
  is_active: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  data: Record<string, unknown> | null;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  created_at: string;
}

export interface DashboardStats {
  total_sales: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  pending_orders: number;
  low_stock_products: number;
  monthly_revenue: { month: string; revenue: number }[];
  orders_by_status: { status: string; count: number }[];
  top_products: { product: Product; total_sold: number; revenue: number }[];
  recent_orders: Order[];
}

export interface SearchFilters {
  query: string;
  category: string;
  subcategory: string;
  brand: string;
  min_price: number;
  max_price: number;
  min_rating: number;
  in_stock: boolean;
  on_sale: boolean;
  sort: string;
  page: number;
  limit: number;
}
