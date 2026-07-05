"use client";

import { useState } from "react";

interface PlaceholderImageProps {
  name: string;
  className?: string;
  width?: number;
  height?: number;
}

const COLORS: Record<string, string> = {
  potato: "#4CAF50", tomato: "#E53935", onion: "#8D6E63", banana: "#FDD835",
  apple: "#D32F2F", mango: "#FF8F00", chicken: "#FF7043", beef: "#C62828",
  mutton: "#AD1457", milk: "#1565C0", egg: "#F9A825", bread: "#FF8F00",
  biscuit: "#E65100", soda: "#D50000", cola: "#D50000", pepsi: "#0D47A1",
  water: "#0288D1", aquafina: "#0288D1", tea: "#795548", coffee: "#795548",
  spice: "#4CAF50", masala: "#4CAF50", oil: "#F9A825", dalda: "#F9A825",
  rice: "#FFF9C4", sugar: "#FAFAFA", flour: "#FFF8E1", detergent: "#0277BD",
  surf: "#0277BD", ariel: "#1B5E20", soap: "#E91E63", lux: "#6A1B9A",
  dettol: "#1B5E20", lifebuoy: "#C62828", chip: "#F9A825", lays: "#F9A825",
  diaper: "#E91E63", mamypoko: "#E91E63", panadol: "#0288D1",
  vegetable: "#4CAF50", fruit: "#FF9800", meat: "#E53935", dairy: "#2196F3",
  bakery: "#FF8F00", frozen: "#00BCD4", snack: "#9C27B0", beverage: "#03A9F4",
  clean: "#607D8B", personal: "#E91E63", baby: "#F48FB1", health: "#009688",
  welcome: "#16A34A", eid: "#DC2626", delivery: "#2563EB", ramadan: "#7C3AED",
  lipton: "#F57F17", tapal: "#B71C1C", knorr: "#2E7D32", shan: "#1B5E20",
  national: "#FF6F00", nestle: "#E53935", olper: "#1565C0", peek: "#E65100",
  sooper: "#E65100", nescafe: "#B71C1C", sprite: "#1B5E20",
};

function getColor(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, color] of Object.entries(COLORS)) {
    if (lower.includes(key)) return color;
  }
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = lower.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 45%)`;
}

function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

export default function PlaceholderImage({ name, className = "" }: PlaceholderImageProps) {
  const color = getColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ backgroundColor: color }}
    >
      <span className="text-white font-bold text-center px-2 leading-tight" style={{ fontSize: "clamp(12px, 3vw, 20px)" }}>
        {initials}
      </span>
    </div>
  );
}
