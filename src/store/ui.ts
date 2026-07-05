"use client";

import { create } from "zustand";

interface UIStore {
  isMobileMenuOpen: boolean;
  isCartDrawerOpen: boolean;
  isSearchOpen: boolean;
  isDarkMode: boolean;
  selectedCity: string;
  toggleMobileMenu: () => void;
  toggleCartDrawer: () => void;
  toggleSearch: () => void;
  toggleDarkMode: () => void;
  setCity: (city: string) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  isMobileMenuOpen: false,
  isCartDrawerOpen: false,
  isSearchOpen: false,
  isDarkMode: false,
  selectedCity: "Karachi",
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  toggleCartDrawer: () => set((s) => ({ isCartDrawerOpen: !s.isCartDrawerOpen })),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
  setCity: (city) => set({ selectedCity: city }),
}));
