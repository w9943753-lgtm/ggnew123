"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Pencil, Trash2, X, MessageSquare } from "lucide-react";
import { cn } from "@/utils";
import PlaceholderImage from "@/components/ui/placeholder-image";

interface Review {
  id: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
}

const demoReviews: Review[] = [
  {
    id: "1",
    productName: "Premium Wireless Headphones",
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Amazing sound quality and very comfortable. Worth every penny!",
    date: "2025-01-05",
  },
  {
    id: "2",
    productName: "Smart Watch Pro",
    productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
    rating: 4,
    comment: "Great features and build quality. Battery life could be better though.",
    date: "2025-01-03",
  },
  {
    id: "3",
    productName: "USB-C Hub Adapter",
    productImage: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=100&h=100&fit=crop",
    rating: 3,
    comment: "Works fine but gets a bit warm during heavy use. Decent for the price.",
    date: "2024-12-28",
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(demoReviews);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleSave = () => {
    if (!editingReview) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === editingReview.id
          ? { ...r, rating: editRating, comment: editComment }
          : r
      )
    );
    setEditingReview(null);
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-orange-50/50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h1>

        <AnimatePresence>
          {editingReview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white rounded-2xl shadow-lg shadow-green-100/30 border border-green-100/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Edit Review</h3>
                  <button
                    onClick={() => setEditingReview(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-3">{editingReview.productName}</p>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setEditRating(star)}
                      className="transition-colors"
                    >
                      <Star
                        className={cn(
                          "w-7 h-7",
                          star <= editRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] outline-none transition-all text-sm resize-none"
                  placeholder="Write your review..."
                />
                <button
                  onClick={handleSave}
                  className="mt-4 w-full py-3 bg-[#16A34A] hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-200 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500">You haven&apos;t written any reviews.</p>
            </div>
          ) : (
            reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-md shadow-green-100/20 border border-gray-100 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    <PlaceholderImage
                      name={review.productName}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 truncate">{review.productName}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "w-4 h-4",
                                  star <= review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(review)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
