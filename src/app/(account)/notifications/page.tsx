"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Package,
  Tag,
  AlertCircle,
  CheckCircle2,
  CheckCheck,
  Info,
} from "lucide-react";
import { cn } from "@/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { createClient } from "@/lib/supabase/client";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  order: { icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
  promo: { icon: Tag, color: "text-[#EA580C]", bg: "bg-orange-100" },
  system: { icon: AlertCircle, color: "text-purple-600", bg: "bg-purple-100" },
  success: { icon: CheckCircle2, color: "text-[#16A34A]", bg: "bg-green-100" },
  info: { icon: Info, color: "text-gray-600", bg: "bg-gray-100" },
};

export default function NotificationsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications(userId);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-orange-50/50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-8 h-8 text-gray-900" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#16A34A] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={markAllRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#16A34A] hover:bg-green-50 rounded-xl transition-all"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">You&apos;re all caught up!</p>
              </motion.div>
            ) : (
              notifications.map((notif, i) => {
                const tc = typeConfig[notif.type] ?? typeConfig.system;
                const Icon = tc.icon;
                const dateStr = new Date(notif.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ delay: i * 0.03, type: "spring", stiffness: 300, damping: 25 }}
                    className={cn(
                      "bg-white rounded-2xl shadow-md border p-5 transition-all group cursor-pointer hover:shadow-lg",
                      notif.is_read
                        ? "border-gray-100 opacity-70 hover:opacity-100"
                        : "border-[#16A34A]/30 shadow-green-100/20"
                    )}
                    onClick={() => !notif.is_read && markAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.4 }}
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                          tc.bg
                        )}
                      >
                        <Icon className={cn("w-5 h-5", tc.color)} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p
                              className={cn(
                                "font-semibold",
                                notif.is_read ? "text-gray-700" : "text-gray-900"
                              )}
                            >
                              {notif.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
                          </div>
                          {!notif.is_read && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2.5 h-2.5 rounded-full bg-[#16A34A] flex-shrink-0 mt-1.5"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs text-gray-400">{dateStr}</span>
                          {!notif.is_read && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notif.id);
                              }}
                              className="text-xs text-[#16A34A] hover:text-green-700 font-medium"
                            >
                              Mark as read
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
