"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";
import { cn } from "@/utils";

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const badges: Badge[] = [
  {
    id: "1",
    title: "Fast Delivery",
    description: "Same day delivery",
    icon: <Truck className="w-6 h-6" />,
    color: "text-green-600",
  },
  {
    id: "2",
    title: "100% Original",
    description: "Quality guaranteed",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "text-blue-600",
  },
  {
    id: "3",
    title: "Secure Payment",
    description: "100% secure checkout",
    icon: <CreditCard className="w-6 h-6" />,
    color: "text-purple-600",
  },
  {
    id: "4",
    title: "24/7 Support",
    description: "Dedicated support",
    icon: <Headphones className="w-6 h-6" />,
    color: "text-orange-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function TrustBadges() {
  return (
    <section className="py-12 lg:py-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center bg-gray-50 mb-4",
                  badge.color
                )}
              >
                {badge.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{badge.title}</h3>
              <p className="text-sm text-gray-500">{badge.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
