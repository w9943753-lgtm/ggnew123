"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, ShoppingCart, Heart, User } from "lucide-react";
import { cn } from "@/utils";
import { useCartStore } from "@/store/cart";
import { createClient } from "@/lib/supabase/client";

export default function MobileNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/categories", icon: Grid3X3, label: "Categories" },
    { href: "/cart", icon: ShoppingCart, label: "Cart" },
    { href: "/wishlist", icon: Heart, label: "Wishlist" },
    { href: user ? "/profile" : "/login", icon: User, label: "Account" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors",
                isActive ? "text-secondary" : "text-gray-400"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5", isActive && "fill-secondary/10")} />
                {item.label === "Cart" && itemCount > 0 && (
                  <span className="absolute -top-2 -right-3 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
