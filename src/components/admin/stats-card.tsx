"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "up" | "down";
  icon: React.ReactNode;
  color?: "green" | "orange" | "blue" | "purple";
}

const colorMap = {
  green: {
    bg: "bg-green-50",
    icon: "bg-green-100 text-green-600",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "bg-orange-100 text-orange-600",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-100 text-purple-600",
  },
};

export default function StatsCard({
  title,
  value,
  change,
  changeType = "up",
  icon,
  color = "green",
}: StatsCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const numericValue =
    typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;
  const prefix = typeof value === "string" ? value.replace(/[0-9.-]/g, "") : "";

  useEffect(() => {
    if (typeof value === "string" && value.includes("%")) return;
    if (typeof value === "string" && value.includes(",")) return;
    if (isNaN(numericValue)) return;

    const duration = 1000;
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setAnimatedValue(numericValue);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numericValue, value]);

  const displayValue = (() => {
    if (typeof value === "string" && value.includes("%")) {
      return `${animatedValue}%`;
    }
    if (typeof value === "string" && value.includes(",")) {
      return animatedValue.toLocaleString();
    }
    if (typeof value === "string" && value.startsWith("$")) {
      return `$${animatedValue.toLocaleString()}`;
    }
    return animatedValue.toLocaleString();
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{displayValue}</p>
        </div>
        <div className={cn("p-3 rounded-xl", colorMap[color].icon)}>{icon}</div>
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {changeType === "up" ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span
            className={cn(
              "text-sm font-medium",
              changeType === "up" ? "text-green-500" : "text-red-500"
            )}
          >
            {change}%
          </span>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}
