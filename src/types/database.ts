export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image: string | null;
          parent_id: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["brands"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["brands"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          sku: string;
          barcode: string;
          brand_id: string | null;
          category_id: string;
          subcategory_id: string | null;
          weight: string;
          unit: string;
          price: number;
          discount_price: number | null;
          discount_percent: number;
          stock: number;
          images: string[];
          gallery_images: string[];
          is_featured: boolean;
          is_popular: boolean;
          is_top_seller: boolean;
          is_new_arrival: boolean;
          is_flash_sale: boolean;
          rating: number;
          reviews_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar: string | null;
          role: "customer" | "admin";
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      addresses: {
        Row: {
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
        };
        Insert: Omit<Database["public"]["Tables"]["addresses"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
      };
      orders: {
        Row: {
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
          shipping_address: Json;
          billing_address: Json | null;
          notes: string | null;
          coupon_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          total: number;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          rating: number;
          comment: string;
          images: string[];
          is_verified: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      coupons: {
        Row: {
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
        };
        Insert: Omit<Database["public"]["Tables"]["coupons"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["coupons"]["Insert"]>;
      };
      banners: {
        Row: {
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
        };
        Insert: Omit<Database["public"]["Tables"]["banners"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["banners"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          is_read: boolean;
          data: Json | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["wishlist"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["wishlist"]["Insert"]>;
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["settings"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
